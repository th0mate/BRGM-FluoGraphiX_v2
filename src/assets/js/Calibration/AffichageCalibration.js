/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 */
import { arrondir8Chiffres, ln } from '@/assets/js/Calibration/utils.js';
import {afficherMessageFlash} from '@/assets/js/Common/utils.js'
import Session from "@/assets/js/Session/Session.js";


/**
 * =====================================================================================================================
 * Classe pour l'affichage des calibrations
 * ====================================================================================================================
 */
export class AffichageCalibration {


    /**
     * Affiche l'équation d'une courbe de calibration
     * @param {Object} equation - L'équation à afficher
     */
    static afficherEquationDroite(equation) {
        if (document.querySelector('.equation')) {
            document.querySelector('.equation').innerHTML = `${equation.toStringEquation()}`;
            document.querySelector('.equation').innerHTML += `${equation.toStringValeursParametres()}`;
        }
    }


    /**
     * Réinitialise le zoom du graphique
     */
    static reinitialiserZoomGraphique() {
        const canvas = document.getElementById('graphiqueTraceur');
        const existingChart = Chart.getChart(canvas);
        if (existingChart) {
            existingChart.resetZoom();
            afficherMessageFlash("Information", "Le zoom du graphique a été réinitialisé.", 'info');
        }
    }
}


/**
 * =====================================================================================================================
 * Classe pour l'affichage des courbes de concentration
 * ====================================================================================================================
 */
class AffichageConcentration {


    /**
     * Affiche la courbe de concentration avec 3+ valeurs
     * @param {Array} resultat - Résultats des calculs
     * @param {number} idLampe - ID de la lampe
     * @param {Object} traceur - Le traceur
     */
    static afficherCourbeDepuis3Valeurs(resultat, idLampe, traceur) {
        const data = {
            label: 'Calibration',
            data: [],
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderColor: 'rgb(230,65,160)',
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4
        };

        const constante = arrondir8Chiffres(resultat[0][0]);
        const degre1 = arrondir8Chiffres(resultat[0][1]);
        const degre2 = resultat[0].length === 3 ? arrondir8Chiffres(resultat[0][2]) : 0;

        const eau = Session.getInstance().traceurs.find(traceur => traceur.unite === '');
        const eauValeur = eau.getDataParNom('L' + idLampe + '-1');

        let colonne0 = [];
        let colonne1 = [];
        let colonne2 = [];
        const max = this.getValeurSup20Pourcents(traceur, idLampe);

        for (let i = eauValeur + 0.01; i <= max; i += 2) {
            colonne0.push(i);
            colonne1.push(ln(i - eauValeur));
        }

        for (let i = 0; i < colonne1.length; i++) {
            colonne2.push(Math.exp(constante + degre1 * colonne1[i] + degre2 * colonne1[i] ** 2));
        }

        for (let i = 0; i < colonne1.length; i++) {
            data.data.push({x: colonne0[i], y: colonne2[i]});
        }

        const canvas = document.getElementById('graphiqueTraceur');
        const existingChart = Chart.getChart(canvas);

        if (resultat.length > 1) {
            this.ajouterIntervalesConfiance(colonne0, colonne1, resultat, constante, degre1, degre2, existingChart, data);
        } else {
            if (existingChart && !existingChart.data.datasets.find(dataset => dataset.label === data.label)) {
                existingChart.data.datasets.push(data);
                existingChart.update();
            }
        }
    }


