/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 * Point d'entrée pour la gestion de la visualisation : appelle les lecteurs de fichiers, la calibration, les paramètres graphiques, etc.
 */
import {LecteurFichierMV} from '../LecteursDocuments/Visualisation/LecteurFichierMV.js';
import {LecteurFichierTXT} from '../LecteursDocuments/Visualisation/LecteurFichierTXT.js';
import {LecteurFichierXML} from '../LecteursDocuments/Visualisation/LecteurFichierXML.js';
import {CorrectionTurbidite} from '@/assets/js/Visualisation/Calculs/CorrectionTurbidite.js';
import {ConvertirTraceurConcentration} from './Calculs/ConvertirTraceurConcentration.js';
import {InterferencesTraceurs} from './Calculs/InterferencesTraceurs.js';
import {CorrectionBruitDeFond} from '@/assets/js/Visualisation/Calculs/CorrectionBruitDeFond.js';
import LecteurFichierDAT from '@/assets/js/LecteursDocuments/Calibration/LecteurFichierDAT.js';
import LecteurFichierCSV from '@/assets/js/LecteursDocuments/Calibration/LecteurFichierCSV.js';
import Session from '@/assets/js/Session/Session.js';
import GraphiqueVisualisation from "@/assets/js/Graphiques/GraphiqueVisualisation.js";
import {LecteurFichierVisualisation} from '../LecteursDocuments/Visualisation/LecteurFichierVisualisation.js';
import errorImage from "@/assets/img/popup/error.png";
import warningImage from "@/assets/img/popup/warning.png";
import loadingGif from "@/assets/img/popup/loading.gif";
import {afficherPopup, fermerPopup} from "@/assets/js/UI/popupService.js";
import router from '@/router';
import {Chart} from "chart.js/auto";
import {afficherMessageFlash} from "@/assets/js/Common/utils.js";
import {remplacerDonneesFichier} from "@/assets/js/Visualisation/utils.js";
import GestionnaireCourbesCalibration from '@/assets/js/Calibration/gestionCalculsCourbesCalibration.js';


/**
 * =====================================================================================================================
 * Classe ControlleurVisualisation
 * ======================================================================================================================
 */
export class ControlleurVisualisation {
    constructor(AffichageVisualisation = null) {
        this.graphiqueVisualisation = new GraphiqueVisualisation();
        this.correctionTurbidite = new CorrectionTurbidite(this);
        this.convertirTraceurConcentration = new ConvertirTraceurConcentration(this);
        this.interferencesTraceurs = new InterferencesTraceurs(this);
        this.correctionBruitDeFond = new CorrectionBruitDeFond(this);
        this.courbesSupprimees = [];
        this.lecteur = null;
        this.calibrationEstLieeGraphique = false;
        this.affichageVisualisation = AffichageVisualisation;
        this.copieContenuFichierMesure = "";
        this.anomalieCalibration = false;
        this.chargementCalculs = false;
    }

    /**
     * Définit la référence à l'affichage de visualisation
     * @param {AffichageVisualisation} affichage - Instance de l'affichage de visualisation
     */
    setAffichageVisualisation(affichage) {
        this.affichageVisualisation = affichage;
    }


