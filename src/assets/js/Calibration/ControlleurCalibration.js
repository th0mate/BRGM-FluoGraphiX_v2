/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 */
import { LecteurFichierDAT } from '@/assets/js/LecteursDocuments/Calibration/LecteurFichierDAT.js';
import { LecteurFichierCSV } from '@/assets/js/LecteursDocuments/Calibration/LecteurFichierCSV.js';
import { GestionnaireCourbesCalibration, initialiserCalculsCourbes } from '@/assets/js/Calibration/gestionCalculsCourbesCalibration.js';
import {afficherMessageFlash} from "@/assets/js/Common/utils.js";
import GraphiqueCalibration from '@/assets/js/Graphiques/GraphiqueCalibration.js';
import Session from '@/assets/js/Session/Session.js';


/**
 * =====================================================================================================================
 * Classe contrôleur principale pour gérer les calibrations
 * =====================================================================================================================
 */
export class ControlleurCalibration {


    /**
     * Constructeur du contrôleur
     */
    constructor() {
        this.lecteur = null;
        this.gestionnaireCalibration = new GestionnaireCourbesCalibration();
        this.calibrationChargee = false;
        this.graphiqueCalibration = new GraphiqueCalibration();
        this.session = Session.getInstance();
    }


    /**
     * Initialise le contrôleur avec le contenu d'un fichier de calibration
     * @param {string} contenu - Le contenu du fichier de calibration
     * @param {boolean} estFichierDat - True si le fichier est au format DAT, false pour CSV
     * @param {boolean} estDepuisCalibration - True si l'initialisation est faite depuis la page calibration
     * @returns {boolean} True si l'initialisation a réussi, false sinon
     */
    initialiser(contenu, estFichierDat = true, estDepuisCalibration = true) {
        if (!contenu) {
            this.afficherMessageErreur('Erreur : aucune donnée exploitable.');
            return false;
        }

        // Créer le lecteur approprié selon le format du fichier
        this.lecteur = estFichierDat
            ? new LecteurFichierDAT(contenu)
            : new LecteurFichierCSV(contenu);

        // Initialiser le lecteur
        const resultat = this.lecteur.initialiser(estDepuisCalibration);

        if (resultat) {
            this.calibrationChargee = true;

            // Afficher l'interface utilisateur
            if (estDepuisCalibration) {
                this.afficherListeTraceurs();
            } else {
                // Depuis la page visualisation, on fait autre chose...
                this.preparerVisualisationDonnees();
            }
        }

        return resultat;
    }


