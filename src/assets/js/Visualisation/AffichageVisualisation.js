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
        this.nbTraceursCorrectionInterferences = 0;
        this.traceursCorrectionInterferences = [];
        this.echelleTraceur1Interferences = null;
        this.echelleTraceur2Interferences = null;
    }


    /**
     * Applique le style aux checkboxes en fonction de la couleur de la courbe correspondante
     * @param {HTMLElement} element - L'élément HTML à styliser
     * @param {string} nomCourbe - Le nom de la courbe à partir de laquelle il faut récupérer la couleur
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
        document.querySelector('#inputRange').addEventListener('input', (event) => {
            const value = event.target.value;
            document.querySelector('.range span').innerText = value;
            this.niveauCorrectionTurbidite = value;
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
            this.initSlidePrincipale(calibrationEstLieeGraphique).then(tbodyElement => {
                this.initialiserCorrectionTurbidite();
                resolve(tbodyElement);
            });
        })
    }


    /**
     * Initialise la slide principale du carousel Splide
     * @returns {Promise<HTMLElement|null>} - Retourne une promesse qui se résout avec l'élément tbody ou null
     */
    initSlidePrincipale(calibrationEstLieeGraphique) {
        const carousel = document.querySelector('.carousel');
        if (carousel) {
            if (carousel.splide) {
                carousel.splide.go(0);
            } else if (typeof Splide !== 'undefined' && Splide.getInstance) {
                const splideInstance = Splide.getInstance(carousel);
                if (splideInstance) {
                    splideInstance.go(0);
                }
            } else if (carousel._splide) {
                carousel._splide.go(0);
            }
        }
        if (!calibrationEstLieeGraphique) {
            return new Promise((resolve) => {
                const tbodyElement = document.querySelector('tbody');

                if (!tbodyElement) {
                    setTimeout(() => {
                        this.initSlidePrincipale(calibrationEstLieeGraphique).then(resolve);
                    }, 500);
                    return;
                }
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
                        <select class="renameCourbe" id='rename${i}' data-lampe='L${traceur.lampePrincipale}'>
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

                resolve(tbodyElement);
            });
        }
        return Promise.resolve(null);
    }


    /**
     * Réinitialise l'état des checkboxes du carousel Splide
     */
    resetCheckboxesCarousel() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
            checkbox.style.background = '';
        });
        document.querySelector('.listeTraceursInterferences').innerHTML = '';
        this.lampesSelectionneesCorrTurbidite = [];
        this.niveauCorrectionTurbidite = 1;
        this.nbTraceursCorrectionInterferences = 0;
        this.traceursCorrectionInterferences = [];
        this.echelleTraceur1Interferences = null;
        this.echelleTraceur2Interferences = null;
    }


    /**
     * -----------------------------------------------------------------------------------------------------------------
     * Méthodes pour la correction de turbidité
     * -----------------------------------------------------------------------------------------------------------------
     */


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
    }


    /**
     * Déclenche la correction de turbidité à partir des informations saisies par l'utilisateur
     */
    declencherCorrectionTurbidite() {
        if (this.lampesSelectionneesCorrTurbidite.length > 0 && this.niveauCorrectionTurbidite) {
            this.controlleurVisualisation.appliquerCorrectionTurbidite(this.lampesSelectionneesCorrTurbidite, this.niveauCorrectionTurbidite);
            this.resetCheckboxesCarousel();
        }
    }


    /**
     * -----------------------------------------------------------------------------------------------------------------
     * Méthodes pour la correction des interférences
     * -----------------------------------------------------------------------------------------------------------------
     */


    /**
     * Permet la sélection du nombre de traceurs pour la correction des interférences
     * @param {number} nb - Le nombre de traceurs à sélectionner (1 ou 2)
     */
    selectionnerNombreTraceursCorrectionInterferences(nb) {
        this.nbTraceursCorrectionInterferences = nb;
        this.traceursCorrectionInterferences = [];

        const oneTraceurCheckbox = document.getElementById('one-traceur-checkbox');
        const twoTraceurCheckbox = document.getElementById('two-traceur-checkbox');

        if (oneTraceurCheckbox && twoTraceurCheckbox) {
            oneTraceurCheckbox.checked = nb === 1;
            twoTraceurCheckbox.checked = nb === 2;
        }

        const div = document.querySelector('.listeTraceursInterferences');
        if (nb === 1) {
            let html = "<select class='select-traceur-one'><option disabled selected>Traceur 1</option>";

            for (const traceur of Session.getInstance().traceurs) {
                if (traceur && traceur.unite.toLowerCase() !== '' && traceur.unite.toLowerCase() !== 'ntu') {
                    html += `<option value="${traceur.lampePrincipale}">${traceur.nom}</option>`;
                }
            }

            html += "</select>";
            div.innerHTML = html;
        } else {
            let html1 = "<div class='data-traceur-one'><select class='select-traceur-one'><option disabled selected>Traceur 1</option>";
            let html2 = "<div class='data-traceur-two'><select class='select-traceur-two'><option disabled selected>Traceur 2</option>";

            for (const traceur of Session.getInstance().traceurs) {
                if (traceur && traceur.unite.toLowerCase() !== '' && traceur.unite.toLowerCase() !== 'ntu') {
                    html1 += `<option value="${traceur.lampePrincipale}">${traceur.nom}</option>`;
                    html2 += `<option value="${traceur.lampePrincipale}">${traceur.nom}</option>`;
                }
            }

            html1 += "</select></div>";
            html2 += "</select></div>";
            div.innerHTML = html1 + '<span class="separator"></span>' + html2;
        }

        document.querySelector('.select-traceur-one').addEventListener('change', (event) => {
            const traceur = Session.getInstance().traceurs.find(t => t.lampePrincipale === parseInt(event.target.value));
            if (traceur) {
                this.traceursCorrectionInterferences[0] = traceur;
                this.configurerSelectionEchelleInterferences(this.traceursCorrectionInterferences[0], this.traceursCorrectionInterferences[1]);
            }
        });

        const selectTraceurTwo = document.querySelector('.select-traceur-two');
        if (selectTraceurTwo) {
            selectTraceurTwo.addEventListener('change', (event) => {
                const traceur = Session.getInstance().traceurs.find(t => t.lampePrincipale === parseInt(event.target.value));
                if (traceur) {
                    this.traceursCorrectionInterferences[1] = traceur;
                    this.configurerSelectionEchelleInterferences(this.traceursCorrectionInterferences[0], this.traceursCorrectionInterferences[1]);
                }
            });
        }
    }


    /**
     * Permet de sélectionner pour chaque traceur l'échelle à utiliser pour la correction des interférences dans le cas
     * où celle-ci s'effectue sur deux traceurs
     */
    configurerSelectionEchelleInterferences(traceur1, traceur2) {

        if (!traceur1 || !traceur2) {
            return;
        }

        let divT1 = document.querySelector('.data-traceur-one');
        let divT2 = document.querySelector('.data-traceur-two');

        const listeT1 = this.controlleurVisualisation.getEchelleStandardTraceur(traceur1, traceur2);
        const listeT2 = this.controlleurVisualisation.getEchelleStandardTraceur(traceur2, traceur1);
        const echelleTraceur1 = Math.max(...listeT1);
        const echelleTraceur2 = Math.max(...listeT2);

        this.echelleTraceur1Interferences = echelleTraceur1;
        this.echelleTraceur2Interferences = echelleTraceur2;

        let htmlT1 = `<select class="echelle-t1"><option selected value="${echelleTraceur1}">${echelleTraceur1}${traceur1.unite}</option>`;
        let htmlT2 = `<select class="echelle-t2"><option selected value="${echelleTraceur2}">${echelleTraceur2}${traceur1.unite}</option>`;

        for (let i = 0; i < listeT1.length; i++) {
            if (listeT1[i] !== echelleTraceur1) {
                htmlT1 += `<option value="${listeT1[i]}">${listeT1[i]}${traceur1.unite}</option>`;
            }
        }

        for (let i = 0; i < listeT2.length; i++) {
            if (listeT2[i] !== echelleTraceur2) {
                htmlT2 += `<option value="${listeT2[i]}">${listeT2[i]}${traceur2.unite}</option>`;
            }
        }

        htmlT1 += `</select></div>`;
        htmlT2 += `</select></div>`;


        if (divT1 && divT2) {
            divT1.innerHTML += htmlT1;
            divT2.innerHTML += htmlT2;

            const selectEchelleT1 = divT1.querySelector('.echelle-t1');
            const selectEchelleT2 = divT2.querySelector('.echelle-t2');

            selectEchelleT1.addEventListener('change', (event) => {
                this.echelleTraceur1Interferences = parseFloat(event.target.value);
            });

            selectEchelleT2.addEventListener('change', (event) => {
                this.echelleTraceur2Interferences = parseFloat(event.target.value);
            });
        }
    }


    /**
     * Déclenche la correction des interférences à partir des informations saisies par l'utilisateur
     */
    declencherCorrectionInterferences() {
        if (this.traceursCorrectionInterferences.length > 0) {
            this.controlleurVisualisation.appliquerCorrectionInterferences(this.traceursCorrectionInterferences, this.echelleTraceur1Interferences, this.echelleTraceur2Interferences);
            this.resetCheckboxesCarousel();
            this.estEffectueeCorrectionInterferences = true;
        }
    }


    /**
     * -----------------------------------------------------------------------------------------------------------------
     * Méthodes pour la correction du bruit de fond
     * -----------------------------------------------------------------------------------------------------------------
     */


}