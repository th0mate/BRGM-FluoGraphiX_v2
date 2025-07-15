import LecteurFichierDAT from '@/assets/js/LecteursDocuments/Calibration/LecteurFichierDAT.js';
import LecteurFichierCSV from '@/assets/js/LecteursDocuments/Calibration/LecteurFichierCSV.js';
import GestionnaireCourbesCalibration from '@/assets/js/Calibration/gestionCalculsCourbesCalibration.js';
import {afficherMessageFlash} from "@/assets/js/Common/utils.js";
import GraphiqueCalibration from '@/assets/js/Graphiques/GraphiqueCalibration.js';
import Session from '@/assets/js/Session/Session.js';
import errorImage from "@/assets/img/popup/error.png";
import { t } from '@/locales/i18nService';

/**
 * =====================================================================================================================
 * Classe contrôleur principale pour gérer les calibrations
 * =====================================================================================================================
 */
export default class ControlleurCalibration {


    /**
     * Constructeur du contrôleur
     */
    constructor() {
        this.lecteur = null;
        this.gestionnaireCalibration = new GestionnaireCourbesCalibration();
        this.calibrationChargee = false;
        this.graphiqueCalibration = null;
        this.session = Session.getInstance();
    }


    /**
     * Initialise le contrôleur avec le contenu d'un fichier de calibration
     * @param {string} contenu - Le contenu du fichier de calibration
     * @param {boolean} estFichierDat - True si le fichier est au format DAT, false pour CSV
     * @returns {Promise<boolean>} Promise résolue à true si l'initialisation a réussi, ou rejetée avec une erreur
     */
    initialiser(contenu, estFichierDat = true) {
        return new Promise((resolve, reject) => {
            try {
                if (!contenu) {
                    afficherMessageFlash('notifications.error.title', 'notifications.error.noData', 'error');
                    reject(new Error('Aucune donnée de calibration fournie'));
                    return;
                }

                this.lecteur = estFichierDat
                    ? new LecteurFichierDAT(contenu)
                    : new LecteurFichierCSV(contenu);

                this.graphiqueCalibration = new GraphiqueCalibration(this.lecteur);
                const resultat = this.lecteur.initialiser(true);
                console.table(Session.getInstance().traceurs);

                if (!resultat) {
                    reject(new Error('Échec de l\'initialisation des données de calibration'));
                    return;
                }

                const traceurs = Session.getInstance().traceurs;

                if (!traceurs || traceurs.length === 0) {
                    reject(new Error('La liste des traceurs est vide'));
                    return;
                }

                const hasEmptyUnit = traceurs.some(traceur => traceur.unite === '');
                if (!hasEmptyUnit) {
                    reject(new Error('Aucun traceur avec une unité vide n\'a été trouvé'));
                    return;
                }

                const hasNtuUnit = traceurs.some(traceur => {
                    const unite = traceur.unite.toLowerCase();
                    return unite === 'ntu';
                });

                if (!hasNtuUnit) {
                    reject(new Error('Aucun traceur avec l\'unité NTU n\'a été trouvé'));
                    return;
                }

                this.calibrationChargee = true;

                setTimeout(() => {
                    this.afficherListeTraceurs();
                }, 0);
                resolve(true);
            } catch (error) {
                reject(new Error(`Erreur lors de l'initialisation: ${error.message}`));
            }
        });
    }


    /**
     * Affiche la liste des traceurs dans le bandeau de calibration
     */
    afficherListeTraceurs() {
        const traceurs = Session.getInstance().traceurs;
        const divTraceurs = document.querySelector('.wrapTraceursCalibration');

        if (!divTraceurs) {
            console.warn("L'élément .wrapTraceursCalibration n'a pas été trouvé dans le DOM");
            return;
        }

        for (let i = 0; i < traceurs.length; i++) {

            if (document.querySelector('#traceur' + traceurs[i].nom)) {
                document.querySelector('#traceur' + traceurs[i].nom).remove();
            }


            if (traceurs[i].unite !== '') {
                const span = document.createElement('span');
                span.textContent = traceurs[i].nom;
                span.id = 'traceur' + traceurs[i].nom;
                span.classList.add('traceurElement');

                if (i === 1) {
                    span.classList.add('traceurActive');
                    const traceur = traceurs[i];

                    this.afficherTraceur(traceur);
                    this.ajouterLigneTraceurDansListe(traceur.lampePrincipale, traceur);
                    this.setBandeauCalibration(traceur.lampePrincipale, traceur);
                    this.gestionnaireCalibration.initialiserCalculsCourbes(traceur.lampePrincipale, traceur);
                }

                span.addEventListener('click', () => {
                    const traceur = this.lecteur.recupererTraceurParNom(span.textContent);
                    this.afficherTraceur(traceur);
                    this.setBandeauCalibration(traceur.lampePrincipale, traceur);
                    this.ajouterLigneTraceurDansListe(traceur.lampePrincipale, traceur);
                    this.gestionnaireCalibration.initialiserCalculsCourbes(traceur.lampePrincipale, traceur);
                });

                divTraceurs.appendChild(span);
            }
        }

        if (document.querySelector('.equationPannel')) {
            document.querySelector('.equationPannel').style.display = 'flex';
        }
    }


