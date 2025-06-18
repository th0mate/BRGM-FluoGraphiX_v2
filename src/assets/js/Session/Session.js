/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 * Permet de stocker les différentes variables de session utilisées dans l'application (données de calibration, traceurs, etc.)
 */


/**
 * =====================================================================================================================
 * Classe permettant le stockage des différentes variables de session
 * ======================================================================================================================
 */
export default class Session {
    static #instance;

    constructor() {
        if (Session.#instance) {
            return Session.#instance;
        }
        this.zoomGraphiques = 'xy';
        this.estDetecteAnomalieCalibration = false;
        this.contenuFichierMesures = "";
        this.contenuMesuresInitial = "";
        this.contenuFichierCalibration = "";
        this.traceurs = [];
        this.calculs = [];
        this.formatDates = 1;
        Session.#instance = this;
        window.Session = this;
    }

    static getInstance() {
        if (!Session.#instance) {
            Session.#instance = new Session();
        }
        return Session.#instance;
    }

    /**
     * Réinitialise les variables de session
     */
    reset() {
        this.zoomGraphiques = 'xy';
        this.estDetecteAnomalieCalibration = false;
        this.contenuFichierMesures = "";
        this.contenuMesuresInitial = "";
        this.contenuFichierCalibration = "";
        this.traceurs = [];
        this.calculs = [];
        this.formatDates = 1;
    }
}

