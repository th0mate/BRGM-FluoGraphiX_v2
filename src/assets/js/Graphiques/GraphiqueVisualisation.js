/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 */
import Graphiques from '@/assets/js/Graphiques/Graphiques.js';
import Session from "@/assets/js/Session/Session.js";
import {DateTime} from 'luxon';
import 'chartjs-adapter-luxon';


class GraphiqueVisualisation extends Graphiques {


    /**
     * Traite les données de mesures pour les afficher sous la forme d'un graphique : milliVolts en fonction du temps - Partie Visualisation
     * @param mvContent le contenu du ou des fichier(s) importé(s) par l'utilisateur à afficher
     */
    afficherGraphique(mvContent) {
        const couleurs = [
            'rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 1)', 'rgba(153, 102, 255, 1)',
            'rgba(255, 206, 86, 1)', 'rgba(255, 159, 64, 1)', 'rgba(255, 99, 132, 1)',
            'rgb(249,158,255)', 'rgba(255, 99, 132, 1)'
        ];
        const lignes = mvContent.split('\n');

        if (!lignes[0].includes('FluoriGraphix') && !lignes[0].includes('FluoGraphiX')) {
            lignes.unshift('\n');
            lignes.unshift('\n');
        }

        const header = lignes[2].split(';').splice(2);
        const dataColumns = header.map(() => []);

        for (let i = 3; i < lignes.length - 1; i++) {
            const colonnes = lignes[i].split(';');
            const dateStr = colonnes[0] + '-' + colonnes[1];
            const timeDate = DateTime.fromFormat(dateStr, 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'});
            const timestamp = timeDate.toMillis();
            for (let j = 0; j < dataColumns.length; j++) {
                const value = parseFloat(colonnes[j + 2]);
                dataColumns[j].push({x: timestamp, y: value});
            }
        }

        const datasets = header.map((label, i) => {
            if (label !== '' && label !== 'R' && label.trim() !== '') {
                if (i >= couleurs.length) {
                    couleurs.push(this.getRandomColor());
                }
                return {
                    label: label,
                    data: dataColumns[i],
                    borderColor: couleurs[i],
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 0
                };
            }
            return null;
        }).filter(Boolean);

        const data = {datasets};
        const canvas = document.getElementById('graphique');
        canvas.style.display = 'block';
        const existingChart = window.Chart.getChart(canvas);
        if (existingChart) existingChart.destroy();
        const ctx = canvas.getContext('2d');

        const chartOptions = {
            type: 'line',
            data: data,
            options: {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            parser: 'x',
                            unit: 'hour',
                            tooltipFormat: 'DD/MM/YY-HH:mm:ss',
                            displayFormats: {hour: 'DD/MM/YY-HH:mm:ss'}
                        },
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 20,
                            callback: value => DateTime.fromMillis(value, {zone: 'UTC'}).toFormat('dd/MM/yy-HH:mm:ss')
                        },
                        min: undefined,
                        max: undefined,
                        bounds: 'ticks',
                        beginAtZero: false
                    },
                    y: {
                        beginAtZero: false,
                        min: undefined,
                        max: undefined,
                        bounds: 'ticks'
                    }
                },
                plugins: {
                    zoom: {
                        pan: {enabled: true, mode: `${Session.getInstance().zoomGraphiques}`},
                        zoom: {
                            wheel: {enabled: true},
                            pinch: {enabled: true},
                            mode: `${Session.getInstance().zoomGraphiques}`
                        }
                    },
                    annotation: {annotation: {}},
                    tooltip: {
                        callbacks: {
                            title: tooltipItem => DateTime.fromMillis(tooltipItem[0].parsed.x, {zone: 'UTC'}).toFormat('dd/MM/yy-HH:mm:ss'),
                            label: tooltipItem => tooltipItem.dataset.label + ': ' + tooltipItem.parsed.y
                        }
                    }
                },
            }
        };

        new window.Chart(ctx, chartOptions);
        this.cacherDoublons();
    }
}

export default GraphiqueVisualisation;
