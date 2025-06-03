/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 * Contient toutes les classes relatives aux calculs de courbes de calibration.
 */
import { arrondir8Chiffres, multiply, inverse, transpose, multipleLinearRegression } from '@/assets/js/Calibration/utils.js';
import { EquationLineaire, EquationLogarithmique, EquationLogarithmiqueQuadratique } from '@/assets/js/Objects/Calcul.js';
import Session from '@/assets/js/Session/Session.js'
import TableauDonnees from "@/assets/js/Calibration/TableauxDonnees.js";


/**
 * =====================================================================================================================
 * Classe de base pour les calculs de courbes
 * ====================================================================================================================
 */
class CalculCourbe {


    /**
     * Constructeur de la classe de base
     * @param {Object} traceur - Le traceur concerné
     * @param {number} idLampe - L'ID de la lampe concernée
     */
    constructor(traceur, idLampe) {
        this.traceur = traceur;
        this.idLampe = idLampe;
        this.equation = null;
        this.nbValeurLampe = this.compterValeursLampe();
    }


    /**
     * Compte le nombre de valeurs non-NaN pour la lampe
     * @return {number} Le nombre de valeurs pour la lampe
     */
    compterValeursLampe() {
        let compteur = 0;
        for (let i = 0; i < this.traceur.echelles.length; i++) {
            if (!isNaN(this.traceur.getDataParNom('L' + this.idLampe + '-' + (i + 1)))) {
                compteur++;
            }
        }
        return compteur;
    }


    /**
     * Effectue les calculs nécessaires
     * @return {Array} Résultats des calculs
     */
    calculer() {
        throw new Error('Méthode non implémentée dans la classe de base');
    }


    /**
     * Récupère l'équation résultante
     * @return {Object} L'équation calculée
     */
    getEquation() {
        return this.equation;
    }
}

/**
 * ====================================================================================================================
 * Classe pour les calculs de courbes de concentration
 * ===================================================================================================================
 */
class CalculCourbeConcentration extends CalculCourbe {


    /**
     * Effectue les calculs nécessaires pour les courbes de concentration
     * @return {Array} Résultats des calculs
     */
    calculer() {
        if (this.nbValeurLampe === 1) {
            return this.calculerConcentration1Valeur();
        } else if (this.nbValeurLampe < 4) {
            return this.calculerConcentration3Valeurs();
        } else {
            return this.calculerConcentration4Valeurs();
        }
    }


    /**
     * Calcul de concentration avec une seule valeur
     * @return {Array} Résultats des calculs
     */
    calculerConcentration1Valeur() {
        const eau = Session.getInstance().traceurs.find(traceur => traceur.unite === '');
        const dmv = [];
        let temp = 0;
        const y = [];
        y.push(0);
        dmv.push(0);

        for (let i = 1; i <= this.traceur.echelles.length; i++) {
            if (!isNaN(this.traceur.getDataParNom('L' + this.idLampe + '-' + i))) {
                temp = this.traceur.getDataParNom('L' + this.idLampe + '-' + i);
                y.push(this.traceur.echelles[i - 1]);
            }
        }

        dmv.push(temp - eau.getDataParNom('L' + this.idLampe + '-1'));
        const resultat = [arrondir8Chiffres((y[1] - y[0]) / (dmv[1] - dmv[0]))];

        // Créer l'équation
        this.equation = new EquationLineaire();
        this.equation.ajouterParametreCalcul('a1', resultat[0]);
        this.equation.ajouterParametreCalcul('X0', eau.getDataParNom('L' + this.idLampe + '-1'));
        this.equation.ajouterParametreCalcul('Y0', 0);

        return resultat;
    }


