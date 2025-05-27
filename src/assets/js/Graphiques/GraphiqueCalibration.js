import Graphiques from './Graphiques';

class GraphiqueCalibration extends Graphiques {


    /**
     * Affiche un graphique pour un traceur donné de ses LX en fonction de la valeur des signaux - Partie Calibration
     * @param traceur le traceur à afficher
     * @param idData l'id du traceur
     */
    afficherGraphique(traceur, idData) {
        let labels = traceur.echelles;
        let datasets = [];
        let maxDataLength = 0;
        let maxDataIndex = 0;
        let labelX = '';
        let labelY = '';


        let nbValeurs = 0;
        for (let i = 0; i < labels.length; i++) {
            const value = traceur.getDataParNom('L' + idData + '-' + (i + 1));
            if (value !== null && value !== 'NaN' && !isNaN(value)) {
                nbValeurs++;
            }
        }


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


                if (data.length > maxDataLength) {
                    maxDataLength = data.length;
                    maxDataIndex = datasets.length;
                }

                let hiddenStatus = false;
                if (data.length > 1 && data[0].x === '0') {
                    hiddenStatus = true;
                }

                if (i === idData) {
                    const eau = recupererTraceurEau();
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
                        borderColor: getRandomColor(),
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

            const eau = recupererTraceurEau();
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
                borderColor: getRandomColor(),
                borderWidth: 2,
                fill: false,
                hidden: hiddenStatus,
                showLine: false,
                pointStyle: 'cross'
            });

        }


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
        new Chart(ctx, {
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
                            onPan: function ({chart}) {
                                const scales = chart.scales;
                                if (scales['x'].min < 0 || scales['y'].min < 0) {
                                    return false;
                                }
                            }
                        },
                        zoom: {
                            wheel: {
                                enabled: true,
                            },
                            pinch: {
                                enabled: true
                            },
                            mode: 'xy',
                            onZoom: function ({chart}) {
                                const scales = chart.scales;
                                if (scales['x'].min < 0 || scales['y'].min < 0) {
                                    return false;
                                }
                            }
                        }
                    },
                },
                elements: {
                    point: {
                        radius: 10
                    }
                }
            }
        });
    }


    /**
     * Affiche les détails d'un élément du bandeau lorsque l'utilisateur le survole
     */
    setEventListeneresBandeau() {
        const tooltip = document.getElementById('tooltip');

        document.querySelectorAll('.elementBandeau').forEach(element => {
            element.addEventListener('mouseover', (event) => {
                if (document.querySelector('.bandeauGraphiques').style.width === '55px') {
                    tooltip.textContent = element.querySelector('span').textContent;
                    tooltip.style.display = 'block';
                }
            });

            element.addEventListener('mousemove', (event) => {
                if (event && event.pageX !== undefined && event.pageY !== undefined && document.querySelector('.bandeauGraphiques').style.width === '55px') {
                    tooltip.style.left = `${event.pageX + 10}px`;
                    tooltip.style.top = `${event.pageY + 10}px`;
                }
            });

            element.addEventListener('mouseout', () => {
                tooltip.style.display = 'none';
            });
        });
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