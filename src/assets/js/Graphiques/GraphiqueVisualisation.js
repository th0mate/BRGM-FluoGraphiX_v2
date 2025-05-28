/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 */
import Graphiques from './Graphiques.js';
import Session from "@/assets/js/Session/Session.js";


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
                    couleurs.push(Graphiques.getRandomColor());
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
                        }
                    },
                    y: {beginAtZero: false}
                },
                plugins: {
                    zoom: {
                        pan: {enabled: true, mode: `${zoom}`},
                        zoom: {
                            wheel: {enabled: true},
                            pinch: {enabled: true},
                            mode: `${zoom}`
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
        document.querySelector('.bandeauGraphiques').style.display = 'flex';
        document.querySelector('.outilSuppressionCourbes').style.display = 'flex';
        document.querySelector('.infos').style.display = 'none';

        let estFichierDat = true;
        if (Session.getInstance().contenuFichierCalibration.split('\n')[0].includes('FluoriGraphix') || Session.getInstance().contenuFichierCalibration.split('\n')[0].includes('FluoGraphiX')) {
            estFichierDat = false;
        }
        if (Session.getInstance().traceurs.length === 0) {
            initFichierCalibration(estFichierDat, false);
        }
        if (Session.getInstance().contenuFichierMesures.includes('A145') && Session.getInstance().contenuFichierMesures.includes('A146') && Session.getInstance().contenuFichierMesures.includes('A147') && Session.getInstance().contenuFichierMesures.includes('A148')) {
            for (let i = 0; i < Session.getInstance().traceurs.length; i++) {
                remplacerDonneesFichier(`A${145 + i}`, `L${1 + i}`);
            }
        }
    }


    /**
     * Permet d'étendre le menu des paramètres du graphique de la page de visualisation
     */
    toogleMenuGraphique() {
        const menu = document.querySelector('.bandeauGraphiques');
        const extendButton = document.querySelector('.extend');

        if (menu.style.width !== '55px') {
            menu.style.width = '55px';
            extendButton.style.transform = 'rotate(0deg)';

            menu.querySelectorAll('.elementBandeau').forEach(elementBandeau => {
                elementBandeau.removeAttribute('style');
                elementBandeau.querySelector('span').removeAttribute('style');
            });

            menu.querySelectorAll('.separatorGraphique').forEach(separator => {
                separator.removeAttribute('style');
                separator.querySelector('.text').removeAttribute('style');
                separator.querySelectorAll('span:not(.text)').forEach(span => {
                    span.removeAttribute('style');
                });
            });

        } else {
            menu.style.width = '350px';
            extendButton.style.transform = 'rotate(180deg)';

            setTimeout(() => {
                menu.querySelectorAll('.elementBandeau').forEach(elementBandeau => {
                    elementBandeau.style.width = '300px';
                    elementBandeau.querySelector('span').style.display = 'block';
                    elementBandeau.style.margin = '5px';
                });

                menu.querySelectorAll('.separatorGraphique').forEach(separator => {
                    separator.style.width = '280px';
                    separator.style.height = 'auto';
                    separator.style.display = 'flex';
                    separator.style.alignItems = 'center';
                    separator.style.justifyContent = 'space-between';
                    separator.style.backgroundColor = 'transparent';
                    separator.querySelector('.text').style.display = 'block';
                    separator.querySelectorAll('span:not(.text)').forEach(span => {
                        span.style.display = 'block';
                        span.style.height = '1px';
                        span.style.width = '70px';
                        span.style.backgroundColor = 'white';
                    });
                });
            }, 300);
        }
    }
}

export default GraphiqueVisualisation;