    /**
     * Affiche la liste des traceurs dans un select
     */
    afficherListeTraceurs() {
        const traceurs = this.lecteur.getTraceurs();
        if (!traceurs || traceurs.length === 0) return;

        // Création du select pour les traceurs
        const select = document.createElement('select');
        select.classList.add('selectTraceur');

        for (let i = 0; i < traceurs.length; i++) {
            const option = document.createElement('option');
            option.value = traceurs[i].nom;
            option.textContent = traceurs[i].nom;
            select.appendChild(option);
        }

        // Ajout du select au conteneur approprié
        const container = document.querySelector('.containerFluo');
        if (container) {
            container.appendChild(select);

            // Ajout de l'événement change
            select.addEventListener('change', () => {
                const nomTraceur = select.value;
                const traceur = this.lecteur.recupererTraceurParNom(nomTraceur);
                this.afficherTraceur(traceur);
            });

            // Afficher le premier traceur par défaut
            this.afficherTraceur(traceurs[0]);

            // Afficher l'équation
            if (document.querySelector('.equationPannel')) {
                document.querySelector('.equationPannel').style.display = 'flex';
            }
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

        // Ajouter le bouton de téléchargement des données
        this.ajouterBoutonTelechargement();
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
     */
    creerTableauTraceur(traceur) {
        // Créer le tableau
        const tableau = document.createElement('table');
        tableau.classList.add('tableauTraceur');

        // Créer l'en-tête du tableau
        const thead = document.createElement('thead');
        const trHead = document.createElement('tr');

        // Ajouter une cellule vide pour l'en-tête
        const thVide = document.createElement('th');
        trHead.appendChild(thVide);

        // Ajouter les en-têtes pour chaque échelle
        for (let i = 0; i < traceur.echelles.length; i++) {
            const th = document.createElement('th');
            th.textContent = traceur.echelles[i];
            trHead.appendChild(th);
        }

        thead.appendChild(trHead);
        tableau.appendChild(thead);

        // Créer le corps du tableau
        const tbody = document.createElement('tbody');

        // Pour chaque lampe, créer une ligne
        for (let i = 1; i <= 4; i++) {
            const tr = document.createElement('tr');

            // Ajouter l'en-tête de ligne (nom de la lampe)
            const th = document.createElement('th');
            th.textContent = `L${i}`;
            tr.appendChild(th);

            // Ajouter les valeurs pour chaque échelle
            for (let j = 1; j <= traceur.echelles.length; j++) {
                const td = document.createElement('td');
                const valeur = traceur.getDataParNom(`L${i}-${j}`);
                td.textContent = valeur === 'NaN' || isNaN(valeur) ? '-' : valeur;
                tr.appendChild(td);
            }

            tbody.appendChild(tr);
        }

        tableau.appendChild(tbody);

        // Ajouter le tableau au DOM
        const container = document.querySelector('.containerFluo');
        if (container) {
            container.appendChild(tableau);
        }
    }


    /**
     * Affiche le graphique pour un traceur
     * @param {Object} traceur - Le traceur à afficher
     */
    afficherGraphiqueTraceur(traceur) {
        // Créer le select pour choisir la lampe
        this.creerSelectLampe(traceur);
        // Afficher le graphique via GraphiqueCalibration
        const defaultLampe = traceur.lampePrincipale !== 'NaN' ? traceur.lampePrincipale : 1;
        this.graphiqueCalibration.afficherGraphique(traceur, defaultLampe);
    }


    /**
     * Crée un sélecteur pour choisir la lampe à afficher
     * @param {Object} traceur - Le traceur concerné
     */
    creerSelectLampe(traceur) {
        const select = document.createElement('select');
        select.classList.add('selectLigne');

        for (let i = 1; i <= 4; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `Lampe ${i}`;
            select.appendChild(option);
        }

        // Sélectionner la lampe principale par défaut
        if (traceur.lampePrincipale !== 'NaN') {
            select.value = traceur.lampePrincipale;
        }

        // Ajouter l'événement change
        select.addEventListener('change', () => {
            const idLampe = parseInt(select.value);
            this.graphiqueCalibration.afficherGraphique(traceur, idLampe);
        });

        // Ajouter le select au DOM
        const container = document.querySelector('.containerFluo');
        if (container) {
            container.appendChild(select);
        }
    }


    /**
     * Affiche la courbe d'un traceur pour une lampe donnée
     * @param {number} idLampe - L'ID de la lampe
     * @param {Object} traceur - Le traceur concerné
     */
    afficherCourbeTraceur(idLampe, traceur) {
        // Récupérer le graphique existant
        const canvas = document.getElementById('graphiqueTraceur');
        const chartInstance = Chart.getChart(canvas);

        if (chartInstance) {
            // Réinitialiser les datasets
            chartInstance.data.datasets = [];

            // Ajouter le dataset des points mesurés
            this.ajouterPointsMesures(chartInstance, idLampe, traceur);

            // Mettre à jour le graphique
            chartInstance.update();

            // Initialiser les calculs de courbe de calibration
            initialiserCalculsCourbes(idLampe, traceur);
        }
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

        const eauLampe = eau.getDataParNom('L' + idLampe + '-1');

        // Dataset pour les points mesurés
        const datasetPoints = {
            label: 'Points mesurés',
            data: [],
            backgroundColor: 'rgba(54, 162, 235, 1)',
            borderColor: 'rgba(54, 162, 235, 1)',
            pointRadius: 6,
            showLine: false
        };

        // Ajouter les points pour chaque échelle
        for (let i = 0; i < traceur.echelles.length; i++) {
            const valeur = traceur.getDataParNom('L' + idLampe + '-' + (i + 1));
            if (valeur !== 'NaN' && !isNaN(valeur)) {
                datasetPoints.data.push({
                    x: valeur,
                    y: traceur.echelles[i]
                });
            }
        }

        // Ajouter le point d'eau
        datasetPoints.data.push({
            x: eauLampe,
            y: 0
        });

        // Trier les points par X croissant
        datasetPoints.data.sort((a, b) => a.x - b.x);

        // Ajouter le dataset au graphique
        chartInstance.data.datasets.push(datasetPoints);
    }


    /**
     * Ajoute un bouton pour télécharger les données de calibration
     */
    ajouterBoutonTelechargement() {
        const bouton = document.createElement('button');
        bouton.classList.add('boutonDlData');
        bouton.textContent = 'Télécharger les données';

        bouton.addEventListener('click', () => {
            this.telechargerDonneesCalibration();
        });

        // Ajouter le bouton au DOM
        const container = document.querySelector('.containerFluo');
        if (container) {
            container.appendChild(bouton);
        }
    }


    /**
     * Génère et télécharge le fichier de données de calibration
     */
    telechargerDonneesCalibration() {
        const contenu = this.lecteur.convertirEnTexte ?
            this.lecteur.convertirEnTexte() :
            this.lecteur.getContenuFichier();

        const blob = new Blob([contenu], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `calibration_${this.lecteur.getNumeroFluorimetre()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }


    /**
     * Prépare les données pour la visualisation (page concentrations)
     */
    preparerVisualisationDonnees() {
        // Remplacer les noms de lampe A145, A146, etc. si nécessaire
        //this.remplacerNomsLampes(); TODO

        // Tester tous les traceurs pour vérifier la validité des données
        this.testerTousTraceurs();
    }


    /**
     * Teste tous les traceurs pour vérifier la validité des données
     */
    testerTousTraceurs() {
        const traceurs = this.lecteur.getTraceurs();
        if (!traceurs) return;

        for (let i = 0; i < traceurs.length; i++) {
            for (let j = 1; j <= 4; j++) {
                this.afficherGraphiqueTraceur(traceurs[i]);
                initialiserCalculsCourbes(j, traceurs[i]);
            }
        }
    }


    /**
     * Affiche un message d'erreur
     * @param {string} message - Le message d'erreur
     */
    afficherMessageErreur(message) {
        if (typeof afficherMessageFlash === 'function') {
            afficherMessageFlash(message, 'danger');
        } else {
            console.error(message);
        }
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


/**
 * Initialise le fichier de calibration
 * @param {boolean} estFichierDat - True si le fichier est au format DAT, false pour CSV
 * @param {boolean} estDepuisCalibration - True si l'initialisation est faite depuis la page calibration
 */
export function initFichierCalibration(estFichierDat = true, estDepuisCalibration = true) {
    const controleur = getControlleurCalibration();
    controleur.initialiser(this.session.contenuFichierCalibration, estFichierDat, estDepuisCalibration);
}


/**
 * Initialise Calibrat.dat
 * @param {boolean} estFichierDat - True si le fichier est au format DAT, false pour CSV
 * @param {boolean} estDepuisCalibration - True si l'initialisation est faite depuis la page calibration
 */
export function init(estFichierDat = true, estDepuisCalibration = true) {
    const controleur = getControlleurCalibration();
    controleur.initialiser(this.session.contenuFichierCalibration, estFichierDat, estDepuisCalibration);
}