    /**
     * Ajoute les intervalles de confiance au graphique
     * @param {Array} colonne0 - Colonne des valeurs X
     * @param {Array} colonne1 - Colonne des valeurs transformées
     * @param {Array} resultat - Résultats des calculs
     * @param {number} constante - Constante de l'équation
     * @param {number} degre1 - Coefficient de degré 1
     * @param {number} degre2 - Coefficient de degré 2
     * @param {Object} existingChart - Le graphique existant
     * @param {Object} data - Les données du graphique principal
     */
    static ajouterIntervalesConfiance(colonne0, colonne1, resultat, constante, degre1, degre2, existingChart, data) {
        let colonne95Plus = [];
        let colonne95Moins = [];

        const data2 = {
            label: '95%',
            data: [],
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderColor: 'black',
            borderWidth: 1,
            pointRadius: 0,
            borderDash: [5, 5],
            tension: 0.4
        };

        const data3 = {
            label: '-95%',
            data: [],
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderColor: 'black',
            borderWidth: 1,
            pointRadius: 0,
            borderDash: [5, 5],
            tension: 0.4
        };

        for (let i = 0; i < colonne1.length; i++) {
            colonne95Plus.push(Math.exp(resultat[1] + constante + degre1 * colonne1[i] + degre2 * colonne1[i] ** 2));
            colonne95Moins.push(Math.exp(-resultat[1] + constante + degre1 * colonne1[i] + degre2 * colonne1[i] ** 2));
        }

        for (let i = 0; i < colonne1.length; i++) {
            data2.data.push({x: colonne0[i], y: colonne95Plus[i]});
            data3.data.push({x: colonne0[i], y: colonne95Moins[i]});
        }

        if (existingChart && !existingChart.data.datasets.find(dataset => dataset.label === data.label)) {
            existingChart.data.datasets.push(data);
            existingChart.data.datasets.push(data2);
            existingChart.data.datasets.push(data3);
            existingChart.update();
        }
    }


    /**
     * Affiche la courbe de concentration avec 1 valeur
     * @param {Array} resultat - Résultats des calculs
     * @param {number} idLampe - ID de la lampe
     * @param {Object} traceur - Le traceur
     */
    static afficherCourbeDepuis1Valeur(resultat, idLampe, traceur) {
        const data = {
            label: 'Calibration',
            data: [],
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderColor: 'rgb(230,65,160)',
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4
        };

        const a = resultat[0];
        const eau = Session.getInstance().traceurs.find(traceur => traceur.unite === '');
        const eauValeur = eau.getDataParNom('L' + idLampe + '-1');

        let colonne0 = [];
        let colonne1 = [];
        const max = this.getValeurSup20Pourcents(traceur, idLampe);

        for (let i = eauValeur + 0.01; i <= max; i += 2) {
            colonne0.push(i);
            colonne1.push(a * (i - eauValeur));
        }

        for (let i = 0; i < colonne1.length; i++) {
            data.data.push({x: colonne0[i], y: colonne1[i]});
        }

        const canvas = document.getElementById('graphiqueTraceur');
        const existingChart = Chart.getChart(canvas);

        if (existingChart && !existingChart.data.datasets.find(dataset => dataset.label === data.label)) {
            existingChart.data.datasets.push(data);
            existingChart.update();
        }
    }


    /**
     * Récupère la valeur maximale d'un traceur pour une lampe donnée avec 20% de marge
     * @param {object} traceur - L'objet traceur
     * @param {number} idLampe - L'ID de la lampe
     * @return {number} La valeur maximale avec la marge
     */
    static getValeurSup20Pourcents(traceur, idLampe) {
        let max = 0;
        for (let i = 1; i <= traceur.echelles.length; i++) {
            if (!isNaN(traceur.getDataParNom('L' + idLampe + '-' + i)) && traceur.getDataParNom('L' + idLampe + '-' + i) > max) {
                max = traceur.getDataParNom('L' + idLampe + '-' + i);
            }
        }
        return max * 1.2;
    }
}


/**
 * =====================================================================================================================
 * Classe pour l'affichage des courbes parasites
 * =====================================================================================================================
 */
class AffichageParasites {