    /**
     * Calcul de concentration avec 2 ou 3 valeurs
     * @return {Array} Résultats des calculs
     */
    calculerConcentration3Valeurs() {
        const dmV = TableauDonnees.creerTableauValeursNettes(this.traceur, this.idLampe);
        let X = TableauDonnees.creerMatriceLn(this.traceur, dmV);
        X = inverse(X);
        const eau = Session.getInstance().traceurs.find(traceur => traceur.unite === '');
        const matriceEntetes = dmV[0];
        const coeffs = multiply([matriceEntetes], X);

        if (this.traceur.unite.toLowerCase() === 'ntu') {
            const matriceLnEchelles = dmV[0];
            let matriceMv = [];

            for (let i = 0; i < matriceLnEchelles.length; i += 1) {
                matriceMv.push([1]);
                matriceMv[i].push(Math.log(this.traceur.getDataParNom('L' + this.traceur.lampePrincipale + '-' + (i + 1)) - eau.getDataParNom('L' + this.traceur.lampePrincipale + '-1')));
                matriceMv[i].push(matriceMv[i][1] ** 2);
            }

            matriceMv = transpose(matriceMv);
            matriceMv = inverse(matriceMv);
            const coeffsTurbidite = multiply([matriceLnEchelles], matriceMv);

            this.equation = new EquationLogarithmiqueQuadratique();
            this.equation.ajouterParametreCalcul('a0', coeffsTurbidite[0][0]);
            this.equation.ajouterParametreCalcul('a1', coeffsTurbidite[0][1]);
            this.equation.ajouterParametreCalcul('a2', coeffsTurbidite[0][2]);
            this.equation.ajouterParametreCalcul('X0', eau.getDataParNom('L' + this.idLampe + '-1'));
            this.equation.ajouterParametreCalcul('Y0', 0);

            return coeffsTurbidite;
        } else {
            this.equation = new EquationLogarithmique();
            this.equation.ajouterParametreCalcul('a0', coeffs[0][0]);
            this.equation.ajouterParametreCalcul('a1', coeffs[0][1]);
            this.equation.ajouterParametreCalcul('X0', eau.getDataParNom('L' + this.idLampe + '-1'));
            this.equation.ajouterParametreCalcul('Y0', 0);

            return coeffs;
        }
    }


    /**
     * Calcul de concentration avec 4 valeurs ou plus
     * @return {Array} Résultats des calculs
     */
    calculerConcentration4Valeurs() {
        const regLin = TableauDonnees.creerTableauValeursNettesLn(this.traceur, this.idLampe);
        let colonne1 = [];
        let colonne2 = [];
        let colonne3 = [];

        for (let i = 0; i < regLin.length; i++) {
            colonne1.push(regLin[i][0]);
            colonne2.push(regLin[i][1]);
            colonne3.push(regLin[i][2]);
        }

        let colonne2_3 = [];
        for (let i = 0; i < colonne2.length; i++) {
            colonne2_3.push([1, colonne2[i], colonne3[i]]);
        }

        let resultat = multipleLinearRegression(colonne2_3, [colonne1]);
        resultat = transpose(resultat);

        this.equation = new EquationLogarithmiqueQuadratique();
        this.equation.ajouterParametreCalcul('a0', resultat[0][0]);
        this.equation.ajouterParametreCalcul('a1', resultat[0][1]);
        this.equation.ajouterParametreCalcul('a2', resultat[0][2]);
        this.equation.ajouterParametreCalcul('X0', 0.1);
        this.equation.ajouterParametreCalcul('Y0', 0);

        const { erreurType } = TableauDonnees.creerTableauIntervaleConfiance(
            colonne1, colonne2, [resultat[0][0], resultat[0][1], resultat[0][2]]
        );

        resultat.push(erreurType);
        return resultat;
    }
}


/**
 * =====================================================================================================================
 * Classe pour les calculs de courbes parasites
 * =====================================================================================================================
 */
class CalculCourbeParasite extends CalculCourbe {


    /**
     * Effectue les calculs nécessaires pour les courbes parasites
     * @return {Array} Résultats des calculs
     */
    calculer() {
        if (this.nbValeurLampe === 1) {
            return this.calculerParasite1Valeur();
        } else if (this.nbValeurLampe === 2) {
            return this.calculerParasite2Valeurs();
        } else if (this.nbValeurLampe < 4) {
            return this.calculerParasite3Valeurs();
        } else {
            return this.calculerParasite4Valeurs();
        }
    }


    /**
     * Calcul parasite avec une seule valeur
     * @return {Array} Résultats des calculs
     */
    calculerParasite1Valeur() {
        let index = 0;

        for (let i = 1; i <= this.traceur.echelles.length; i++) {
            if (!isNaN(this.traceur.getDataParNom('L' + this.idLampe + '-' + i))) {
                index = i;
                break;
            }
        }

        const eau = Session.getInstance().traceurs.find(traceur => traceur.unite === '');
        const eauValeurLampePrincipale = eau.getDataParNom('L' + this.traceur.lampePrincipale + '-1');
        const eauValeurLampe = eau.getDataParNom('L' + this.idLampe + '-1');

        const pointX = this.traceur.getDataParNom('L' + this.traceur.lampePrincipale + '-' + index);
        const pointY = this.traceur.getDataParNom('L' + this.idLampe + '-' + index);

        const a0 = (pointY - eauValeurLampe) / (pointX - eauValeurLampePrincipale);

        this.equation = new EquationLineaire();
        this.equation.ajouterParametreCalcul('a1', a0);
        this.equation.ajouterParametreCalcul('X0', eauValeurLampePrincipale);
        this.equation.ajouterParametreCalcul('Y0', eauValeurLampe);

        return [[(pointY - eauValeurLampe) / (pointX - eauValeurLampePrincipale), NaN, NaN]];
    }