    /**
     * Importe un fichier et le convertit en CSV s'il s'agit d'un fichier de mesures, et initialise les données de calibration s'il s'agit d'un fichier de calibration.
     * @param fichier {File} - Le fichier à importer
     * @param type {string} - Le type de fichier ('mv', 'txt', 'xml', 'dat', 'csv')
     * @returns {Promise<string>} - Le contenu du fichier converti en CSV ou rien si le fichier est de type 'dat' (calibration) ou csv (calibration)
     */
    async importerFichier(fichier, type) {
        let lecteur;
        let contenuCSV = '';
        switch (type) {
            case 'mv':
                lecteur = new LecteurFichierMV(fichier);
                contenuCSV = await lecteur.lireFichier();
                break;
            case 'txt':
                lecteur = new LecteurFichierTXT(fichier);
                contenuCSV = await lecteur.lireFichier();
                break;
            case 'xml':
                lecteur = new LecteurFichierXML(fichier);
                contenuCSV = await lecteur.lireFichier();
                break;
            case 'dat':
                await this.importerCalibration(fichier, 'dat');
                return;
            case 'csv':
                contenuCSV = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result);
                    reader.onerror = reject;
                    reader.readAsText(fichier);
                });
                if (contenuCSV.split('\n')[0]?.includes('Appareil')) {
                    await this.importerCalibration(fichier, 'csv');
                    return;
                }
                lecteur = new LecteurFichierVisualisation(fichier);
                lecteur.extraireInfosCSV(contenuCSV);
                break;
            default:
                throw new Error('Type de fichier non supporté');
        }
        this.lecteur = lecteur;
        Session.getInstance().contenuFichierMesures = contenuCSV;
        this.afficherGraphique(contenuCSV);
        return contenuCSV;
    }


    /**
     * Importe et parse un fichier de calibration (DAT ou CSV)
     * @param {File} fichier - Le fichier de calibration à importer
     * @param {string} type - 'dat' ou 'csv' (ou détection automatique) - le type de fichier
     * @param {boolean} importPostChargement - Indique si l'import est effectué après le chargement des données de mesures
     */
    async importerCalibration(fichier, type, importPostChargement = false) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const contenu = e.target.result;
            Session.getInstance().contenuFichierCalibration = contenu;
            let lecteur;
            if (type === 'dat') {
                lecteur = new LecteurFichierDAT(contenu);
                this.lecteur = lecteur;
                this.parametrerFormatDatesDepuisCalibrat();
            } else if (type === 'csv') {
                lecteur = new LecteurFichierCSV(contenu);
                this.lecteur = lecteur;
            } else {
                throw new Error('Type de fichier calibration non supporté');
            }
            await lecteur.initialiser(false);

            if (importPostChargement) {
                if (Session.getInstance().contenuFichierMesures.includes('A145') && Session.getInstance().contenuFichierMesures.includes('A146') && Session.getInstance().contenuFichierMesures.includes('A147') && Session.getInstance().contenuFichierMesures.includes('A148')) {
                    await this.adapterXMLVersCalibration();
                }

                this.finaliserImportCalibration();
            }
        };
        reader.readAsText(fichier);
    }


    /**
     * Paramètre le format de dates en fonction du contenu du fichier Calibrat.dat
     */
    parametrerFormatDatesDepuisCalibrat() {
        const derniereLigne = this.lecteur.lignes[this.lecteur.lignes.length - 2];
        const caractere = derniereLigne.charAt(0);

        if (caractere === '2') {
            Session.getInstance().formatDates = 1;
        } else {
            Session.getInstance().formatDates = 2;
        }

    }


    /**
     * Réinitialise les données de visualisation
     */
    reset() {
        Session.getInstance().traceurs = [];
        Session.getInstance().calculs = [];
        Session.getInstance().contenuFichierMesures = '';
        Session.getInstance().contenuFichierCalibration = '';
        this.courbesSupprimees = [];
    }


    /**
     * Affiche le graphique de visualisation avec les données fournies
     * @param donnees {string} - Les données à afficher dans le graphique, au format CSV
     */
    afficherGraphique(donnees) {
        document.querySelector('.nomFichier').innerHTML = `"${this.lecteur.nomFichier}"`;
        this.graphiqueVisualisation.afficherGraphique(donnees);
    }


    /**
     * Permet d'appliquer l'action de correction de turbidité sur les lampes sélectionnées
     * @param lampesACorriger
     * @param niveauCorrection
     */
    appliquerCorrectionTurbidite(lampesACorriger, niveauCorrection) {
        this.correctionTurbidite.appliquerCorrection(lampesACorriger, niveauCorrection, Session.getInstance().traceurs);
    }


    /**
     * Applique la conversion de concentration pour le traceur donné
     * @param traceur {Object} - Le traceur à convertir
     */
    appliquerConversionConcentration(traceur) {
        this.convertirTraceurConcentration.convertir(traceur);
    }


    /**
     * Applique la correction des interférences entre traceurs, à partir de ceux sélectionnés par l'utilisateur
     * @param traceurs {Array<Object>} - Liste des traceurs en question
     */
    appliquerCorrectionInterferences(traceurs) {
        this.interferencesTraceurs.corrigerInterferences(traceurs);
    }


    /**
     * Applique la correction de bruit de fond sur les traceurs sélectionnés
     * @param traceurs {Array<Object>} - Liste des traceurs sélectionnés
     * @param options {Object} - Options de correction (par exemple, seuil de bruit, méthode de correction, etc.)
     */
    appliquerCorrectionBruitDeFond(traceurs, options) {
        this.correctionBruitDeFond.appliquerCorrection(traceurs, options);
    }


    /**
     * Importe un ou plusieurs fichiers de mesures et de calibration et distribue leur contenu vers les bons modules
     * @param {FileList|Array<File>} fichiers - Liste de fichiers à traiter
     * @param {string} type - 'mv', 'txt', 'xml', etc. (ou détection automatique)
     */
    async traiterFichiers(fichiers, type = null) {
        if (!fichiers || fichiers.length === 0) return;
        this.reset();
        Session.getInstance().reset();
        const fichiersArray = Array.from(fichiers);
        const fichiersCalibration = [];
        const fichiersMesures = [];

        for (const fichier of fichiersArray) {
            const ext = fichier.name.split('.').pop().toLowerCase();
            if (ext === 'dat') {
                fichiersCalibration.push(fichier);
            } else if (ext === 'csv' && await this._isCSVCalibration(fichier)) {
                fichiersCalibration.push(fichier);
            } else {
                fichiersMesures.push(fichier);
            }
        }

        for (const fichier of fichiersCalibration) {
            let ext = fichier.name.split('.').pop().toLowerCase();
            await this.importerFichier(fichier, ext);
        }

        if (fichiersMesures.length === 0) {
            await router.push({name: 'calibration'});
            afficherPopup(
                `<img src="${warningImage}" alt="Avertissement" style="width: 120px;">`,
                'Avertissement',
                'Aucun fichier de mesures trouvé',
                'Veuillez importer au moins un fichier de mesures en plus d\'un fichier de calibration ou utiliser la page "calibration" pour vos fichiers de calibration seuls.',
                'Fermer'
            );

            return;
        }

        afficherPopup(
            `<img src="${loadingGif}" alt="Chargement" style="width: 120px;">`,
            'Chargement en cours',
            'Chargement en cours',
            'Chargement des fichiers importés, veuillez patienter...',
            ''
        );

        await new Promise(resolve => setTimeout(resolve, 100));

        let contenuFusionne = '';
        let lecteurFusion = null;
        let datesFichiers = [];
        for (const fichier of fichiersMesures) {
            let ext = fichier.name.split('.').pop().toLowerCase();
            let typeAuto = type;
            if (!typeAuto) {
                if (ext === 'mv') typeAuto = 'mv';
                else if (ext === 'txt') typeAuto = 'txt';
                else if (ext === 'xml') typeAuto = 'xml';
                else typeAuto = 'csv';
            }
            const contenu = await this.importerFichier(fichier, typeAuto);
            if (this.lecteur) {
                if (!lecteurFusion) {
                    lecteurFusion = Object.assign(
                        Object.create(Object.getPrototypeOf(this.lecteur)),
                        this.lecteur
                    );
                } else {
                    lecteurFusion.lignes = lecteurFusion.lignes.concat(this.lecteur.lignes);
                }
            }
            if (contenu) {
                const lignes = contenu.split('\n');

                for (let j = 3; j < lignes.length; j++) {
                    const date = lignes[j]?.split(';')[0];
                    if (date && date.match(/\d{2}\/\d{2}\/\d{2}/)) {
                        datesFichiers.push(date);
                        break;
                    }
                }
                for (let j = lignes.length - 1; j >= 3; j--) {
                    const date = lignes[j]?.split(';')[0];
                    if (date && date.match(/\d{2}\/\d{2}\/\d{2}/)) {
                        datesFichiers.push(date);
                        break;
                    }
                }
                contenuFusionne += contenu + '\n';
            }
        }

        // Sécurité : si plusieurs fichiers de mesures, vérifier l'écart de dates
        if (fichiersMesures.length > 1 && datesFichiers.length >= 4) {
            const parseDate = (str) => {
                const [d, m, y] = str.split('/');
                return new Date(`20${y}-${m}-${d}`);
            };
            const firstDate = parseDate(datesFichiers[0]);
            const lastDate = parseDate(datesFichiers[datesFichiers.length - 1]);
            const diffDays = Math.abs((lastDate - firstDate) / (1000 * 60 * 60 * 24));
            if (diffDays > 9) {
                Session.getInstance().reset();
                const imageHTML = `<img src="${errorImage}" alt="Avertissement" style="width: 120px;">`;

                afficherPopup(
                    imageHTML,
                    'Erreur',
                    'Écart entre deux fichiers trop important',
                    'L\'écart entre deux fichiers de mesures importés est supérieur à 9 jours. Import annulé.',
                    'Fermer'
                );
                throw new Error('L\'écart entre les fichiers de mesures est supérieur à 9 jours. Import annulé.');
            }
        }

        if (contenuFusionne) {
            Session.getInstance().contenuFichierMesures = contenuFusionne.trim();
            if (lecteurFusion) {
                lecteurFusion.extraireInfosCSV(contenuFusionne.trim());
                this.lecteur = lecteurFusion;
            }

            if (Session.getInstance().contenuFichierMesures.includes('A145') && Session.getInstance().contenuFichierMesures.includes('A146') && Session.getInstance().contenuFichierMesures.includes('A147') && Session.getInstance().contenuFichierMesures.includes('A148')) {
                await this.adapterXMLVersCalibration();
            }

            this.afficherGraphique(Session.getInstance().contenuFichierMesures);
            this.copieContenuFichierMesure = Session.getInstance().contenuFichierMesures;

            this.finaliserImportCalibration();
        }
        fermerPopup();
    }


    /**
     * Finalise l'import des fichiers de calibration
     */
    finaliserImportCalibration() {
        if (Session.getInstance().contenuFichierCalibration !== "") {
            const gestionCalibration = new GestionnaireCourbesCalibration();
            this.anomalieCalibration = gestionCalibration.testerTousTraceurs();
            this.verifierLienCalibration();
            this.affichageVisualisation.initialiserCarouselSplide(this.calibrationEstLieeGraphique).then(tbodyElement => {
                if (tbodyElement) {
                    const selects = tbodyElement.querySelectorAll('.renameCourbe');
                    for (let i = 0; i < selects.length; i++) {
                        selects[i].addEventListener('change', (event) => {
                            const lampe = event.target.getAttribute('data-lampe');
                            this.gestionRenommageCourbes(event.target.value, lampe);
                        });
                    }
                }
            });
        }
    }


    /**
     * Ajoute une courbe supprimée à la liste (gestion centralisée)
     * @param {string} nomCourbe
     */
    supprimerCourbe(nomCourbe) {
        this.courbesSupprimees.push(nomCourbe);
    }


    /**
     * Réinitialise la liste des courbes supprimées
     */
    resetCourbesSupprimees() {
        this.courbesSupprimees = [];
    }


    /**
     * Supprime les colonnes et l'en-tête du fichier CSV correspondant à un label d'en-tête donné
     * @param labelEnTete le label de l'en-tête à supprimer
     * @param lignes les lignes du fichier CSV
     */
    supprimerColonneParEnTete(labelEnTete, lignes) {
        let header = lignes[2].replace(/[\n\r]/g, '').split(';');
        if (header.includes(labelEnTete)) {
            for (let k = 3; k < lignes.length - 1; k++) {
                const colonnes = lignes[k].split(';');
                colonnes.splice(header.indexOf(labelEnTete), 1);
                lignes[k] = colonnes.join(';');
            }
        }

        return lignes;
    }


    /**
     * Détecte si un fichier CSV est un fichier de calibration (première ligne contient 'Appareil')
     * @param {File} fichier - Le fichier à vérifier
     */
    async _isCSVCalibration(fichier) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const contenu = e.target.result;
                resolve(contenu.split('\n')[0].includes('Appareil'));
            };
            reader.onerror = reject;
            reader.readAsText(fichier);
        });
    }


    /**
     * Modifie les axes de zoom/déplacement du graphique
     * @param {string} key - La lettre x ou y pour modifier l'axe correspondant
     */
    modifierAxesZoomDeplacement(key) {
        const canvas = document.getElementById('graphique');
        const existingChart = Chart.getChart(canvas);

        const bouton = document.getElementById('axe' + key.toUpperCase());

        if (bouton.classList.contains('unselected')) {
            bouton.classList.remove('unselected');
        } else {
            bouton.classList.add('unselected');
        }

        if (Session.getInstance().zoomGraphiques.includes(key)) {
            Session.getInstance().zoomGraphiques = Session.getInstance().zoomGraphiques.replace(key, '');
        } else {
            Session.getInstance().zoomGraphiques += key;
        }

        if (existingChart) {
            const zoomKeys = Session.getInstance().zoomGraphiques;
            let mode = zoomKeys.length === 0 ? 'none' : zoomKeys;
            existingChart.options.plugins.zoom.zoom.mode = mode;
            existingChart.options.plugins.zoom.pan.mode = mode;

            if (!zoomKeys.includes('y')) {
                const yScale = existingChart.scales['y'] || existingChart.scales['y-axis-0'];
                if (yScale) {
                    if (!Session.getInstance().fixedY) {
                        Session.getInstance().fixedY = {
                            min: yScale.min,
                            max: yScale.max
                        };
                    }
                    existingChart.options.scales.y.min = Session.getInstance().fixedY.min;
                    existingChart.options.scales.y.max = Session.getInstance().fixedY.max;
                }
            } else {
                if (Session.getInstance().fixedY) {
                    existingChart.options.scales.y.min = undefined;
                    existingChart.options.scales.y.max = undefined;
                    delete Session.getInstance().fixedY;
                }
            }
            if (!zoomKeys.includes('x')) {
                const xScale = existingChart.scales['x'] || existingChart.scales['x-axis-0'];
                if (xScale) {
                    if (!Session.getInstance().fixedX) {
                        Session.getInstance().fixedX = {
                            min: xScale.min,
                            max: xScale.max
                        };
                    }
                    existingChart.options.scales.x.min = Session.getInstance().fixedX.min;
                    existingChart.options.scales.x.max = Session.getInstance().fixedX.max;
                }
            } else {
                if (Session.getInstance().fixedX) {
                    existingChart.options.scales.x.min = undefined;
                    existingChart.options.scales.x.max = undefined;
                    delete Session.getInstance().fixedX;
                }
            }

            existingChart.update();
            if (mode === 'none') {
                afficherMessageFlash("Succès", `Zoom et déplacement désactivés.`, 'success');
            } else {
                afficherMessageFlash("Succès", `Zoom et déplacement en ${mode.toUpperCase()} modifiés.`, 'success');
            }
        }
    }


    /**
     * Réinitialise le graphique de visualisation avec les données importées au départ. La liste des graphiques est réinitialisée.
     */
    reinitialiserGraphique() {
        const canvas = document.getElementById('graphique');
        const existingChart = Chart.getChart(canvas);
        if (existingChart) {
            existingChart.destroy();
        }
        this.graphiqueVisualisation.afficherGraphique(Session.getInstance().contenuFichierMesures);
        this.resetCourbesSupprimees();
        Session.getInstance().calculs = [];
        afficherMessageFlash("Succès", "Le graphique a été réinitialisé avec les données importées au départ.", 'success');
    }


    /**
     * Vérifie si le graphique est lié à une calibration
     */
    verifierLienCalibration() {
        const lignes = Session.getInstance().contenuFichierMesures.split('\n');
        const header = lignes[2].split(';').splice(2);

        for (let i = 0; i < header.length; i++) {
            header[i] = header[i].replace(/[\n\r]/g, '');
        }

        let headerCalibrat = [];

        for (let i = 0; i < Session.getInstance().traceurs.length; i++) {
            const traceur = Session.getInstance().traceurs[i];

            if (traceur.lampePrincipale !== '') {
                headerCalibrat.push('L' + traceur.lampePrincipale);
            }
        }

        let estIdentique = true;
        for (let i = 0; i < headerCalibrat.length; i++) {

            if (headerCalibrat[i] === 'LNaN') {
                continue;
            }

            if (!header.includes(headerCalibrat[i])) {
                estIdentique = false;
            }
        }

        this.calibrationEstLieeGraphique = estIdentique;
    }


    /**
     * Renomme les courbes du graphique en fonction de la calibration
     * Pré-réquis : les données de mesure sont nommées selon la norme XML (a144, a145, etc.)
     */
    async adapterXMLVersCalibration() {
        if (Session.getInstance().contenuFichierCalibration !== "") {
            for (let i = 0; i < Session.getInstance().traceurs.length; i++) {
                Session.getInstance().contenuFichierMesures = remplacerDonneesFichier(`A${145 + i}`, `L${1 + i}`, Session.getInstance().contenuFichierMesures);
                this.copieContenuFichierMesure = Session.getInstance().contenuFichierMesures;
            }
        }
    }


    /**
     * Gère le renommage des courbes dans le graphique lors de la modification du nom d'une courbe
     * @param ancienNom l'ancien nom de la courbe
     * @param nouveauNom le nouveau nom de la courbe issu du fichier de calibration
     */
    gestionRenommageCourbes(ancienNom, nouveauNom) {
        Session.getInstance().contenuFichierMesures = remplacerDonneesFichier(ancienNom, nouveauNom, Session.getInstance().contenuFichierMesures);
        this.copieContenuFichierMesure = Session.getInstance().contenuFichierMesures;

        const selects = document.querySelectorAll('select');
        for (let i = 0; i < selects.length; i++) {
            if (selects[i].value === '') {
                const options = selects[i].querySelectorAll('option');
                for (let j = 0; j < options.length; j++) {
                    if (options[j].value === ancienNom) {
                        options[j].remove();
                    }
                }
            }
        }

        this.verifierLienCalibration();
    }


    /**
     * Retourne la couleur au format hexadécimal correspondant à un nom de courbe
     * @param {string} nomCourbe - Le nom de la courbe pour laquelle on veut la couleur
     */
    getCouleurCourbe(nomCourbe) {
        const canvas = document.getElementById('graphique');
        const existingChart = Chart.getChart(canvas);
        if (existingChart) {
            const dataset = existingChart.data.datasets.find(ds => ds.label === nomCourbe);
            if (dataset) {
                return dataset.borderColor || dataset.backgroundColor || '#ff0000';
            }
        }
    }


    /**
     * Retourne l'instance du graphique de visualisation
     */
    getChartInstance() {
        const canvas = document.getElementById('graphique');
        return Chart.getChart(canvas) || null;
    }
}