    /**
     * Affiche la courbe des parasites avec 3 valeurs (degré 2)
     * @param {Array} resultat - Résultats des calculs
     * @param {number} idLampe - ID de la lampe
     * @param {Object} traceur - Le traceur
     * @return {boolean} Indique si les données sont potentiellement corrompues
     */
    static afficherCourbeParasites3Valeurs(resultat, idLampe, traceur) {
        const data = {
            label: 'Signaux parasites',
            data: [],
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderColor: 'rgb(230,65,160)',
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4
        };

        const constante = arrondir8Chiffres(resultat[0][0]);
        const degre1 = arrondir8Chiffres(resultat[0][1]);
        const degre2 = arrondir8Chiffres(resultat[0][2]);
        let donneesCorrompues = false;

        const eau = Session.getInstance().traceurs.find(traceur => traceur.unite === '');
        const maxTraceur = this.getMaxTraceur(traceur);
        const valeurIni = Math.log(eau.getDataParNom(`L${traceur.lampePrincipale}-1`) + 0.01);
        const valeurFinale = Math.log(maxTraceur * 1.2);
        const pas = (valeurFinale - valeurIni) / (100 - 1);

        const { colonne1, colonne2, donneesPotentiellementCorrompues } = this.calculerPointsCourbeParasites(
            valeurIni, pas, eau, idLampe, traceur, constante, degre1, degre2
        );

        donneesCorrompues = donneesPotentiellementCorrompues;

        for (let i = 0; i < colonne1.length; i++) {
            data.data.push({x: colonne1[i], y: colonne2[i]});
        }

        const canvas = document.getElementById('graphiqueTraceur');
        const existingChart = Chart.getChart(canvas);

        if (resultat.length > 1) {
            this.ajouterIntervalesConfianceParasites(colonne1, resultat, constante, degre1, degre2, eau, idLampe, traceur, existingChart, data);
        } else {
            if (existingChart && !existingChart.data.datasets.find(dataset => dataset.label === data.label)) {
                existingChart.data.datasets.push(data);
                existingChart.update();
            }
        }

        return donneesCorrompues;
    }


    /**
     * Calcule les points pour la courbe des parasites
     * @param {number} valeurIni - Valeur initiale
     * @param {number} pas - Pas entre les points
     * @param {Object} eau - Données de l'eau
     * @param {number} idLampe - ID de la lampe
     * @param {Object} traceur - Le traceur
     * @param {number} constante - Constante de l'équation
     * @param {number} degre1 - Coefficient de degré 1
     * @param {number} degre2 - Coefficient de degré 2
     * @return {Object} Les colonnes calculées et l'état des données
     */
    static calculerPointsCourbeParasites(valeurIni, pas, eau, idLampe, traceur, constante, degre1, degre2) {
        let colonne0 = [];
        let colonne1 = [];
        let colonne2 = [];
        let donneesPotentiellementCorrompues = false;

        colonne0.push(valeurIni);
        colonne1.push(Math.exp(valeurIni));
        colonne2.push(eau.getDataParNom('L' + idLampe + '-1') + Math.exp(constante + degre1 * Math.log(colonne1[0] - eau.getDataParNom('L' + traceur.lampePrincipale + '-1')) ** 1 + degre2 * Math.log(colonne1[0] - eau.getDataParNom('L' + traceur.lampePrincipale + '-1')) ** 2));

        let tempX = colonne1[0];
        let tempY = colonne2[0];

        for (let i = 1; i < 100; i++) {
            colonne0.push(colonne0[i - 1] + pas);
            colonne1.push(Math.exp(colonne0[i]));
            if (colonne1[i] <= eau.getDataParNom('L' + traceur.lampePrincipale + '-1')) {
                colonne2.push(0);
            } else {
                colonne2.push(eau.getDataParNom('L' + idLampe + '-1') + Math.exp(constante + degre1 * Math.log(colonne1[i] - eau.getDataParNom('L' + traceur.lampePrincipale + '-1')) ** 1 + degre2 * Math.log(colonne1[i] - eau.getDataParNom('L' + traceur.lampePrincipale + '-1')) ** 2));
            }

            if (colonne1[i] < tempX || colonne2[i] < tempY) {
                donneesPotentiellementCorrompues = true;
            }

            tempX = colonne1[i];
            tempY = colonne2[i];
        }

        return { colonne1, colonne2, donneesPotentiellementCorrompues };
    }