    /**
     * Affiche les informations d'un traceur
     * @param {Object} traceur - Le traceur à afficher
     */
    afficherTraceur(traceur) {
        if (!traceur) return;

        this.supprimerAffichagesPrecedents();
        this.creerTableauTraceur(traceur);
        this.afficherGraphiqueTraceur(traceur);
    }


    /**
     * Configure le bandeau de calibration avec les informations du traceur et de la lampe
     * @param {number} idLampe - L'ID de la lampe sélectionnée
     * @param {Object} Traceur - Le traceur sélectionné
     */
    setBandeauCalibration(idLampe, Traceur) {
        const bandeauElement = document.querySelector('.wrapBandeauCalibration');
        if (!bandeauElement) {
            console.warn("L'élément .wrapBandeauCalibration n'a pas été trouvé dans le DOM");
            return;
        }

        bandeauElement.style.display = 'flex';

        const spans = document.querySelectorAll('.wrapLampesCalibration span');
        spans.forEach(span => {
            span.classList.remove('lampeActive');
        });

        if (document.querySelector('#lampe' + idLampe)) {
            document.querySelector('#lampe' + idLampe).classList.add('lampeActive');
        }

        const spansTraceurs = document.querySelectorAll('.wrapTraceursCalibration span');
        spansTraceurs.forEach(span => {
            span.classList.remove('traceurActive');
        });

        if (document.querySelector('#traceur' + Traceur.nom)) {
            document.querySelector('#traceur' + Traceur.nom).classList.add('traceurActive');
        }
    }


    /**
     * Affiche dans le bandeau de calibration le choix des lampes pour un traceur
     */
    ajouterLigneTraceurDansListe(idData, traceur) {
        const div = document.querySelector('.wrapLampesCalibration');
        if (!div) {
            console.warn("L'élément .wrapLampesCalibration n'a pas été trouvé dans le DOM");
            return;
        }

        for (let i = 1; i <= 4; i++) {
            if (document.querySelector('#lampe' + i)) {
                document.querySelector('#lampe' + i).remove();
            }

            const span = document.createElement('span');
            span.textContent = t('calibration.lamp', { number: i });
            span.id = 'lampe' + i;
            span.classList.add('ligneElement');

            if (i === idData) {
                span.classList.add('lampeActive');
            }

            span.addEventListener('click', () => {
                this.afficherGraphiqueTraceur(traceur, i);
                this.setBandeauCalibration(i, traceur);
                this.gestionnaireCalibration.initialiserCalculsCourbes(i, traceur);
            });
            div.appendChild(span);
        }
    }


    /**
     * Supprime les affichages précédents
     */
    supprimerAffichagesPrecedents() {
        if (document.querySelector('.tableauTraceur')) {
            document.querySelector('.tableauTraceur').remove();
        }

        if (document.querySelector('#graphiqueTraceur')) {
            document.querySelector('#graphiqueTraceur').remove();
        }

        if (document.querySelector('.boutonDlData')) {
            document.querySelector('.boutonDlData').remove();
        }

        if (document.querySelector('.selectLigne')) {
            document.querySelector('.selectLigne').remove();
        }
    }


