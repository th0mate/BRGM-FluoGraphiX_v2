/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 * Gère les calculs et l'affichage des courbes de calibration
 */
import {AffichageCalibration} from '@/assets/js/Calibration/AffichageCalibration.js';
import AffichageClasses from '@/assets/js/Calibration/AffichageCalibration.js';
import CalculClasses from '@/assets/js/Calibration/CalculsCourbes.js';
import {afficherPopup} from "@/assets/js/UI/popupService.js";
import warningImage from "@/assets/img/popup/warning.png";
import Session from "@/assets/js/Session/Session.js";

const AffichageConcentration = AffichageClasses.AffichageConcentration;
const AffichageParasites = AffichageClasses.AffichageParasites;
const CalculCourbeConcentration = CalculClasses.CalculCourbeConcentration;
const CalculCourbeParasite = CalculClasses.CalculCourbeParasite;


/**
 * =====================================================================================================================
 * Classe gérant les calculs et l'affichage des courbes de calibration
 * ======================================================================================================================
 */
export default class GestionnaireCourbesCalibration {


    /**
     * Initialise le gestionnaire de courbes de calibration
     */
    constructor() {
        this.donneesCorrompues = false;
    }


    /**
     * Méthode principale qui initialise les calculs et l'affichage des courbes
     * Remplace la fonction initialiserCalculsCourbes() du code original
     * @param {number} idLampe - L'ID de la lampe
     * @param {Object} traceur - Le traceur concerné
     */
    initialiserCalculsCourbes(idLampe, traceur) {
        if (!document.querySelector('#graphique')) {
            this.donneesCorrompues = false;
        }

        document.querySelector('.equation').innerHTML = "<span>Aucune équation à afficher pour le moment.</span>";
        const calculCourbe = this.creerCalculCourbe(idLampe, traceur);

        const resultat = calculCourbe.calculer();
        const equation = calculCourbe.getEquation();
        const nbValeurLampe = calculCourbe.nbValeurLampe;

        AffichageCalibration.afficherEquationDroite(equation);

        if (traceur.lampePrincipale !== idLampe) {
            this.afficherCourbeParasites(resultat, idLampe, traceur);

            if (this.donneesCorrompues && !document.querySelector('#graphique')) {
                setTimeout(() => {
                    this.afficherPopupDonneesCorrompues();
                }, 500);
            }
        } else {
            if (nbValeurLampe !== 1) {
                AffichageConcentration.afficherCourbeDepuis3Valeurs(resultat, idLampe, traceur);
            } else {
                AffichageConcentration.afficherCourbeDepuis1Valeur(resultat, idLampe, traceur);
            }
        }
    }


    /**
     * Crée l'instance de calcul appropriée selon le type de courbe (concentration ou parasites)
     * @param {number} idLampe - L'ID de la lampe
     * @param {Object} traceur - Le traceur concerné
     * @returns {CalculCourbe} L'instance de calcul créée
     */
    creerCalculCourbe(idLampe, traceur) {
        if (traceur.lampePrincipale !== idLampe) {
            return new CalculCourbeParasite(traceur, idLampe);
        } else {
            return new CalculCourbeConcentration(traceur, idLampe);
        }
    }


    /**
     * Affiche la courbe parasite appropriée selon le nombre de valeurs NaN dans les résultats
     * @param {Array} resultat - Les résultats des calculs
     * @param {number} idLampe - L'ID de la lampe
     * @param {Object} traceur - Le traceur concerné
     */
    afficherCourbeParasites(resultat, idLampe, traceur) {
        let countNaN = 0;
        for (let i = 0; i < resultat[0].length; i++) {
            if (isNaN(resultat[0][i])) {
                countNaN++;
            }
        }

        let estCorrompue = false;
        if (countNaN === 0) {
            estCorrompue = AffichageParasites.afficherCourbeParasites3Valeurs(resultat, idLampe, traceur);
        } else if (countNaN === 1) {
            AffichageParasites.afficherCourbeParasites2Valeurs(resultat, idLampe, traceur);
        } else {
            estCorrompue = AffichageParasites.afficherCourbeParasites1Valeur(resultat, idLampe, traceur);
        }

        if (estCorrompue) {
            this.donneesCorrompues = true;
        }
    }