    /**
     * Ajoute les intervalles de confiance au graphique des parasites
     * @param {Array} colonne1 - Colonne des valeurs X
     * @param {Array} resultat - Résultats des calculs
     * @param {number} constante - Constante de l'équation
     * @param {number} degre1 - Coefficient de degré 1
     * @param {number} degre2 - Coefficient de degré 2
     * @param {Object} eau - Données de l'eau
     * @param {number} idLampe - ID de la lampe
     * @param {Object} traceur - Le traceur
     * @param {Object} existingChart - Le graphique existant
     * @param {Object} data - Les données du graphique principal
     */
    static ajouterIntervalesConfianceParasites(colonne1, resultat, constante, degre1, degre2, eau, idLampe, traceur, existingChart, data) {
        let colonne95Plus = [];
        let colonne95Moins = [];

        const data2 = {
            label: '95%',
            data: [],
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderColor: 'black',
            borderWidth: 1,
            pointRadius: 0,
            borderDash: [5, 5],
            tension: 0.4
        };

        const data3 = {
            label: '-95%',
            data: [],
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderColor: 'black',
            borderWidth: 1,
            pointRadius: 0,
            borderDash: [5, 5],
            tension: 0.4
        };

        for (let i = 0; i < colonne1.length; i++) {
            colonne95Plus.push(eau.getDataParNom('L' + idLampe + '-1') + Math.exp(resultat[1] + constante + degre1 * Math.log(colonne1[i] - eau.getDataParNom('L' + traceur.lampePrincipale + '-1')) ** 1 + degre2 * Math.log(colonne1[i] - eau.getDataParNom('L' + traceur.lampePrincipale + '-1')) ** 2));
            colonne95Moins.push(eau.getDataParNom('L' + idLampe + '-1') + Math.exp(-resultat[1] + constante + degre1 * Math.log(colonne1[i] - eau.getDataParNom('L' + traceur.lampePrincipale + '-1')) ** 1 + degre2 * Math.log(colonne1[i] - eau.getDataParNom('L' + traceur.lampePrincipale + '-1')) ** 2));
        }

        for (let i = 0; i < colonne1.length; i++) {
            data2.data.push({x: colonne1[i], y: colonne95Plus[i]});
            data3.data.push({x: colonne1[i], y: colonne95Moins[i]});
        }

        if (existingChart && !existingChart.data.datasets.find(dataset => dataset.label === data.label)) {
            existingChart.data.datasets.push(data);
            existingChart.data.datasets.push(data2);
            existingChart.data.datasets.push(data3);
            existingChart.update();
        }
    }


    /**
     * Affiche la courbe des parasites avec 2 valeurs (constante et degré 1)
     * @param {Array} resultat - Résultats des calculs
     * @param {number} idLampe - ID de la lampe
     * @param {Object} traceur - Le traceur
     */
    static afficherCourbeParasites2Valeurs(resultat, idLampe, traceur) {
        const data = {
            label: 'Signaux parasites',
            data: [],
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderColor: 'rgb(230,65,160)',
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4
        };

        const degre1 = resultat[0][0];
        const constante = resultat[0][1];

        const eau = Session.getInstance().traceurs.find(traceur => traceur.unite === '');
        const maxTraceur = this.getMaxTraceur(traceur);
        const valeurIni = Math.log(eau.getDataParNom(`L${traceur.lampePrincipale}-1`) + 0.01);
        const valeurFinale = Math.log(maxTraceur * 1.2);
        const pas = (valeurFinale - valeurIni) / (100 - 1);

        let colonne0 = [];
        let colonne1 = [];
        let colonne2 = [];

        colonne0.push(valeurIni);
        colonne1.push(Math.exp(valeurIni));
        colonne2.push(eau.getDataParNom('L' + idLampe + '-1') + Math.exp(constante + degre1 * Math.log(colonne1[0] - eau.getDataParNom('L' + traceur.lampePrincipale + '-1'))));

        for (let i = 1; i < 100; i++) {
            colonne0.push(colonne0[i - 1] + pas);
            colonne1.push(Math.exp(colonne0[i]));
            if (colonne1[i] <= eau.getDataParNom('L' + traceur.lampePrincipale + '-1')) {
                colonne2.push(0);
            } else {
                colonne2.push(eau.getDataParNom('L' + idLampe + '-1') + Math.exp(constante + degre1 * Math.log(colonne1[i] - eau.getDataParNom('L' + traceur.lampePrincipale + '-1'))));
            }
        }

        for (let i = 0; i < colonne1.length; i++) {
            data.data.push({x: colonne1[i], y: colonne2[i]});
        }

        const canvas = document.getElementById('graphiqueTraceur');
        const existingChart = Chart.getChart(canvas);

        if (existingChart && !existingChart.data.datasets.find(dataset => dataset.label === data.label)) {
            existingChart.data.datasets.push(data);
            existingChart.update();
        }
    }