    /**
     * Crée et affiche un tableau pour visualiser les données d'un traceur
     * @param {Object} traceur - Le traceur à afficher
     * @param {HTMLElement|null} conteneur - Élément DOM où afficher le tableau (par défaut: '.donnees')
     * @returns {HTMLTableElement} - Le tableau créé
     */
    creerTableauTraceur(traceur, conteneur = null) {
        if (document.querySelector('.tableauTraceur')) {
            document.querySelector('.tableauTraceur').remove();
        }

        const tableau = document.createElement('table');
        tableau.classList.add('tableauTraceur');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.textContent = traceur.nom;
        tr.appendChild(th);

        const eau = this.lecteur.recupererTraceurEau();
        const th1 = document.createElement('th');
        th1.textContent = eau.nom;
        tr.appendChild(th1);

        let echellesTableau = [...traceur.echelles].sort((a, b) => a - b);

        const nbColonnes = traceur.data.size / 4;
        for (let i = 0; i < nbColonnes; i++) {
            const th = document.createElement('th');
            th.textContent = echellesTableau[i] + traceur.unite;
            tr.appendChild(th);
        }

        thead.appendChild(tr);
        tableau.appendChild(thead);

        let dataMap = new Map();
        for (let i = 0; i < traceur.echelles.length; i++) {
            let echelle = traceur.echelles[i];
            let data = [];
            for (let j = 1; j <= 4; j++) {
                data.push(traceur.getDataParNom('L' + j + '-' + (i + 1)));
            }
            dataMap.set(echelle, data);
        }

        for (let i = 0; i < 4; i++) {
            const tr = document.createElement('tr');
            const th = document.createElement('th');
            th.textContent = t('calibration.lamp', { number: i + 1 });
            tr.appendChild(th);

            for (let j = 0; j < nbColonnes + 1; j++) {
                const td = document.createElement('td');
                if (j === 0) {
                    td.textContent = eau.getDataParNom('L' + (i + 1) + '-' + 1);
                } else {
                    let echelle = echellesTableau[j - 1];
                    let data = dataMap.get(echelle);
                    if (data && data[i] !== undefined && data[i] !== null) {
                        td.textContent = data[i].toString();
                    }
                }
                tr.appendChild(td);
            }

            tbody.appendChild(tr);
        }

        tableau.appendChild(tbody);
        tableau.insertAdjacentHTML('afterbegin', `<caption>${t('calibration.signalTableCaption', { traceurName: traceur.nom })}</caption>`);

        const descriptionElement = document.querySelector('.descriptionConcentration');
        if (descriptionElement) {
            descriptionElement.style.display = 'block';
            descriptionElement.innerHTML = `<h2>${t('calibration.deviceData', {
                deviceNumber: this.lecteur.numeroFluorimetre,
                measureDate: traceur.dateMesure
            })}</h2>`;
        }

        const conteneurCible = conteneur || document.querySelector('.wrap-tableau');
        if (conteneurCible) {
            conteneurCible.insertAdjacentElement('afterbegin', tableau);
        }

        return tableau;
    }


    /**
     * Affiche le graphique pour un traceur
     * @param {Object} traceur - Le traceur à afficher
     * @param {Object|null} lampe - La lampe du traceur à afficher (par défaut: null)
     */
    afficherGraphiqueTraceur(traceur, lampe = null) {
        const defaultLampe = lampe || traceur.lampePrincipale;
        this.graphiqueCalibration.afficherGraphique(traceur, defaultLampe);
    }


    /**
     * Ajoute les points mesurés au graphique
     * @param {Object} chartInstance - L'instance du graphique Chart.js
     * @param {number} idLampe - L'ID de la lampe
     * @param {Object} traceur - Le traceur concerné
     */
    ajouterPointsMesures(chartInstance, idLampe, traceur) {
        const eau = this.lecteur.recupererTraceurEau();
        if (!eau) return;

        const eauLampe = eau.getDataParNom('L' + idLampe + '-' + 1);

        // Dataset pour les points mesurés
        const datasetPoints = {
            label: 'Points mesurés',
            data: [],
            backgroundColor: 'rgba(54, 162, 235, 1)',
            borderColor: 'rgba(54, 162, 235, 1)',
            pointRadius: 6,
            showLine: false
        };

        for (let i = 0; i < traceur.echelles.length; i++) {
            const valeur = traceur.getDataParNom('L' + idLampe + '-' + (i + 1));
            if (valeur !== 'NaN' && !isNaN(valeur)) {
                datasetPoints.data.push({
                    x: valeur,
                    y: traceur.echelles[i]
                });
            }
        }

        datasetPoints.data.push({
            x: eauLampe,
            y: 0
        });

        datasetPoints.data.sort((a, b) => a.x - b.x);
        chartInstance.data.datasets.push(datasetPoints);
    }


    /**
     * Génère et télécharge le fichier de données de calibration
     */
    exporterDonneesCSV() {
        const contenu = this.lecteur.convertirEnCSV ?
            this.lecteur.convertirEnCSV() :
            this.lecteur.getContenuFichier();

        const BOM = '\uFEFF';
        const contenuUTF8 = BOM + contenu;

        const blob = new Blob([contenuUTF8], {type: 'text/csv;charset=utf-8'});
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `ExportCalibration-${new Date().toLocaleString().replace(/\/|:|\,|\s/g, '-')}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}


/**
 * Instance singleton du contrôleur
 */
let controlleurCalibrationInstance = null;


/**
 * Récupère ou crée l'instance du contrôleur
 * @returns {ControlleurCalibration} L'instance du contrôleur
 */
export function getControlleurCalibration() {
    if (!controlleurCalibrationInstance) {
        controlleurCalibrationInstance = new ControlleurCalibration();
    }
    return controlleurCalibrationInstance;
}