/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 * Gère l'affichage et le stockage des variables utilisateur pour la partie visualisation
 */
import {Chart} from "chart.js/auto";
import {afficherMessageFlash} from "@/assets/js/Common/utils.js";
import Session from "@/assets/js/Session/Session.js";


/**
 * =====================================================================================================================
 * Classe pour l'affichage des calibrations
 * ====================================================================================================================
 */
export class AffichageVisualisation {
    constructor() {
        this.niveauCorrectionTurbidite = 1;
        this.estEffectueeCorrectionInterferences = false;
        this.controlleurVisualisation = null;
        this.lampesSelectionneesCorrTurbidite = [];
    }

    /**
     * Définit la référence au contrôleur de visualisation
     * @param {ControlleurVisualisation} controlleur - Instance du contrôleur de visualisation
     */
    setControlleurVisualisation(controlleur) {
        this.controlleurVisualisation = controlleur;
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
            splideRef.splide.options = {...splideRef.splide.options, drag: false};
        }
    }


    /**
     * Active le drag du carousel Splide
     */
    enableCarouselDrag(splideRef) {
        if (splideRef && splideRef.splide) {
            splideRef.splide.options = {...splideRef.splide.options, drag: true};
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
     * Initialise le carousel Splide
     */
    initialiserCarouselSplide(calibrationEstLieeGraphique) {
        return new Promise(resolve => {
            this.initSlidePrincipale(calibrationEstLieeGraphique).then(r => {
                this.initialiserCorrectionTurbidite();
                resolve();
            });
        })
    }


    /**
     * Initialise la slide principale du carousel Splide
     * @returns {Promise<HTMLElement|null>} - Retourne une promesse qui se résout avec l'élément tbody ou null
     */
    initSlidePrincipale(calibrationEstLieeGraphique) {
        if (!calibrationEstLieeGraphique) {
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
        return Promise.resolve(null);
    }


    /**
     * Initialise la slide pour la correction de turbidité
     */
    initialiserCorrectionTurbidite() {
        const div = document.querySelector('.listeCheckboxesCorrTurbidite');

        if (!div) {
            setTimeout(() => this.initialiserCorrectionTurbidite(), 500);
            return;
        }

        div.innerHTML = '';

        const traceurs = Session.getInstance().traceurs;
        for (const traceur of traceurs) {
            if (traceur && traceur.unite.toLowerCase() !== '' && traceur.unite.toLowerCase() !== 'ntu') {
                let label = document.createElement('label');
                label.innerHTML = `<input type="checkbox" value="L${traceur.lampePrincipale}"/> L${traceur.lampePrincipale}`;

                const checkbox = label.querySelector('input[type="checkbox"]');
                checkbox.addEventListener('change', () => {
                    this.ajouterLampeSelectionneeCorrTurbidite(traceur.lampePrincipale);
                });

                label = this.appliquerStyleCheckbox(label, "L" + traceur.lampePrincipale);
                div.appendChild(label);
            }
        }
    }


    /**
     * Ajoute la lampe en question à la liste des lampes sélectionnées pour la correction de turbidité
     */
    ajouterLampeSelectionneeCorrTurbidite(lampe) {
        if (!this.lampesSelectionneesCorrTurbidite.includes(lampe)) {
            this.lampesSelectionneesCorrTurbidite.push(lampe);
        } else {
            const index = this.lampesSelectionneesCorrTurbidite.indexOf(lampe);
            if (index > -1) {
                this.lampesSelectionneesCorrTurbidite.splice(index, 1);
            }
        }
        console.log(this.lampesSelectionneesCorrTurbidite);
    }


    /**
     * Applique le style border: 2px solid XXX; à l'élément passé en paramètre, et met le style border: 1px solid XXXX à l'input contenu dans cette + background: XXX à l'input checked
     * La couleur XXX est celle de la courbe ayant le nom passé en paramètre
     * @param {HTMLElement} element - L'élément HTML à styliser
     * @param {string} nomCourbe - Le nom de la courbe pour laquelle appliquer le style
     * @return {HTMLElement} - L'élément HTML stylisé
     */
    appliquerStyleCheckbox(element, nomCourbe) {
        const couleur = this.controlleurVisualisation.getCouleurCourbe(nomCourbe);
        if (element) {
            element.style.border = `2px solid ${couleur}`;
            const input = element.querySelector('input[type="checkbox"]');
            if (input) {
                input.style.border = `1px solid ${couleur}`;
                input.addEventListener('change', () => {
                    if (input.checked) {
                        input.style.background = couleur;
                    } else {
                        input.style.background = '';
                    }
                });
            }
            return element;
        }
    }
}