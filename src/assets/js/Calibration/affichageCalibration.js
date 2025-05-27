/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 */


/**
 * Affiche dans une div un tableau contenant les données d'un traceur : 4 lignes de L1 à L4, et plusieurs colonnes pour tous les Y de LX-Y
 * @param traceur le traceur à partir duquel les données doivent être affichées
 */
function afficherTableauTraceur(traceur) {

    if (document.querySelector('.tableauTraceur')) {
        document.querySelector('.tableauTraceur').remove();
    }

    const tableau = document.createElement('table');
    tableau.classList.add('tableauTraceur');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const tr = document.createElement('tr');
    const th = document.createElement('th');
    th.textContent = traceur.nom;
    tr.appendChild(th);

    const eau = recupererTraceurEau();
    const th1 = document.createElement('th');
    th1.textContent = eau.nom;
    tr.appendChild(th1);

    /**
     * Les colonnes
     */
    let echellesTableau = [];
    for (let i = 0; i < traceur.echelles.length; i++) {
        echellesTableau.push(traceur.echelles[i]);
    }

    echellesTableau.sort((a, b) => a - b);
    const nbColonnes = traceur.data.size / 4;
    for (let i = 0; i < nbColonnes; i++) {
        const th = document.createElement('th');
        th.textContent = echellesTableau[i] + traceur.unite;
        tr.appendChild(th);
    }

    thead.appendChild(tr);
    tableau.appendChild(thead);

    let data = [];
    for (let i = 1; i <= 4; i++) {
        let rowData = [];
        for (let j = 1; j <= nbColonnes; j++) {
            rowData.push({value: traceur.getDataParNom('L' + i + '-' + j), index: j});
        }
        data.push(rowData);
    }

    let transposedData = data[0].map((_, i) => data.map(row => row[i]));

    transposedData.sort((a, b) => a[0].value - b[0].value);

    let sortedData = transposedData[0].map((_, i) => transposedData.map(row => row[i]));

    for (let i = 0; i < 4; i++) {
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.textContent = 'L' + (i + 1);
        tr.appendChild(th);

        for (let j = 0; j < nbColonnes + 1; j++) {
            const td = document.createElement('td');
            if (j === 0) {
                td.textContent = eau.getDataParNom('L' + (i + 1) + '-' + 1);
            } else {
                td.textContent = sortedData[i][j - 1].value;
            }
            tr.appendChild(td);
        }

        tbody.appendChild(tr);
    }

    document.querySelector('.descriptionConcentration').innerHTML = `<h2>Données de l'appareil <span>${numeroFluorimetre}</span> du <span>${traceur.dateMesure}</span> :</h2>`;
    tableau.appendChild(tbody);
    tableau.insertAdjacentHTML('afterbegin', `<caption>Signal en mV du traceur ${traceur.nom}</caption>`);
    document.querySelector('.donnees').appendChild(tableau);
    document.querySelector('.lesBoutons').insertAdjacentHTML('beforeend', '<div class="bouton boutonClair boutonDlData" onclick="telechargerFichierCSV()">TÉLÉCHARGER LES DONNÉES</div>');
}


/**
 * Affiche les détails d'un élément du bandeau lorsque l'utilisateur le survole
 */
function setEventListeneresBandeau() {
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
 * Affiche les détails d'un élément du bandeau lorsque l'utilisateur le survole
 */
function setEventListeneresBandeauCalibration() {
    const tooltip = document.getElementById('tooltip');

    document.querySelectorAll('.boutonBandeauCalibration').forEach(element => {
        element.addEventListener('mouseover', (event) => {
            tooltip.textContent = element.querySelector('span').textContent;
            tooltip.style.display = 'block';
        });

        element.addEventListener('mousemove', (event) => {
            if (event && event.pageX !== undefined && event.pageY !== undefined) {
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
 * Affiche le panneau d'équation de calibration
 */
const afficherEquation = () => {
    document.querySelector('.equationPannel')?.style.setProperty('right', '0');
};


/**
 * Ferme le panneau d'équation de calibration
 */
const fermerEquation = () => {
    document.querySelector('.equationPannel')?.style.setProperty('right', '-350px');
};


/**
 * Réinitialise le zoom du graphique comme il était d'origine
 */
const reinitialiserZoomGraphiqueConcentrations = () => {
    const canvas = document.getElementById('graphiqueTraceur');
    const existingChart = Chart.getChart(canvas);
    if (existingChart) {
        existingChart.resetZoom();
        afficherMessageFlash('Zoom réinitialisé.', 'info');
    }
};
