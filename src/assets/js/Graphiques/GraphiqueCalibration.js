/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 * Permet la gestion des graphiques de calibration. Héritée de Graphiques.js
 */
import Graphiques from '@/assets/js/Graphiques/Graphiques.js';


class GraphiqueCalibration extends Graphiques {


    /**
     * Affiche un graphique pour un traceur donné de ses LX en fonction de la valeur des signaux - Partie Calibration
     * @param traceur le traceur à afficher
     * @param idData l'id du traceur
     */
    afficherGraphique(traceur, idData) {
        let labels = traceur.echelles;
        let datasets = [];
        let labelX;
        let labelY;

        if (idData === traceur.lampePrincipale) {
            labelX = `Signal (mV)`;
            labelY = `Concentration (${traceur.unite})`;
            for (let i = 1; i <= 4; i++) {
                let data = [];
                for (let j = 0; j < labels.length; j++) {
                    const value = traceur.getDataParNom('L' + i + '-' + (j + 1));
                    if (value !== null && value !== 'NaN') {
                        data.push({x: value, y: labels[j]});
                    }
                }
                data = data.filter((point) => !isNaN(point.x) && !isNaN(point.y));
                let hiddenStatus = false;
                if (data.length > 1 && data[0].x === '0') {
                    hiddenStatus = true;
                }
                if (i === idData) {
                    const eau = this.lecteurFichierCalibration.recupererTraceurEau();
                    let dataEau = [];
                    for (let j = 0; j < labels.length; j++) {
                        const value = eau.getDataParNom('L' + idData + '-' + (j + 1));
                        if (value !== null && value !== 'NaN') {
                            dataEau.push({x: value, y: 0});
                        }
                    }
                    dataEau = dataEau.filter((point) => !isNaN(point.x) && !isNaN(point.y));
                    datasets.push({
                        label: eau.nom,
                        data: dataEau,
                        borderColor: 'rgb(86,135,255)',
                        borderWidth: 2,
                        fill: false,
                        hidden: false,
                        showLine: false,
                        pointStyle: 'cross'
                    });
                    datasets.push({
                        label: 'L' + i,
                        data: data,
                        borderColor: Graphiques.getRandomColor(),
                        borderWidth: 2,
                        fill: false,
                        hidden: hiddenStatus,
                        showLine: false,
                        pointStyle: 'cross'
                    });
                }
            }
        } else {
            labelX = `Signal L${traceur.lampePrincipale} (mV)`;
            labelY = `Signal parasite L${idData} (mV)`;
            let data = [];
            const tableauY = [];
            for (let j = 0; j < labels.length; j++) {
                const value = traceur.getDataParNom('L' + idData + '-' + (j + 1));
                if (value !== null && value !== 'NaN') {
                    tableauY.push(value);
                }
            }
            for (let j = 0; j < labels.length; j++) {
                const value = traceur.getDataParNom('L' + traceur.lampePrincipale + '-' + (j + 1));
                if (value !== null && value !== 'NaN') {
                    data.push({x: value, y: tableauY[j]});
                }
            }
            data = data.filter((point) => !isNaN(point.x) && !isNaN(point.y));
            let hiddenStatus = false;
            if (data.length > 1 && data[0].x === '0') {
                hiddenStatus = true;
            }
            const eau = this.lecteurFichierCalibration.recupererTraceurEau();
            let dataEau = [];
            dataEau.push({
                x: eau.getDataParNom('L' + traceur.lampePrincipale + '-1'),
                y: eau.getDataParNom('L' + idData + '-1')
            });
            datasets.push({
                label: eau.nom,
                data: dataEau,
                borderColor: 'rgb(86,135,255)',
                borderWidth: 2,
                fill: false,
                hidden: false,
                showLine: false,
                pointStyle: 'cross'
            });
            datasets.push({
                label: 'L' + idData,
                data: data,
                borderColor: Graphiques.getRandomColor(),
                borderWidth: 2,
                fill: false,
                hidden: hiddenStatus,
                showLine: false,
                pointStyle: 'cross'
            });
        }

        // Nettoyage des labels si besoin
        for (let i = 0; i < datasets.length; i++) {
            if (datasets[i].data.length > 1) {
                labels = labels.filter(label => label !== 0);
                labels.unshift(0);
                break;
            }
        }

        if (document.getElementById('graphiqueTraceur')) {
            document.getElementById('graphiqueTraceur').remove();
        }
        const canvas = document.createElement('canvas');
        canvas.id = 'graphiqueTraceur';
        canvas.style.display = 'block';
        document.querySelector('.donnees').appendChild(canvas);
        const ctx = document.getElementById('graphiqueTraceur').getContext('2d');
        new window.Chart(ctx, {
            type: 'line',
            data: {
                labels: labels.map(String),
                datasets: datasets
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: labelX
                        }
                    },
                    y: {
                        type: 'linear',
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: labelY
                        }
                    }
                },
                plugins: {
                    zoom: {
                        pan: {
                            enabled: true,
                            mode: 'xy',
                            onPan: ({chart}) => {
                                const scales = chart.scales;
                                if (scales['x'].min < 0) {
                                    scales['x'].min = 0;
                                    chart.update();
                                }
                                if (scales['y'].min < 0) {
                                    scales['y'].min = 0;
                                    chart.update();
                                }
                            }
                        },
                        zoom: {
                            wheel: {enabled: true},
                            pinch: {enabled: true},
                            mode: 'xy',
                            onZoom: ({chart}) => {
                                const scales = chart.scales;
                                if (scales['x'].min < 0) {
                                    scales['x'].min = 0;
                                    chart.update();
                                }
                                if (scales['y'].min < 0) {
                                    scales['y'].min = 0;
                                    chart.update();
                                }
                            }
                        }
                    },
                },
                elements: {
                    point: {radius: 10}
                }
            }
        });
    }
}

export default GraphiqueCalibration;

