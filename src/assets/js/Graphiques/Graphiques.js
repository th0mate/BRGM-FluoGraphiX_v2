/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 */


class Graphiques {

    afficherGraphique(data) {
        throw new Error("La méthode afficherGraphique() doit être implémentée par la classe enfant.");
    }


    /**
     * Cache dans le graphique existant toutes les courbes réprésentant des colonnes pour lesquelles isConstant renvoie true
     */
    cacherDoublons() {
        const canvas = document.getElementById('graphique');
        const existingChart = Chart.getChart(canvas);
        if (existingChart) {
            const datasets = existingChart.data.datasets;
            for (let i = 0; i < datasets.length; i++) {
                if (isConstant(datasets[i].data)) {
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
     * Return true si le string passé en paramètre contient ne contient que des duplications du même nombre
     * @param string le string - donc la colonne de données à vérifier
     * @returns {boolean} true si le string contient que des duplications du même nombre
     */
    isConstant(string) {
        const value = string[0].y;
        for (let i = 1; i < string.length - 5; i++) {
            if (around(string[i].y) !== around(value)) {
                return false;
            }
        }
        return true;
    }


    /**
     * Retourne une couleur aléatoire en rgba
     * @returns {string} une couleur aléatoire en rgba
     */
    getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        let isLight = false;
        while (!isLight) {
            color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            isLight = !isColorLight(color);
        }
        return color;
    }


    /**
     * Retourne true si la couleur passée en paramètre est claire
     * @param color la couleur à vérifier
     * @returns {boolean} true si la couleur est claire
     */
    isColorLight(color) {
        const rgb = hexToRgb(color);
        const hsp = Math.sqrt(
            0.299 * (rgb.r * rgb.r) +
            0.587 * (rgb.g * rgb.g) +
            0.114 * (rgb.b * rgb.b)
        );
        return hsp > 127.5;
    }


    /**
     * Convertit une couleur hexadécimale en RGB
     * @param hex la couleur hexadécimale
     * @returns {{r: number, b: number, g: number}} la couleur en RGB
     */
    hexToRgb(hex) {
        const bigint = parseInt(hex.slice(1), 16);
        return {r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255};
    }
}