    /**
     * Affiche un popup d'avertissement pour des données potentiellement corrompues
     */
    afficherPopupDonneesCorrompues() {
        if (typeof afficherPopup === 'function') {
            const imageHTML = `<img src="${warningImage}" alt="Avertissement" style="width: 120px;">`;

            afficherPopup(
                imageHTML,
                'Avertissement',
                'Données potentiellement incohérentes détectées',
                'Les données calculées indiquent une potentielle erreur dans les données de calibration importées. Assurez-vous qu\'elles soient correctes.',
                'Fermer'
            );
        }
    }


    /**
     * Teste tous les traceurs pour détecter d'éventuelles données corrompues
     * sans afficher les graphiques ni les tableaux
     * @returns {boolean} True si des données corrompues sont détectées, false sinon
     */
    testerTousTraceurs() {
        this.donneesCorrompues = false;

        const session = Session.getInstance();
        const traceurs = session.traceurs;

        if (!traceurs || traceurs.length === 0) {
            return false;
        }

        for (const traceur of traceurs) {
            if (traceur.unite === '') {
                continue;
            }

            const lampes = this.getLampesDisponibles(traceur);

            for (const idLampe of lampes) {
                this.testerTraceurLampe(traceur, idLampe);

                if (this.donneesCorrompues) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Teste un traceur avec une lampe spécifique pour détecter les données corrompues
     * @param {Object} traceur - Le traceur à tester
     * @param {number} idLampe - L'ID de la lampe à tester
     */
    testerTraceurLampe(traceur, idLampe) {
        const calculCourbe = this.creerCalculCourbe(idLampe, traceur);
        const resultat = calculCourbe.calculer();

        if (traceur.lampePrincipale !== idLampe) {
            let countNaN = 0;
            for (let i = 0; i < resultat[0].length; i++) {
                if (isNaN(resultat[0][i])) {
                    countNaN++;
                }
            }

            this.verifierDonneesParasites(resultat, idLampe, traceur, countNaN);
        }
    }


    /**
     * Vérifie si les données de parasites présentent des incohérences
     * @param {Array} resultat - Les résultats des calculs
     * @param {number} idLampe - L'ID de la lampe
     * @param {Object} traceur - Le traceur concerné
     * @param {number} countNaN - Nombre de valeurs NaN dans les résultats
     */
    verifierDonneesParasites(resultat, idLampe, traceur, countNaN) {
        const eau = Session.getInstance().traceurs.find(traceur => traceur.unite === '');

        if (countNaN === 0) {
            const constante = resultat[0][0];
            const degre1 = resultat[0][1];
            const degre2 = resultat[0][2];

            const maxTraceur = this.getMaxTraceur(traceur);
            const valeurIni = Math.log(eau.getDataParNom(`L${traceur.lampePrincipale}-1`) + 0.01);
            const valeurFinale = Math.log(maxTraceur * 1.2);
            const pas = (valeurFinale - valeurIni) / (100 - 1);

            let colonne0 = [valeurIni];
            let colonne1 = [Math.exp(valeurIni)];
            let colonne2 = [eau.getDataParNom('L' + idLampe + '-1') + Math.exp(constante +
                degre1 * Math.log(colonne1[0] - eau.getDataParNom('L' + traceur.lampePrincipale + '-1')) +
                degre2 * Math.log(colonne1[0] - eau.getDataParNom('L' + traceur.lampePrincipale + '-1')) ** 2)];

            let tempX = colonne1[0];
            let tempY = colonne2[0];

            for (let i = 1; i < 100; i++) {
                colonne0.push(colonne0[i - 1] + pas);
                colonne1.push(Math.exp(colonne0[i]));

                if (colonne1[i] <= eau.getDataParNom('L' + traceur.lampePrincipale + '-1')) {
                    colonne2.push(0);
                } else {
                    colonne2.push(eau.getDataParNom('L' + idLampe + '-1') + Math.exp(constante +
                        degre1 * Math.log(colonne1[i] - eau.getDataParNom('L' + traceur.lampePrincipale + '-1')) +
                        degre2 * Math.log(colonne1[i] - eau.getDataParNom('L' + traceur.lampePrincipale + '-1')) ** 2));
                }

                if (colonne1[i] < tempX || colonne2[i] < tempY) {
                    this.donneesCorrompues = true;
                    return;
                }

                tempX = colonne1[i];
                tempY = colonne2[i];
            }
        } else if (countNaN === 1) {
            return;
        } else {
            const eauValeurLampePrincipale = eau.getDataParNom('L' + traceur.lampePrincipale + '-1');
            const eauValeurLampe = eau.getDataParNom('L' + idLampe + '-1');

            let index = 0;
            for (let i = 1; i <= traceur.echelles.length; i++) {
                if (!isNaN(traceur.getDataParNom('L' + idLampe + '-' + i))) {
                    index = i;
                    break;
                }
            }

            const pointX = traceur.getDataParNom('L' + traceur.lampePrincipale + '-' + index);
            const a = resultat[0][0];
            const b = eauValeurLampe - a * eauValeurLampePrincipale;

            const marge = pointX * 1.2;
            let tempX = eauValeurLampePrincipale;
            let tempY = a * eauValeurLampePrincipale + b;

            for (let x = eauValeurLampePrincipale; x <= marge; x += 2) {
                const y = a * x + b;

                if (x < tempX || y < tempY) {
                    this.donneesCorrompues = true;
                    return;
                }

                tempX = x;
                tempY = y;
            }
        }
    }


    /**
     * Obtient la liste des IDs de lampes disponibles pour un traceur
     * @param {Object} traceur - Le traceur concerné
     * @returns {Array<number>} Liste des IDs de lampes
     */
    getLampesDisponibles(traceur) {
        const lampes = [];
        for (let i = 1; i <= 10; i++) {
            let lampeUtilisee = false;
            for (let j = 1; j <= traceur.echelles.length; j++) {
                if (!isNaN(traceur.getDataParNom('L' + i + '-' + j))) {
                    lampeUtilisee = true;
                    break;
                }
            }
            if (lampeUtilisee) {
                lampes.push(i);
            }
        }
        return lampes;
    }


    /**
     * Obtient la valeur maximale d'un traceur pour sa lampe principale
     * @param {Object} traceur - Le traceur
     * @return {number} La valeur maximale
     */
    getMaxTraceur(traceur) {
        let maxTraceur = 0;

        for (let i = 1; i <= traceur.echelles.length; i++) {
            if (!isNaN(traceur.getDataParNom('L' + traceur.lampePrincipale + '-' + i)) &&
                traceur.getDataParNom('L' + traceur.lampePrincipale + '-' + i) > maxTraceur) {
                maxTraceur = traceur.getDataParNom('L' + traceur.lampePrincipale + '-' + i);
            }
        }

        return maxTraceur;
    }


    /**
     * Effectue les calculs pour obtenir les coefficients des courbes.
     * Cette méthode est maintenue pour compatibilité avec l'ancien code.
     * @param {number} idLampe - L'ID de la lampe
     * @param {Object} traceur - Le traceur concerné
     * @returns {Array} Les résultats du calcul
     * @deprecated Utilisez plutôt initialiserCalculsCourbes qui encapsule la logique complète
     */
    effectuerCalculsCourbes(idLampe, traceur) {
        const calculCourbe = this.creerCalculCourbe(idLampe, traceur);
        return calculCourbe.calculer();
    }
}
