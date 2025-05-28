/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 * Ce fichier permet la logique nécessaire pour créer et calculer des tableaux/matrices VIRTUELS permettant les calculs de la partie Calibration
 */
import { ln, arrondir8Chiffres } from './utils.js';
import Session from "@/assets/js/Session/Session.js";

/**
 * =====================================================================================================================
 * Classe pour générer et manipuler des tableaux de données
 * =====================================================================================================================
 */
export class TableauDonnees {


    /**
     * Crée un tableau de valeurs nettes pour un traceur et une lampe donnée
     * @param {Object} traceur - Le traceur
     * @param {number} lampe - ID de la lampe
     * @return {Array<Array<number>>} Tableau des valeurs nettes
     */
    static creerTableauValeursNettes(traceur, lampe) {
        const eau = Session.getInstance().traceurs.find(traceur => traceur.unite === '');
        const valeursNettes = [];

        const echelles = traceur.echelles.map(echelle => arrondir8Chiffres(ln(echelle)));
        valeursNettes.push(echelles);

        const ligne = [];
        for (let j = 1; j <= traceur.echelles.length; j++) {
            const signal = traceur.getDataParNom('L' + lampe + '-' + j) - eau.getDataParNom('L' + lampe + '-1');
            ligne.push(arrondir8Chiffres(signal));
        }
        valeursNettes.push(ligne);

        return valeursNettes;
    }


    /**
     * Crée un tableau de valeurs nettes avec logarithme népérien pour un traceur et une lampe donnée
     * @param {Object} traceur - Le traceur
     * @param {number} lampe - ID de la lampe
     * @return {Array<Array<number>>} Tableau des valeurs nettes logarithmiques
     */
    static creerTableauValeursNettesLn(traceur, lampe) {
        const eau = Session.getInstance().traceurs.find(traceur => traceur.unite === '');
        const valeursNettes = [];

        for (let i = 1; i <= traceur.echelles.length; i++) {
            if (!isNaN(traceur.getDataParNom('L' + lampe + '-' + i))) {
                const ligneLn = [];
                ligneLn.push(arrondir8Chiffres(ln(traceur.echelles[i-1])));

                const signalNet = traceur.getDataParNom('L' + lampe + '-' + i) - eau.getDataParNom('L' + lampe + '-1');

                if (signalNet <= 0) {
                    continue;
                }

                ligneLn.push(arrondir8Chiffres(ln(signalNet)));
                ligneLn.push(arrondir8Chiffres(ln(signalNet) * ln(signalNet)));

                valeursNettes.push(ligneLn);
            }
        }

        return valeursNettes;
    }


    /**
     * Crée une matrice avec des puissances de logarithme népérien
     * @param {Object} traceur - Le traceur
     * @param {Array<Array<number>>} dmv - Données de valeurs nettes
     * @return {Array<Array<number>>} Matrice avec les puissances de ln
     */
    static creerMatriceLn(traceur, dmv) {
        const matrice = [];
        const nbLignes = dmv[0].length;

        for (let i = 0; i < 2; i++) {
            const ligne = [];
            for (let j = 0; j < nbLignes; j++) {
                ligne.push(arrondir8Chiffres(dmv[0][j] ** i));
            }
            matrice.push(ligne);
        }

        return matrice;
    }


    /**
     * Crée un tableau d'intervalle de confiance
     * @param {Array<number>} colonne1 - Première colonne de données
     * @param {Array<number>} colonne2 - Deuxième colonne de données
     * @param {Array<number>} coefficients - Coefficients de l'équation
     * @return {Object} Tableau d'intervalle de confiance et erreur type
     */
    static creerTableauIntervaleConfiance(colonne1, colonne2, coefficients) {
        const tableauIntervaleConfiance = [];
        let sommeCarresEcarts = 0;

        for (let i = 0; i < colonne1.length; i++) {
            const ligne = [];
            const x = colonne2[i];

            ligne.push(x);
            ligne.push(colonne1[i]);

            const valeurCalculee = coefficients[0] + coefficients[1] * x + coefficients[2] * (x * x);

            ligne.push(valeurCalculee);

            const ecartCarre = (colonne1[i] - valeurCalculee) ** 2;
            ligne.push(ecartCarre);

            sommeCarresEcarts += ecartCarre;
            tableauIntervaleConfiance.push(ligne);
        }

        const erreurType = 1.96 * (Math.sqrt(sommeCarresEcarts / (colonne1.length - 3)));

        return {
            tableauIntervaleConfiance,
            erreurType
        };
    }
}
