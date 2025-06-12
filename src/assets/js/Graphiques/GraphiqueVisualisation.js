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
                    pointRadius: 0,
                    pointHoverRadius: 3,
                    pointHitRadius: 10
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
        const zoomMode = Session.getInstance().zoomGraphiques;

        const chartOptions = {
            type: 'line',
            data: data,
            options: {
                animation: false,
                animations: {
                    colors: false,
                    x: false,
                    y: false
                },
                transitions: {
                    zoom: {
                        animation: {
                            duration: 0
                        }
                    },
                    pan: {
                        animation: {
                            duration: 0
                        }
                    }
                },
                elements: {
                    line: {
                        tension: 0
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                },
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
                        limits: {
                            x: {minRange: 1000},
                            y: {minRange: 0.01}
                        },
                        pan: {
                            enabled: true,
                            mode: zoomMode,
                            threshold: 10,
                            onPanComplete: function() {
                            }
                        },
                        zoom: {
                            wheel: {
                                enabled: true,
                                speed: 0.05
                            },
                            pinch: {
                                enabled: true
                            },
                            mode: zoomMode,
                            onZoomComplete: function() {
                            }
                        }
                    },
                    decimation: {
                        enabled: true,
                        algorithm: 'lttb',
                        samples: 500
                    },
                    annotation: {annotation: {}},
                    tooltip: {
                        enabled: true,
                        animation: false,
                        mode: 'nearest',
                        intersect: true,
                        axis: 'xy',
                        position: 'nearest',
                        caretSize: 6,
                        callbacks: {
                            title: tooltipItem => DateTime.fromMillis(tooltipItem[0].parsed.x, {zone: 'UTC'}).toFormat('dd/MM/yy-HH:mm:ss'),
                            label: tooltipItem => tooltipItem.dataset.label + ': ' + tooltipItem.parsed.y
                        }
                    }
                },

                hover: {
                    mode: 'nearest',
                    intersect: true,
                    axis: 'xy',
                    animationDuration: 0
                },

                responsive: true,
                maintainAspectRatio: true,
                resizeDelay: 0,

                devicePixelRatio: window.devicePixelRatio || 1,

                onResize: function(chart, size) {
                }
            }
        };

        new window.Chart(ctx, chartOptions);

        this.cacherDoublons();

        document.querySelector('.bandeauGraphiques')?.style.setProperty('display', 'flex');
        document.querySelector('.outilSuppressionCourbes')?.style.setProperty('display', 'flex');
        document.querySelector('.infos')?.style.setProperty('display', 'none');
    }


    /**
     * Permet à l'utilisateur de sélectionner une zone sur le graphique. Retourne les valeurs minimales et maximale de l'axe X de la zone sélectionnée.
     * Met en couleur la zone sélectionnée aussi
     * @returns {Promise<Array>} Tableau contenant les valeurs minimales et maximales de l'axe X (des dates) de la zone sélectionnée
     */
    selectionnerZoneGraphique() {
        return new Promise((resolve) => {
            const myChart = window.Chart.getChart(document.getElementById('graphique'));
            if (!myChart) {
                resolve(null);
                return;
            }

            const canvas = myChart.canvas;
            let flag = true;

            myChart.options.plugins.zoom.pan.enabled = false;
            myChart.options.plugins.zoom.zoom.wheel.enabled = false;

            afficherPopup(
                '<img alt="" src="Ressources/img/select.png">',
                'Sélectionnez une zone sur le graphique',
                'Commencez par sélectionner la période influencée par le traceur en cliquant et en maintenant le clic gauche sur le graphique, puis en relâchant le clic à la fin de la zone à sélectionner.',
                '<div class="bouton boutonFonce" onclick="fermerPopup()">COMMENCER</div>'
            );

            let isSelecting = false;
            let startX = null;
            let currentX = null;
            let animationFrameId = null;

            // Pour éviter les doublons d'annotations
            if (!myChart.options.plugins.annotation.annotations) {
                myChart.options.plugins.annotation.annotations = {};
            }

            function getRelativeX(e) {
                const rect = canvas.getBoundingClientRect();
                return (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
            }

            function drawSelection() {
                if (!isSelecting) return;

                const scale = myChart.scales['x'];

                // Conversion des pixels en valeurs de l'axe X
                const xMinPx = Math.min(startX, currentX);
                const xMaxPx = Math.max(startX, currentX);
                const xMinVal = scale.getValueForPixel(xMinPx);
                const xMaxVal = scale.getValueForPixel(xMaxPx);

                // Mise à jour de l'annotation
                myChart.options.plugins.annotation.annotations['zoneSelection'] = {
                    type: 'box',
                    xMin: xMinVal,
                    xMax: xMaxVal,
                    yMin: -Infinity,
                    yMax: Infinity,
                    backgroundColor: 'rgba(255, 99, 132, 0.25)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2
                };

                myChart.update('none'); // Mise à jour sans animation
                animationFrameId = null;
            }

            function onMouseDown(e) {
                if (flag) {
                    isSelecting = true;
                    startX = getRelativeX(e);
                    currentX = startX;
                    // Dessiner immédiatement au clic pour un feedback initial
                    drawSelection();
                }
            }

            function onMouseMove(e) {
                if (isSelecting && flag) {
                    currentX = getRelativeX(e);
                    if (!animationFrameId) {
                        animationFrameId = requestAnimationFrame(drawSelection);
                    }
                }
            }

            function onMouseUp(e) {
                if (isSelecting && flag) {
                    isSelecting = false;
                    const x = getRelativeX(e);
                    const xMinPx = Math.min(startX, x);
                    const xMaxPx = Math.max(startX, x);

                    const scale = myChart.scales['x'];
                    const xMinVal = scale.getValueForPixel(xMinPx);
                    const xMaxVal = scale.getValueForPixel(xMaxPx);

                    const startDate = DateTime.fromMillis(xMinVal, {zone: 'UTC'}).toFormat('dd/MM/yy-HH:mm:ss');
                    const endDate = DateTime.fromMillis(xMaxVal, {zone: 'UTC'}).toFormat('dd/MM/yy-HH:mm:ss');

                    // Nettoyage annotation
                    delete myChart.options.plugins.annotation.annotations['zoneSelection'];
                    myChart.update('none');

                    // Nettoyage des events
                    canvas.removeEventListener('mousedown', onMouseDown);
                    canvas.removeEventListener('mousemove', onMouseMove);
                    canvas.removeEventListener('mouseup', onMouseUp);
                    // Pour le tactile
                    canvas.removeEventListener('touchstart', onMouseDown);
                    canvas.removeEventListener('touchmove', onMouseMove);
                    canvas.removeEventListener('touchend', onMouseUp);

                    flag = false;

                    myChart.options.plugins.zoom.pan.enabled = true;
                    myChart.options.plugins.zoom.zoom.wheel.enabled = true;

                    resolve([startDate, endDate]);
                }
            }

            // Ajout des écouteurs (souris et tactile)
            canvas.addEventListener('mousedown', onMouseDown);
            canvas.addEventListener('mousemove', onMouseMove);
            canvas.addEventListener('mouseup', onMouseUp);
            canvas.addEventListener('touchstart', onMouseDown, {passive: false});
            canvas.addEventListener('touchmove', onMouseMove, {passive: false});
            canvas.addEventListener('touchend', onMouseUp, {passive: false});
        });
    }
}

export default GraphiqueVisualisation;
