import Session from "@/assets/js/Session/Session.js";
import { Chart } from "chart.js/auto";


/**
 * Remplace une suite de caractère par une autre dans contenuFichier, et affiche à nouveau le graphique à partir de ces nouvelles données
 * @param ancien Ancien label à remplacer
 * @param nouveau Nouveau label à ajouter
 * @param base Contenu du fichier à modifier
 * @returns {string} Contenu du fichier mis à jour
 */
export function remplacerDonneesFichier(ancien, nouveau, base) {
    let lignes = base.split('\n');
    let header = lignes[2].split(';');

    for (let i = 0; i < header.length; i++) {
        if (header[i] === ancien) {
            header[i] = nouveau;
        }

        if (header[i] === 'L' + ancien) {
            header[i] = 'L' + nouveau;
        }
    }

    const canvas = document.getElementById('graphique');
    const existingChart = Chart.getChart(canvas);
    if (existingChart) {
        existingChart.data.datasets.forEach((dataset) => {
            if (dataset.label === ancien) {
                dataset.label = nouveau;
            }
        });
        existingChart.update();
    }

    lignes[2] = header.join(';');
    return lignes.join('\n');
}