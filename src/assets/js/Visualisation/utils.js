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
    let headerIndex = 0;
    let header;
    if (lignes.length > 2) {
        const firstCol = (lignes[2].split(';')[0] || '').replace(/[\n\r]/g, '').trim();
        const isLikelyDate = (s) => {
            if (!s) return false;
            const patterns = [
                /^\d{1,2}[\/\-\._]\d{1,2}[\/\-\._]\d{2,4}$/,
                /^\d{4}[\/\-\._]\d{1,2}[\/\-\._]\d{1,2}$/,
                /^\d{1,2}[\/\-\._]\d{1,2}[\/\-\._]\d{2,4}\s+\d{1,2}:\d{2}(:\d{2})?$/
            ];
            return patterns.some(rx => rx.test(s));
        };
        header = isLikelyDate(firstCol) ? lignes[0].split(';') : lignes[2].split(';');
        headerIndex = isLikelyDate(firstCol) ? 0 : 2;
    } else {
        header = lignes[0].split(';');
        headerIndex = 0;
    }

    for (let i = 0; i < header.length; i++) {
        if (header[i].trim() === ancien.trim()) {
            header[i] = nouveau.trim();
        }

        if (header[i] === 'L' + ancien.trim()) {
            header[i] = 'L' + nouveau.trim();
        }
    }

    const canvas = document.getElementById('graphique');
    const existingChart = Chart.getChart(canvas);
    if (existingChart) {
        existingChart.data.datasets.forEach((dataset) => {
            if (dataset.label.trim() === ancien.trim()) {
                dataset.label = nouveau;
            }
        });
        existingChart.update();
    }

    lignes[headerIndex] = header.join(';');
    return lignes.join('\n');
}