    /**
     * Calcul parasite avec 2 valeurs
     * @return {Array} Résultats des calculs
     */
    calculerParasite2Valeurs() {
        return this.calculerParasite3Valeurs();
    }


    /**
     * Calcul parasite avec 3 valeurs
     * @return {Array} Résultats des calculs
     */
    calculerParasite3Valeurs() {
        const eau = Session.getInstance().traceurs.find(traceur => traceur.unite === '');
        const ln = [];
        const l4Net = [];
        const X = [];

        for (let i = 1; i <= this.traceur.echelles.length; i++) {
            if (!isNaN(this.traceur.getDataParNom('L' + this.idLampe + '-' + i))) {
                ln.push(arrondir8Chiffres(Math.log(this.traceur.getDataParNom('L' + this.idLampe + '-' + i) - eau.getDataParNom('L' + this.idLampe + '-1'))));
            }
            if (!isNaN(this.traceur.getDataParNom('L' + this.traceur.lampePrincipale + '-' + i))) {
                l4Net.push(arrondir8Chiffres(this.traceur.getDataParNom('L' + this.traceur.lampePrincipale + '-' + i) - eau.getDataParNom('L' + this.traceur.lampePrincipale + '-1')));
            }
        }

        for (let i = 0; i < 3; i++) {
            const ligne = [];
            for (let j = 0; j < ln.length; j++) {
                ligne.push(arrondir8Chiffres(Math.log(l4Net[j]) ** i));
            }
            X.push(ligne);
        }

        const Xinverse = inverse(X);
        return (multiply([ln], Xinverse));
    }


    /**
     * Calcul parasite avec 4 valeurs ou plus
     * @return {Array} Résultats des calculs
     */
    calculerParasite4Valeurs() {
        let Y = [];
        let X = [];
        const eau = Session.getInstance().traceurs.find(traceur => traceur.unite === '');

        for (let i = 0; i < this.nbValeurLampe; i++) {
            Y.push(Math.log(this.traceur.getDataParNom('L' + this.idLampe + '-' + (i + 1)) - eau.getDataParNom('L' + this.idLampe + '-1')));
            const ligne = [];
            ligne.push(1);
            const data = Math.log(this.traceur.getDataParNom('L' + this.traceur.lampePrincipale + '-' + (i + 1)) - eau.getDataParNom('L' + this.traceur.lampePrincipale + '-1'));
            ligne.push(data);
            ligne.push(data ** 2);
            X.push(ligne);
        }

        Y = transpose([Y]);
        let XT = transpose(X);
        let Xmultiply = multiply(XT, X);
        Xmultiply = inverse(Xmultiply);
        let beforeRegression = multiply(Xmultiply, XT);

        let final = multiply(beforeRegression, Y);
        final = transpose(final);

        this.equation = new EquationLogarithmiqueQuadratique();
        this.equation.ajouterParametreCalcul('a0', final[0][0]);
        this.equation.ajouterParametreCalcul('a1', final[0][1]);
        this.equation.ajouterParametreCalcul('a2', final[0][2]);
        this.equation.ajouterParametreCalcul('X0', eau.getDataParNom('L' + this.traceur.lampePrincipale + '-1'));
        this.equation.ajouterParametreCalcul('Y0', eau.getDataParNom('L' + this.idLampe + '-1'));

        X = X.map(ligne => ligne.slice(1));

        let derniereColonne = 0;

        for (let i = 0; i < this.nbValeurLampe; i++) {
            const data = X[i][0];
            const data2 = final[0][0] + final[0][1] * data + final[0][2] * data ** 2;
            derniereColonne += (Y[i][0] - data2) ** 2;
        }

        const erreurType = 1.96 * (Math.sqrt(derniereColonne / (this.nbValeurLampe - 3)));
        final.push(erreurType);
        return final;
    }
}

export default {
    CalculCourbe,
    CalculCourbeConcentration,
    CalculCourbeParasite
};

