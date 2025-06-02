/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 * Gère les calculs et l'affichage des courbes de calibration
 */
import {AffichageCalibration} from '@/assets/js/Calibration/AffichageCalibration.js';
import AffichageClasses from '@/assets/js/Calibration/AffichageCalibration.js';
import CalculClasses from '@/assets/js/Calibration/CalculsCourbes.js';

const AffichageConcentration = AffichageClasses.AffichageConcentration;
const AffichageParasites = AffichageClasses.AffichageParasites;
const CalculCourbeConcentration = CalculClasses.CalculCourbeConcentration;
const CalculCourbeParasite = CalculClasses.CalculCourbeParasite;


/**
 * Variable globale indiquant si des données potentiellement corrompues ont été détectées
 * @type {boolean} true si des données potentiellement corrompues ont été détectées, false sinon
 */
let donneesCorrompues = false;


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
            afficherPopup(
                '<img src="Ressources/img/attention2.png" alt="">',
                'Attention : données potentiellement corrompues détectées !',
                'Les données calculées indiquent une potentielle erreur dans les données de calibration importées. Assurez-vous qu\'elles soient correctes.',
                '<div class="bouton boutonFonce" onclick="fermerPopup()">TERMINER</div>'
            );
        }
    }


    /**
     * Réinitialise le zoom du graphique
     * Remplace la fonction reinitialiserZoomGraphiqueConcentrations() du code original
     */
    reinitialiserZoomGraphique() {
        AffichageCalibration.reinitialiserZoomGraphique();
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


// Création d'une instance globale singleton pour l'utiliser depuis l'ancien code
const gestionnaireCourbsCalibration = new GestionnaireCourbesCalibration();


/**
 * Initialise les calculs des courbes et leur affichage
 * @param {number} idLampe - L'ID de la lampe
 * @param {Object} traceur - Le traceur concerné
 */
export function initialiserCalculsCourbes(idLampe, traceur) {
    gestionnaireCourbsCalibration.initialiserCalculsCourbes(idLampe, traceur);
}


/**
 * Effectue les calculs pour obtenir les coefficients des courbes
 * @param {number} idLampe - L'ID de la lampe
 * @param {Object} traceur - Le traceur concerné
 * @returns {Array} Les résultats du calcul
 */
export function effectuerCalculsCourbes(idLampe, traceur) {
    return gestionnaireCourbsCalibration.effectuerCalculsCourbes(idLampe, traceur);
}


/**
 * Réinitialise le zoom du graphique
 */
export function reinitialiserZoomGraphiqueConcentrations() {
    gestionnaireCourbsCalibration.reinitialiserZoomGraphique();
}


/**
 * Vérifie si des données sont corrompues
 * @returns {boolean} true si des données sont corrompues, false sinon
 */
export function verifierDonneesCorrompues() {
    return gestionnaireCourbsCalibration.donneesCorrompues;
}

