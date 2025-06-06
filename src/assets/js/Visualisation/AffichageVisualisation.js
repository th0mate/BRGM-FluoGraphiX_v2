/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 * Gère l'affichage et le stockage des variables utilisateur pour la partie visualisation
 */


/**
 * =====================================================================================================================
 * Classe pour l'affichage des calibrations
 * ====================================================================================================================
 */
export class AffichageVisualisation {
    constructor() {
        this.niveauCorrectionTurbidite = null;
    }


    /**
     * Initialise l'input range pour la correction de turbidité
     */
    preparerInputRange() {
        document.querySelector('#inputRange').addEventListener('input', function () {
            document.querySelector('.range span').innerText = this.value;
            this.niveauCorrectionTurbidite = this.value;
        });
    }

    /**
     * Désactive le drag du carousel Splide
     */
    disableCarouselDrag(splideRef) {
        if (splideRef && splideRef.splide) {
            splideRef.splide.options = { ...splideRef.splide.options, drag: false };
        }
    }

    /**
     * Active le drag du carousel Splide
     */
    enableCarouselDrag(splideRef) {
        if (splideRef && splideRef.splide) {
            splideRef.splide.options = { ...splideRef.splide.options, drag: true };
        }
    }
}