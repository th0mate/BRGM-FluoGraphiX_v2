/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 */


/**
 * Classe permettant le stockage des différentes variables de session
 */
class Session {
    constructor() {
        this.zoomGraphiques = 'xy';
        this.estDetecteAnomalieCalibration = false;
        this.contenuFichierMesures = "";
        this.contenuMesuresInitial = "";
        this.contenuFichierCalibration = "";
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