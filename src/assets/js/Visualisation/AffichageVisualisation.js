/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 * Gère l'affichage et le stockage des variables utilisateur pour la partie visualisation
 */
import {Chart} from "chart.js/auto";
import {afficherMessageFlash} from "@/assets/js/Common/utils.js";
import Session from "@/assets/js/Session/Session.js";
import {DateTime} from "luxon";


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
        this.zoneSelectionnee = {};
        this.variablesExplicativesBruit = [];
        this.traceurPourConversion = null;
        this.exporterCalculs = false;
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
                this.estEffectueeCorrectionInterferences = false;
                this.initialiserCorrectionTurbidite();
                this.initialiserConversionTraceurs();
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
            if (!checkbox.classList.contains('no-reset')) {
                checkbox.checked = false;
                checkbox.style.background = '';
            }
        });
        document.querySelector('.listeTraceursInterferences').innerHTML = '';
        this.lampesSelectionneesCorrTurbidite = [];
        this.niveauCorrectionTurbidite = 1;
        this.nbTraceursCorrectionInterferences = 0;
        this.traceursCorrectionInterferences = [];
        this.echelleTraceur1Interferences = null;
        this.echelleTraceur2Interferences = null;
        this.zoneSelectionnee = {};
        this.variablesExplicativesBruit = [];
        this.traceurPourConversion = null;

        document.querySelectorAll('input[type="datetime-local"]').forEach(input => {
            input.value = '';
        });
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
                if (this.traceursCorrectionInterferences[0] && this.traceursCorrectionInterferences[0].lampePrincipale !== traceur.lampePrincipale) {
                    const ancienTraceur = this.traceursCorrectionInterferences[0];
                    const selectTraceurTwo = document.querySelector('.select-traceur-two');
                    if (selectTraceurTwo) {
                        const existingOption = Array.from(selectTraceurTwo.options).find(opt =>
                            parseInt(opt.value) === ancienTraceur.lampePrincipale);

                        if (!existingOption) {
                            const option = document.createElement('option');
                            option.value = ancienTraceur.lampePrincipale;
                            option.text = ancienTraceur.nom;
                            selectTraceurTwo.appendChild(option);

                            this.trierOptionsSelect(selectTraceurTwo);
                        }
                    }
                }

                this.traceursCorrectionInterferences[0] = traceur;
                this.configurerSelectionEchelleInterferences(this.traceursCorrectionInterferences[0], this.traceursCorrectionInterferences[1]);

                const selectTraceurTwo = document.querySelector('.select-traceur-two');
                if (selectTraceurTwo) {
                    const options = selectTraceurTwo.querySelectorAll('option');
                    options.forEach(option => {
                        if (parseInt(option.value) === traceur.lampePrincipale) {
                            option.remove();
                        }
                    });
                }
            }
        });

        const selectTraceurTwo = document.querySelector('.select-traceur-two');
        if (selectTraceurTwo) {
            selectTraceurTwo.addEventListener('change', (event) => {
                const traceur = Session.getInstance().traceurs.find(t => t.lampePrincipale === parseInt(event.target.value));

                if (traceur) {
                    if (this.traceursCorrectionInterferences[1] && this.traceursCorrectionInterferences[1].lampePrincipale !== traceur.lampePrincipale) {
                        const ancienTraceur = this.traceursCorrectionInterferences[1];
                        const selectTraceurOne = document.querySelector('.select-traceur-one');
                        if (selectTraceurOne) {
                            const existingOption = Array.from(selectTraceurOne.options).find(opt =>
                                parseInt(opt.value) === ancienTraceur.lampePrincipale);

                            if (!existingOption) {
                                const option = document.createElement('option');
                                option.value = ancienTraceur.lampePrincipale;
                                option.text = ancienTraceur.nom;
                                selectTraceurOne.appendChild(option);

                                this.trierOptionsSelect(selectTraceurOne);
                            }
                        }
                    }

                    this.traceursCorrectionInterferences[1] = traceur;
                    this.configurerSelectionEchelleInterferences(this.traceursCorrectionInterferences[0], this.traceursCorrectionInterferences[1]);

                    const selectTraceurOne = document.querySelector('.select-traceur-one');
                    if (selectTraceurOne) {
                        const options = selectTraceurOne.querySelectorAll('option');
                        options.forEach(option => {
                            if (parseInt(option.value) === traceur.lampePrincipale) {
                                option.remove();
                            }
                        });
                    }
                }
            });
        }
    }


    /**
     * Trie les options d'un select par ordre croissant de valeur (sauf l'option par défaut)
     * @param {HTMLSelectElement} selectElement - L'élément select à trier
     */
    trierOptionsSelect(selectElement) {
        const defaultOption = selectElement.options[0];
        const options = Array.from(selectElement.options).slice(1);

        options.sort((a, b) => parseInt(a.value) - parseInt(b.value));

        selectElement.innerHTML = '';
        selectElement.appendChild(defaultOption);

        options.forEach(option => selectElement.appendChild(option));
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

        let selectEchelleT1 = document.createElement('select');
        selectEchelleT1.className = 'echelle-t1';

        let optionDefaultT1 = document.createElement('option');
        optionDefaultT1.value = echelleTraceur1;
        optionDefaultT1.text = echelleTraceur1 + traceur1.unite;
        optionDefaultT1.selected = true;
        selectEchelleT1.appendChild(optionDefaultT1);

        for (let i = 0; i < listeT1.length; i++) {
            if (listeT1[i] !== echelleTraceur1) {
                let option = document.createElement('option');
                option.value = listeT1[i];
                option.text = listeT1[i] + traceur1.unite;
                selectEchelleT1.appendChild(option);
            }
        }

        let selectEchelleT2 = document.createElement('select');
        selectEchelleT2.className = 'echelle-t2';

        let optionDefaultT2 = document.createElement('option');
        optionDefaultT2.value = echelleTraceur2;
        optionDefaultT2.text = echelleTraceur2 + traceur2.unite;
        optionDefaultT2.selected = true;
        selectEchelleT2.appendChild(optionDefaultT2);

        for (let i = 0; i < listeT2.length; i++) {
            if (listeT2[i] !== echelleTraceur2) {
                let option = document.createElement('option');
                option.value = listeT2[i];
                option.text = listeT2[i] + traceur2.unite;
                selectEchelleT2.appendChild(option);
            }
        }

        if (divT1 && divT2) {
            let oldSelectT1 = divT1.querySelector('.echelle-t1');
            let oldSelectT2 = divT2.querySelector('.echelle-t2');

            if (oldSelectT1) divT1.removeChild(oldSelectT1);
            if (oldSelectT2) divT2.removeChild(oldSelectT2);

            divT1.appendChild(selectEchelleT1);
            divT2.appendChild(selectEchelleT2);

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
            this.initialiserSlideBruit();
        }
    }


    /**
     * -----------------------------------------------------------------------------------------------------------------
     * Méthodes pour la correction du bruit de fond
     * -----------------------------------------------------------------------------------------------------------------
     */


    /**
     * Fonction pour attribuer la date de fin de la période sélectionnée à la dernière date du fichier de mesures
     */
    dateFinSelectionneeDerniereDate() {
        const lignes = this.controlleurVisualisation.copieContenuFichierMesure.split('\n');
        const derniereLigne = lignes[lignes.length - 2];
        if (!derniereLigne) return null;

        const colonnes = derniereLigne.split(';');
        if (colonnes.length < 2) return null;

        const date = colonnes[0] + '-' + colonnes[1];
        const dateFinale = DateTime.fromFormat(date, 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'}).toFormat('dd/MM/yyyy-HH:mm:ss');
        this.zoneSelectionnee.dateFin = dateFinale;
        document.querySelector('#finSelection').value = DateTime.fromFormat(dateFinale, 'dd/MM/yyyy-HH:mm:ss').toFormat('yyyy-MM-dd\'T\'HH:mm');
    }


    /**
     * Fonction pour attribuer la date de début de la période sélectionnée à la première date du fichier de mesures
     */
    dateDebutSelectionneePremiereDate() {
        const lignes = this.controlleurVisualisation.copieContenuFichierMesure.split('\n');
        if (lignes.length < 4) return null;

        const premiereLigne = lignes[3];
        const colonnes = premiereLigne.split(';');
        if (colonnes.length < 2) return null;

        const date = colonnes[0] + '-' + colonnes[1];
        const dateFinale = DateTime.fromFormat(date, 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'}).toFormat('dd/MM/yyyy-HH:mm:ss');
        this.zoneSelectionnee.dateDebut = dateFinale;
        document.querySelector('#debutSelection').value = DateTime.fromFormat(dateFinale, 'dd/MM/yyyy-HH:mm:ss').toFormat('yyyy-MM-dd\'T\'HH:mm');
    }


    /**
     * Permet à l'utilisateur de sélectionner une période pour la correction du bruit de fond sur le graphique
     */
    selectionnerPeriodeCorrectionBruit() {
        this.controlleurVisualisation.graphiqueVisualisation.selectionnerZoneGraphique().then((zone) => {
            if (zone && zone.length === 2) {
                this.zoneSelectionnee.dateDebut = zone[0];
                this.zoneSelectionnee.dateFin = zone[1];

                try {
                    document.querySelector('#debutSelection').value = DateTime.fromFormat(zone[0], 'dd/MM/yy-HH:mm:ss').toFormat('yyyy-MM-dd\'T\'HH:mm');
                    document.querySelector('#finSelection').value = DateTime.fromFormat(zone[1], 'dd/MM/yy-HH:mm:ss').toFormat('yyyy-MM-dd\'T\'HH:mm');
                } catch (e) {
                    console.error("Erreur de format de date:", e);
                    try {
                        document.querySelector('#debutSelection').value = DateTime.fromFormat(zone[0], 'dd/MM/yyyy-HH:mm:ss').toFormat('yyyy-MM-dd\'T\'HH:mm');
                        document.querySelector('#finSelection').value = DateTime.fromFormat(zone[1], 'dd/MM/yyyy-HH:mm:ss').toFormat('yyyy-MM-dd\'T\'HH:mm');
                    } catch (e2) {
                        console.error("Impossible de parser les dates:", e2);
                        afficherMessageFlash("Erreur", "Format de date invalide.", 'error');
                    }
                }
            } else {
                afficherMessageFlash("Erreur", "Veuillez sélectionner une période valide pour la correction du bruit de fond.", 'error');
            }
        }).catch(error => {
            console.error("Erreur lors de la sélection de la zone graphique:", error);
            afficherMessageFlash("Erreur", "Une erreur est survenue lors de la sélection de la période.", 'error');
        });
    }


    /**
     * Configure la date de début de la sélection à partir d'un input de type date-time-local
     */
    dateDebutDepuisInput(date) {
        if (date) {
            const dateTime = DateTime.fromFormat(date, 'yyyy-MM-dd\'T\'HH:mm', {zone: 'UTC'});
            this.zoneSelectionnee.dateDebut = dateTime.toFormat('dd/MM/yyyy-HH:mm:ss');
        }
    }


    /**
     * Configure la date de fin de la sélection à partir d'un input de type date-time-local
     */
    dateFinDepuisInput(date) {
        if (date) {
            const dateTime = DateTime.fromFormat(date, 'yyyy-MM-dd\'T\'HH:mm', {zone: 'UTC'});
            this.zoneSelectionnee.dateFin = dateTime.toFormat('dd/MM/yyyy-HH:mm:ss');
        }
    }


    /**
     * Parcoure toutes les courbes du graphique et les ajoute à la div ".variables-explicatives" en tant que checkboxes, avec le style approprié en fonction de la couleur de la courbe
     */
    initialiserSlideBruit() {
        const div = document.querySelector('.variables-explicatives');

        if (!div) {
            setTimeout(() => this.initialiserSlideBruit(), 500);
            return;
        }

        div.innerHTML = '';

        const canvas = document.getElementById('graphique');
        const existingChart = Chart.getChart(canvas);
        if (!existingChart) {
            return;
        }

        this.variablesExplicativesBruit = [];
        const lampesTraceursPrincipales = [];

        const calculsInterferences = Session.getInstance().calculs.filter(calcul =>
            calcul.equation && calcul.equation.includes('interférences'));

        if (calculsInterferences.length > 0) {
            try {
                const paramsArray = Array.from(calculsInterferences[0].parametres.keys());
                const nbTraceurs = paramsArray.filter(key => key.includes('traceur')).length;

                for (let i = 0; i < nbTraceurs; i++) {
                    const nomTraceur = calculsInterferences[0].getParametre(`traceur${i}`);
                    if (nomTraceur) {
                        const traceur = Session.getInstance().traceurs.find(t => t.nom === nomTraceur);
                        if (traceur) {
                            lampesTraceursPrincipales.push(`L${traceur.lampePrincipale}`);
                            lampesTraceursPrincipales.push(`L${traceur.lampePrincipale}Corr`);
                            lampesTraceursPrincipales.push(`L${traceur.lampePrincipale}Nat`);
                        }
                    }
                }
            } catch (e) {
                console.error("Erreur lors de la récupération des traceurs d'interférences:", e);
            }
        } else if (this.traceursCorrectionInterferences.length > 0) {
            this.traceursCorrectionInterferences.forEach(traceur => {
                lampesTraceursPrincipales.push(`L${traceur.lampePrincipale}`);
                lampesTraceursPrincipales.push(`L${traceur.lampePrincipale}Corr`);
                lampesTraceursPrincipales.push(`L${traceur.lampePrincipale}Nat`);
            });
        }

        const courbesStr = existingChart.data.datasets.map(dataset => dataset.label);

        existingChart.data.datasets.forEach((dataset) => {
            if (!dataset.label ||
                dataset.label === 'Aucune courbe' ||
                dataset.label.includes('_nat') ||
                lampesTraceursPrincipales.includes(dataset.label)) {
                return;
            }

            const label = document.createElement('label');
            label.innerHTML = `<input type="checkbox" value="${dataset.label}"/> ${dataset.label}`;

            const checkbox = label.querySelector('input[type="checkbox"]');
            checkbox.classList.add('no-reset');

            const couleur = this.controlleurVisualisation.getCouleurCourbe(dataset.label);
            if (couleur) {
                label.style.border = `2px solid ${couleur}`;
                if (checkbox) {
                    checkbox.style.border = `1px solid ${couleur}`;
                }
            }

            // 1. Cocher par défaut les courbes corrigées
            // 2. Cocher par défaut les courbes non-corrigées si leur version corrigée n'existe pas
            let checkByDefault = false;

            if (dataset.label.includes('Corr')) {
                checkByDefault = true;
            } else if (dataset.label.charAt(0) === 'L') {
                const corrigeeName = `${dataset.label}Corr`;
                if (!courbesStr.includes(corrigeeName)) {
                    checkByDefault = true;
                }
            }

            if (checkByDefault) {
                checkbox.checked = true;
                checkbox.style.background = couleur || '#ff8800';
                this.variablesExplicativesBruit.push(dataset.label);
            }

            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    checkbox.style.background = couleur || '#ff8800';
                    this.variablesExplicativesBruit.push(dataset.label);
                } else {
                    checkbox.style.background = '';
                    const index = this.variablesExplicativesBruit.indexOf(dataset.label);
                    if (index > -1) {
                        this.variablesExplicativesBruit.splice(index, 1);
                    }
                }
            });

            div.appendChild(label);
        });
    }


    /**
     * Déclenche la correction du bruit de fond à partir des informations saisies par l'utilisateur
     * Implémentation compatible avec la v1 pour garantir des résultats identiques
     */
    declencherCorrectionBruitDeFond() {
        if (this.variablesExplicativesBruit.length === 0) {
            afficherMessageFlash("Erreur", "Veuillez sélectionner au moins une variable explicative", "error");
            return;
        }

        const traceurs = Session.getInstance().traceurs;
        const eau = traceurs.find(traceur => traceur.unite === '');
        if (!eau) {
            afficherMessageFlash("Erreur", "Traceur eau non trouvé. Vérifiez vos données de calibration", "error");
            return;
        }

        let traceursBruitDeFond = [];
        const calculsInterferences = Session.getInstance().calculs.filter(calcul =>
            calcul.equation && calcul.equation.includes('interférences'));

        let nbTraceursInterferences = 0;
        if (calculsInterferences.length > 0) {
            try {
                const paramsArray = Array.from(calculsInterferences[0].parametres.keys());
                nbTraceursInterferences = paramsArray.filter(key => key.includes('traceur')).length;
            } catch (e) {
                console.error("Erreur lors de la récupération des traceurs d'interférences:", e);
                nbTraceursInterferences = 0;
            }

            for (let i = 0; i < nbTraceursInterferences; i++) {
                const nomTraceur = calculsInterferences[0].getParametre(`traceur${i}`);
                if (nomTraceur) {
                    const traceur = traceurs.find(t => t.nom === nomTraceur);
                    if (traceur) {
                        traceursBruitDeFond.push(traceur);
                    }
                }
            }
        }

        if (traceursBruitDeFond.length === 0) {
            traceursBruitDeFond = this.traceursCorrectionInterferences.length > 0 ?
                this.traceursCorrectionInterferences :
                traceurs.filter(t => t && t.unite && t.unite !== '' && t.unite.toLowerCase() !== 'ntu');
        }

        if (traceursBruitDeFond.length === 0) {
            afficherMessageFlash("Erreur", "Aucun traceur disponible pour la correction du bruit de fond", "error");
            return;
        } else if (traceursBruitDeFond.length > 2) {
            afficherMessageFlash("Erreur", "La correction de bruit de fond n'est possible qu'avec un ou deux traceurs", "error");
            return;
        }

        const listeLampeBruitDeFondTriee = [...this.variablesExplicativesBruit].sort((a, b) => {
            if (a.includes('Corr') && b.includes('Corr')) {
                return parseInt(a.replace('L', '').replace('Corr', '')) - parseInt(b.replace('L', '').replace('Corr', ''));
            } else if (a.includes('Corr')) {
                return parseInt(a.replace('L', '').replace('Corr', '')) - parseInt(b.replace('L', ''));
            } else if (b.includes('Corr')) {
                return parseInt(a.replace('L', '')) - parseInt(b.replace('L', '').replace('Corr', ''));
            } else {
                return parseInt(a.replace('L', '')) - parseInt(b.replace('L', ''));
            }
        });

        const options = {
            listeLampeBruitDeFond: listeLampeBruitDeFondTriee
        };

        if (this.zoneSelectionnee.dateDebut && this.zoneSelectionnee.dateFin) {
            const dateDebut = DateTime.fromFormat(this.zoneSelectionnee.dateDebut, 'dd/MM/yyyy-HH:mm:ss')
                .toFormat('dd/MM/yy-HH:mm:ss');
            const dateFin = DateTime.fromFormat(this.zoneSelectionnee.dateFin, 'dd/MM/yyyy-HH:mm:ss')
                .toFormat('dd/MM/yy-HH:mm:ss');

            options.zoneSelectionnee = [dateDebut, dateFin];
        }

        this.controlleurVisualisation.appliquerCorrectionBruitDeFond(traceursBruitDeFond, options)
            .then(() => {
                afficherMessageFlash("Information", "Correction du bruit de fond effectuée avec succès", "info");
                this.resetCheckboxesCarousel();
            })
            .catch(error => {
                console.error("Erreur lors de la correction du bruit de fond:", error);
                afficherMessageFlash("Erreur", "Une erreur s'est produite lors de la correction du bruit de fond", "error");
            });
    }


    /**
     * -----------------------------------------------------------------------------------------------------------------
     * Méthodes pour la conversion en concentrations des traceurs
     * -----------------------------------------------------------------------------------------------------------------
     */


    /**
     * Place une checkbox pour chaque traceur dans la div .listeCheckboxesConversion
     * Une seule checkbox est cochée à la fois
     */
    initialiserConversionTraceurs() {
        const div = document.querySelector('.listeCheckboxesConversion');
        if (!div) {
            setTimeout(() => this.initialiserConversionTraceurs(), 500);
            return;
        }

        div.innerHTML = '';

        const traceurs = Session.getInstance().traceurs;
        for (const traceur of traceurs) {
            if (traceur && traceur.unite.toLowerCase()) {
                let label = document.createElement('label');
                label.innerHTML = `<input type="checkbox" value="L${traceur.lampePrincipale}"/> ${traceur.nom}`;

                const checkbox = label.querySelector('input[type="checkbox"]');
                checkbox.addEventListener('change', () => {
                    this.traceurPourConversion = checkbox.checked ? traceur : null;
                    document.querySelectorAll('.listeCheckboxesConversion input[type="checkbox"]').forEach(cb => {
                        if (cb !== checkbox) {
                            cb.checked = false;
                            cb.style.background = '';
                        }
                    });
                });

                label = this.appliquerStyleCheckbox(label, "L" + traceur.lampePrincipale);
                div.appendChild(label);
            }
        }
    }


    /**
     * Déclenche la conversion en concentrations du traceur sélectionné
     */
    appliquerConversionConcentration() {
        if (this.traceurPourConversion) {
            this.controlleurVisualisation.appliquerConversionConcentration(this.traceurPourConversion)
            this.resetCheckboxesCarousel();
        } else {
            afficherMessageFlash("Erreur", "Veuillez sélectionner un traceur pour la conversion en concentrations", "error");
        }
    }


    /**
     * -----------------------------------------------------------------------------------------------------------------
     * Méthodes pour la gestion des différents exports
     * -----------------------------------------------------------------------------------------------------------------
     */


    /**
     * Passe à true ou false l'état de l'export des calculs
     * @param {Event} event - L'événement du toggle switch
     */
    toggleExportCalculs(event) {
        this.exporterCalculs = event && event.checked !== undefined ? event.checked : !this.exporterCalculs;
    }


    /**
     * Déclenche l'export des données en format CSV standard
     */
    declencherExportCSV() {
        if (this.exporterCalculs) {
            this.controlleurVisualisation.exporterCalculsCSV();
        }
        this.controlleurVisualisation.exporterDonneesCSV();
    }
}
