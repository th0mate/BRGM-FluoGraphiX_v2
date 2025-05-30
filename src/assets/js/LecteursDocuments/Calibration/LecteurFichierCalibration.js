/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 * Permet de lire les fichiers de calibration et d'en extraire les informations nécessaires
 */
import Traceur from '@/assets/js/Objects/Traceur.js';
import {afficherMessageFlash} from "@/assets/js/Common/utils.js";
import Session from '@/assets/js/Session/Session.js';


/**
 * ======================================================================================================================
 * Classe abstraite de base pour la lecture des fichiers de calibration
 * =====================================================================================================================
 */
export default class LecteurFichierCalibration {


    /**
     * Constructeur de la classe LecteurFichierCalibration
     * @param {string} contenuFichier - Contenu du fichier de calibration
     */
    constructor(contenuFichier) {
        this.lignes = [];
        this.sections = [];
        this.numeroFluorimetre = '';

        if (contenuFichier) {
            this.lignes = contenuFichier.split('\n');
        }
    }


    /**
     * Initialisation du lecteur avec le contenu du fichier
     * @param {boolean} estDepuisCalibration - Indique si l'initialisation est faite depuis la page calibration
     */
    initialiser(estDepuisCalibration = true) {
        if (!Session.getInstance().contenuFichierCalibration) {
            this.afficherMessageErreur('Erreur : aucune donnée exploitable.');
            return false;
        }

        this.nettoyerAffichage();

        this.sections = this.extraireSections();
        this.nomsTraceur = this.extraireNomsTraceurs();
        this.numeroFluorimetre = this.extraireNumeroFluorimetre();
        this.creerTraceurs();
        console.log(Session.getInstance().traceurs);

        return true;
    }


    /**
     * Nettoie les éléments d'affichage existants
     */
    nettoyerAffichage() {
        if (document.querySelector('.boutonDlData')) {
            document.querySelector('.boutonDlData').remove();
        }

        if (document.getElementById('graphiqueTraceur')) {
            document.getElementById('graphiqueTraceur').remove();
        }

        if (document.querySelector('.tableauTraceur')) {
            document.querySelector('.tableauTraceur').remove();
        }

        if (document.querySelector('.infosConcentration')) {
            document.querySelector('.infosConcentration').remove();
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


    /**
     * Récupère un traceur par son nom
     * @param {string} nom - Le nom du traceur
     * @returns {T} Le traceur correspondant ou null
     */
    recupererTraceurParNom(nom) {
        return Session.getInstance().traceurs.find(traceur => traceur.nom === nom);
    }


    /**
     * Récupère le traceur eau (sans unité)
     * @returns {T} Le traceur eau
     */
    recupererTraceurEau() {
        return Session.getInstance().traceurs.find(traceur => traceur.unite === '');
    }


    /**
     * Teste tous les traceurs pour vérifier la validité des données
     * @param {Function} fonctionAffichageGraphique - Fonction pour afficher le graphique
     * @param {Function} fonctionInitialiserCalculs - Fonction pour initialiser les calculs
     * @returns {boolean} True si les données sont valides, false sinon
     */
    testerTousTraceurs(fonctionAffichageGraphique, fonctionInitialiserCalculs) {
        let donneesCorrompues = false;

        for (let i = 0; i < Session.getInstance().traceurs.length; i++) {
            for (let j = 1; j <= 4; j++) {
                fonctionAffichageGraphique(Session.getInstance().traceurs[i], j);
                fonctionInitialiserCalculs(j, Session.getInstance().traceurs[i]);
            }
        }

        return !donneesCorrompues;
    }


    /**
     * Méthodes abstraites à implémenter dans les classes dérivées
     */
    extraireSections() {
        throw new Error('Méthode abstraite non implémentée');
    }

    extraireNomsTraceurs() {
        throw new Error('Méthode abstraite non implémentée');
    }

    extraireNumeroFluorimetre() {
        throw new Error('Méthode abstraite non implémentée');
    }

    extraireDateCalibration() {
        throw new Error('Méthode abstraite non implémentée');
    }

    creerTraceurs() {
        throw new Error('Méthode abstraite non implémentée');
    }

    creerTurbidite() {
        throw new Error('Méthode abstraite non implémentée');
    }


    /**
     * Méthode utilitaire pour arrondir un nombre sans virgule
     * @param {number} number - Le nombre à arrondir
     * @returns {number} Le nombre arrondi
     */
    arrondirSansVirgule(number) {
        return Math.round(number);
    }


    /**
     * Calcule une échelle en ppb à partir d'une puissance de dix
     * @param {number} puissanceDix - La puissance de dix
     * @returns {number} L'échelle en ppb
     */
    calculerEchelle(puissanceDix) {
        return this.arrondirSansVirgule((Math.pow(10, puissanceDix)) * (Math.pow(10, 9)));
    }


    /**
     * Récupère le contenu du fichier sous forme de texte
     * @returns {string} Le contenu du fichier
     */
    getContenuFichier() {
        return Session.getInstance().contenuFichierCalibration;
    }


    /**
     * Récupère le numéro du fluorimètre
     * @returns {string} Le numéro du fluorimètre
     */
    getNumeroFluorimetre() {
        return this.numeroFluorimetre;
    }
}
