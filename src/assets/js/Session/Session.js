/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 */


/**
 * Classe permettant le stockage des différentes variables de session
 */
class Session {
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
        Session.#instance = this;
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
    }
}

export default Session;

