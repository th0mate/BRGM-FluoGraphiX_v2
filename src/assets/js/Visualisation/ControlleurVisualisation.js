// Classe ControlleurVisualisation : point d'entrée pour la gestion de la visualisation
// Appelle les lecteurs de fichiers, la calibration, les paramètres graphiques, etc.

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

export class ControlleurVisualisation {
    constructor() {
        this.graphiqueVisualisation = new GraphiqueVisualisation();
        this.correctionTurbidite = new CorrectionTurbidite(this);
        this.convertirTraceurConcentration = new ConvertirTraceurConcentration(this);
        this.interferencesTraceurs = new InterferencesTraceurs(this);
        this.correctionBruitDeFond = new CorrectionBruitDeFond(this);
        this.courbesSupprimees = [];
        this.lecteur = null; // Instance du dernier lecteur utilisé (MV, TXT, XML)
    }

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
            case 'csv':
                contenuCSV = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result);
                    reader.onerror = reject;
                    reader.readAsText(fichier);
                });
                if (contenuCSV.split('\n')[0]?.includes('Appareil')) {
                    return null;
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
     * @param {File} fichier
     * @param {string} type - 'dat' ou 'csv'
     */
    async importerCalibration(fichier, type) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const contenu = e.target.result;
            Session.getInstance().contenuFichierCalibration = contenu;
            let lecteur;
            if (type === 'dat') {
                lecteur = new LecteurFichierDAT(contenu);
            } else if (type === 'csv') {
                lecteur = new LecteurFichierCSV(contenu);
            } else {
                throw new Error('Type de fichier calibration non supporté');
            }
            lecteur.initialiser(false);
        };
        reader.readAsText(fichier);
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
     * Exporte les données du graphique ou du fichier de mesures au format CSV
     * @returns {string}
     */
    exporterCSV() {
        return Session.getInstance().contenuFichierMesures;
    }


    afficherGraphique(donnees) {
        this.graphiqueVisualisation.afficherGraphique(donnees);
    }


    appliquerCorrectionTurbidite(lampesACorriger, niveauCorrection = 1) {
        this.correctionTurbidite.appliquerCorrection(lampesACorriger, niveauCorrection, this.traceurs);
    }


    appliquerConversionConcentration(traceur) {
        this.convertirTraceurConcentration.convertir(traceur);
    }


    appliquerCorrectionInterferences(traceurs) {
        this.interferencesTraceurs.corrigerInterferences(traceurs);
    }


    appliquerCorrectionBruitDeFond(traceurs, options) {
        this.correctionBruitDeFond.appliquerCorrection(traceurs, options);
    }


    /**
     * Importe un ou plusieurs fichiers de mesures et distribue leur contenu vers les bons modules
     * @param {FileList|Array<File>} fichiers
     * @param {string} type - 'mv', 'txt', 'xml', etc. (ou détection automatique)
     */
    async traiterFichiers(fichiers, type = null) {
        console.log(fichiers);
        if (!fichiers || fichiers.length === 0) return;
        this.reset();
        Session.getInstance().reset();
        let contenuFusionne = '';
        let datesFichiers = [];
        let allLignes = [];
        let lecteurFusion = null;
        for (const fichier of fichiers) {
            let ext = type;
            if (!ext) {
                const nom = fichier.name.toLowerCase();
                if (nom.endsWith('.mv')) ext = 'mv';
                else if (nom.endsWith('.txt')) ext = 'txt';
                else if (nom.endsWith('.xml')) ext = 'xml';
                else ext = 'csv';
            }
            const contenu = await this.importerFichier(fichier, ext);
            if (this.lecteur) {
                if (!lecteurFusion) {
                    // Clone le premier lecteur pour fusionner les infos
                    lecteurFusion = Object.assign(
                        Object.create(Object.getPrototypeOf(this.lecteur)),
                        this.lecteur
                    );
                } else {
                    // Fusionne les lignes
                    lecteurFusion.lignes = lecteurFusion.lignes.concat(this.lecteur.lignes);
                }
            }
            if (contenu) {
                const lignes = contenu.split('\n');
                allLignes.push(...lignes);
                for (let i = 3; i < lignes.length; i++) {
                    const date = lignes[i]?.split(';')[0];
                    if (date && date.match(/\d{2}\/\d{2}\/\d{2}/)) {
                        datesFichiers.push(date);
                        break;
                    }
                }
                for (let i = lignes.length - 1; i >= 3; i--) {
                    const date = lignes[i]?.split(';')[0];
                    if (date && date.match(/\d{2}\/\d{2}\/\d{2}/)) {
                        datesFichiers.push(date);
                        break;
                    }
                }
                contenuFusionne += contenu + '\n';
            }
        }
        // Sécurité : si plusieurs fichiers, vérifier l'écart de dates
        if (fichiers.length > 1 && datesFichiers.length >= 4) {
            const parseDate = (str) => {
                const [d, m, y] = str.split('/');
                return new Date(`20${y}-${m}-${d}`);
            };
            const firstDate = parseDate(datesFichiers[0]);
            const lastDate = parseDate(datesFichiers[datesFichiers.length - 1]);
            const diffDays = Math.abs((lastDate - firstDate) / (1000 * 60 * 60 * 24));
            if (diffDays > 9) {
                Session.getInstance().reset();
                throw new Error('L\'écart entre les fichiers de mesures est supérieur à 9 jours. Import annulé.');
            }
        }
        Session.getInstance().contenuFichierMesures = contenuFusionne.trim();
        if (lecteurFusion) {
            lecteurFusion.extraireInfosCSV(contenuFusionne.trim());
            this.lecteur = lecteurFusion;
        }

        console.log(Session.getInstance().contenuFichierMesures);
        this.afficherGraphique(Session.getInstance().contenuFichierMesures);
    }

    // Méthodes d'accès pour les infos du lecteur
    getNbLignes() {
        return this.lecteur ? this.lecteur.nbLignes : 0;
    }
    getPremiereDate() {
        return this.lecteur ? this.lecteur.premiereDate : '';
    }
    getDerniereDate() {
        return this.lecteur ? this.lecteur.derniereDate : '';
    }
    getLignes() {
        return this.lecteur ? this.lecteur.lignes : [];
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
}

