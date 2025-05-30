/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 */


/**
 * ======================================================================================================================
 * Classe abstraite Graphiques permettant de gérer les graphiques de l'application
 * ======================================================================================================================
 */
class Graphiques {

    constructor(lecteurFichierCalibration) {
        if (new.target === Graphiques) {
            throw new TypeError("Cannot construct Graphiques instances directly");
        }
        this.lecteurFichierCalibration = lecteurFichierCalibration;
    }

    afficherGraphique(data) {
        throw new Error("La méthode afficherGraphique() doit être implémentée par la classe enfant.");
    }


    /**
     * Cache dans le graphique existant toutes les courbes représentant des colonnes pour lesquelles isConstant renvoie true
     */
    cacherDoublons() {
        const canvas = document.getElementById('graphique');
        const existingChart = window.Chart.getChart(canvas);
        if (existingChart) {
            const datasets = existingChart.data.datasets;
            for (let i = 0; i < datasets.length; i++) {
                if (this.isConstant(datasets[i].data)) {
                    datasets[i].hidden = true;
                    const index = existingChart.data.datasets.findIndex(dataset => dataset.label === datasets[i].label);
                    if (existingChart.isDatasetVisible(index)) {
                        existingChart.toggleDataVisibility(index);
                    }
                }
            }
            existingChart.update();
        }
    }


    /**
     * Retourne true si le tableau passé en paramètre contient uniquement des duplications du même nombre
     * @param {Array} arr - la colonne de données à vérifier
     * @returns {boolean}
     */
    isConstant(arr) {
        if (!arr || arr.length === 0) return false;
        const value = this.around(arr[0].y);
        for (let i = 1; i < arr.length; i++) {
            if (this.around(arr[i].y) !== value) {
                return false;
            }
        }
        return true;
    }


    /**
     * Arrondit une valeur à 3 décimales
     */
    around(val) {
        return Math.round(val * 1000) / 1000;
    }


    /**
     * Retourne une couleur aléatoire foncée en hexadécimal
     * @returns {string}
     */
    static getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        let isLight = false;
        while (!isLight) {
            color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            isLight = !Graphiques.isColorLight(color);
        }
        return color;
    }


    /**
     * Retourne true si la couleur passée en paramètre est claire
     * @param {string} color
     * @returns {boolean}
     */
    static isColorLight(color) {
        const rgb = Graphiques.hexToRgb(color);
        const hsp = Math.sqrt(
            0.299 * (rgb.r * rgb.r) +
            0.587 * (rgb.g * rgb.g) +
            0.114 * (rgb.b * rgb.b)
        );
        return hsp > 127.5;
    }


    /**
     * Convertit une couleur hexadécimale en RGB
     * @param {string} hex
     * @returns {{r: number, g: number, b: number}}
     */
    static hexToRgb(hex) {
        const bigint = parseInt(hex.slice(1), 16);
        return {r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255};
    }
}

export default Graphiques;