    /**
     * Affiche la courbe des parasites avec 1 valeur (droite passant par deux points)
     * @param {Array} resultat - Résultats des calculs
     * @param {number} idLampe - ID de la lampe
     * @param {Object} traceur - Le traceur
     * @return {boolean} Indique si les données sont potentiellement corrompues
     */
    static afficherCourbeParasites1Valeur(resultat, idLampe, traceur) {
        const data = {
            label: 'Signaux parasites',
            data: [],
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderColor: 'rgb(230,65,160)',
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4
        };

        const eau = Session.getInstance().traceurs.find(traceur => traceur.unite === '');
        const eauValeurLampePrincipale = eau.getDataParNom('L' + traceur.lampePrincipale + '-1');
        const eauValeurLampe = eau.getDataParNom('L' + idLampe + '-1');
        let donneesCorrompues = false;

        let index = 0;

        for (let i = 1; i <= traceur.echelles.length; i++) {
            if (!isNaN(traceur.getDataParNom('L' + idLampe + '-' + i))) {
                index = i;
                break;
            }
        }

        const pointX = traceur.getDataParNom('L' + traceur.lampePrincipale + '-' + index);

        const a = resultat[0][0];
        const b = eauValeurLampe - a * eauValeurLampePrincipale;

        const marge = pointX * 1.2;
        let tempX = eauValeurLampePrincipale;
        let tempY = a * eauValeurLampePrincipale + b;

        for (let x = eauValeurLampePrincipale; x <= marge; x += 2) {
            const y = a * x + b;

            if (x < tempX || y < tempY) {
                donneesCorrompues = true;
            }

            data.data.push({x: x, y: y});
            tempX = x;
            tempY = y;
        }

        const canvas = document.getElementById('graphiqueTraceur');
        const existingChart = Chart.getChart(canvas);

        if (existingChart && !existingChart.data.datasets.find(dataset => dataset.label === data.label)) {
            existingChart.data.datasets.push(data);
            existingChart.update();
        }

        return donneesCorrompues;
    }


    /**
     * Obtient la valeur maximale d'un traceur pour sa lampe principale
     * @param {Object} traceur - Le traceur
     * @return {number} La valeur maximale
     */
    static getMaxTraceur(traceur) {
        let maxTraceur = 0;

        for (let i = 1; i <= traceur.echelles.length; i++) {
            if (!isNaN(traceur.getDataParNom('L' + traceur.lampePrincipale + '-' + i)) &&
                traceur.getDataParNom('L' + traceur.lampePrincipale + '-' + i) > maxTraceur) {
                maxTraceur = traceur.getDataParNom('L' + traceur.lampePrincipale + '-' + i);
            }
        }

        return maxTraceur;
    }
}

// Exporter toutes les classes dans un seul objet par défaut
export default {
    AffichageCalibration,
    AffichageConcentration,
    AffichageParasites
};

