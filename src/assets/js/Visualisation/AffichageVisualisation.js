/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 * Gère l'affichage et le stockage des variables utilisateur pour la partie visualisation
 */


import {Chart} from "chart.js/auto";
import {afficherMessageFlash} from "@/assets/js/Common/utils.js";
import Session from "@/assets/js/Session/Session.js";
import {remplacerDonneesFichier} from "@/assets/js/Visualisation/utils.js";

/**
 * =====================================================================================================================
 * Classe pour l'affichage des calibrations
 * ====================================================================================================================
 */
export class AffichageVisualisation {
    constructor(controlleurVisualisation) {
        this.niveauCorrectionTurbidite = null;
        this.estEffectueeCorrectionInterferences = false;
        this.controlleurVisualisation = controlleurVisualisation;
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


    /**
     * Réinitialise le zoom du graphique
     */
    reinitialiserZoomGraphique() {
        const canvas = document.getElementById('graphique');
        const existingChart = Chart.getChart(canvas);
        if (existingChart) {
            existingChart.resetZoom();
            afficherMessageFlash("Information", "Le zoom du graphique a été réinitialisé.", 'info');
        }
    }


    /**
     * Initialise la slide principale du carousel Splide
     * @returns {Promise<HTMLElement|null>} - Retourne une promesse qui se résout avec l'élément tbody ou null
     */
    initSlidePrincipale(calibrationEstLieeGraphique) {
        return new Promise((resolve) => {
            const tbodyElement = document.querySelector('tbody');

            if (!tbodyElement) {
                setTimeout(() => {
                    this.initSlidePrincipale(calibrationEstLieeGraphique).then(resolve);
                }, 500);
                return;
            }

            if (!calibrationEstLieeGraphique) {
                let html = "";
                const traceurs = Session.getInstance().traceurs;

                for (let i = 0; i < traceurs.length; i++) {
                    const traceur = traceurs[i];
                    if (isNaN(traceur.lampePrincipale)) {
                        continue;
                    }

                    html += `
                <tr>
                    <td>L${traceur.lampePrincipale}</td>
                    <td>
                        <select id='rename${i}' data-lampe='L${traceur.lampePrincipale}'>
                        <option value="" selected disabled>Sélectionner</option>
                            `;
                    const lignes = Session.getInstance().contenuFichierMesures.split('\n');
                    const header = lignes[2].split(';').splice(2);

                    for (let j = 0; j < header.length; j++) {
                        html += `<option id="option${header[j]}" value="${header[j]}">${header[j]}</option>`;
                    }

                    html += `
                        </select>
                    </td>
                </tr>`;
                }

                tbodyElement.innerHTML = html;
            }

            resolve(tbodyElement);
        });
    }
}