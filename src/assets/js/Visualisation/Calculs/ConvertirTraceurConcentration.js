/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 * Gère la conversion d'un traceur en concentration
 */
import {arrondirA2Decimales} from "@/assets/js/Common/utils.js";
import {BaseCalcul} from "@/assets/js/Visualisation/Calculs/BaseCalcul.js";
import GestionnaireCourbesCalibration from "@/assets/js/Calibration/gestionCalculsCourbesCalibration.js";
import {DateTime} from "luxon";


/**
 * =======================================================================================================================
 * Classe de conversion d'un traceur en concentration
 * ======================================================================================================================
 */
export class ConvertirTraceurConcentration extends BaseCalcul {
    constructor(controlleur) {
        super(controlleur);
        this.gestionnaireCalculsCourbes = new GestionnaireCourbesCalibration()
    }


    /**
     * Convertit un traceur en concentration et ajoute la courbe au graphique
     * @param {Object} traceur - Traceur à convertir
     */
    convertir(traceur) {
        return this.executerAvecChargement(this._effectuerConversion, traceur);
    }


    /**
     * Méthode interne qui effectue réellement la conversion en concentration
     * @private
     * @param {Object} traceur - Traceur à convertir
     */
    _effectuerConversion(traceur) {
        if (!traceur) return;
        const eau = this.getTraceurParUnite('');
        const resultat = this.gestionnaireCalculsCourbes.effectuerCalculsCourbes(traceur.lampePrincipale, traceur);

        this.creerCalcul(`${traceur.nom}: Coefficients mV->${traceur.unite}`, { 'Coefficients': resultat });

        let contenu = [];
        let lignes = this.controlleur.copieContenuFichierMesure.split('\n');
        let colonnes = lignes[2].split(';').map(col => col.replace(/\r|\n/g, ''));

        const dataPoints = [];
        const concentrations = [];
        const dates = [];

        let sourceCourbe = null;
        let indexLampe = -1;

        // 1. Vérifier si la courbe Corr_nat existe
        const graphique = this.controlleur.getChartInstance();
        if (graphique && graphique.data.datasets.find(dataset => dataset.label === `L${traceur.lampePrincipale}Corr_nat`)) {
            sourceCourbe = 'Corr_nat';
            const dataset = graphique.data.datasets.find(dataset => dataset.label === `L${traceur.lampePrincipale}Corr_nat`);

            for (let j = 0; j < dataset.data.length; j++) {
                const timestamp = dataset.data[j].x;
                const mVValue = dataset.data[j].y;
                const timeDate = DateTime.fromMillis(timestamp, {zone: 'UTC'});
                const dateHeure = timeDate.toFormat('dd/MM/yy-HH:mm:ss');

                if (!isNaN(mVValue)) {
                    const eauValue = parseFloat(eau.getDataParNom('L' + traceur.lampePrincipale + '-1'));
                    if (!isNaN(eauValue) && mVValue > eauValue) {
                        const logValue = Math.log(mVValue - eauValue);
                        let concentration = NaN;

                        if (resultat[0].length === 3) {
                            const log2Value = logValue ** 2;
                            concentration = Math.exp(parseFloat(resultat[0][0]) + parseFloat(resultat[0][1]) * logValue + parseFloat(resultat[0][2]) * log2Value);
                        } else if (resultat[0].length === 2) {
                            concentration = Math.exp(parseFloat(resultat[0][0]) + parseFloat(resultat[0][1]) * logValue);
                        } else if (resultat[0].length === 1) {
                            concentration = parseFloat(resultat[0][0]) * mVValue;
                        }

                        dataPoints.push({x: timestamp, y: concentration});
                        concentrations.push(concentration);
                        dates.push(dateHeure);
                    } else {
                        dataPoints.push({x: timestamp, y: NaN});
                    }
                }
            }
        }
        // 2. Vérifier si la courbe Corr existe
        else if (graphique && graphique.data.datasets.find(dataset => dataset.label === `L${traceur.lampePrincipale}Corr`)) {
            sourceCourbe = 'Corr';
            const dataset = graphique.data.datasets.find(dataset => dataset.label === `L${traceur.lampePrincipale}Corr`);

            for (let j = 0; j < dataset.data.length; j++) {
                const timestamp = dataset.data[j].x;
                const mVValue = dataset.data[j].y;
                const timeDate = DateTime.fromMillis(timestamp, {zone: 'UTC'});
                const dateHeure = timeDate.toFormat('dd/MM/yy-HH:mm:ss');

                if (!isNaN(mVValue)) {
                    const eauValue = parseFloat(eau.getDataParNom('L' + traceur.lampePrincipale + '-1'));
                    if (!isNaN(eauValue) && mVValue > eauValue) {
                        const logValue = Math.log(mVValue - eauValue);
                        let concentration = NaN;

                        if (resultat[0].length === 3) {
                            const log2Value = logValue ** 2;
                            concentration = Math.exp(parseFloat(resultat[0][0]) + parseFloat(resultat[0][1]) * logValue + parseFloat(resultat[0][2]) * log2Value);
                        } else if (resultat[0].length === 2) {
                            concentration = Math.exp(parseFloat(resultat[0][0]) + parseFloat(resultat[0][1]) * logValue);
                        } else if (resultat[0].length === 1) {
                            concentration = parseFloat(resultat[0][0]) * mVValue;
                        }

                        dataPoints.push({x: timestamp, y: concentration});
                        concentrations.push(concentration);
                        dates.push(dateHeure);
                    } else {
                        dataPoints.push({x: timestamp, y: NaN});
                    }
                }
            }
        }
        // 3. Utiliser la courbe L + lampePrincipale par défaut
        else {
            sourceCourbe = 'Standard';
            indexLampe = colonnes.indexOf(`L${traceur.lampePrincipale}`);
            if (indexLampe === -1) return;

            for (let i = 3; i < lignes.length - 1; i++) {
                const cols = lignes[i].split(';');
                if (cols[indexLampe] !== '') {
                    const dateHeure = cols[0] + '-' + cols[1];
                    const timeDate = DateTime.fromFormat(dateHeure, 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'});
                    const timestamp = timeDate.toMillis();
                    const mVValue = parseFloat(cols[indexLampe].replace(/\r|\n/g, ''));

                    if (!isNaN(mVValue)) {
                        const eauValue = parseFloat(eau.getDataParNom('L' + traceur.lampePrincipale + '-1'));
                        if (!isNaN(eauValue) && mVValue > eauValue) {
                            const logValue = Math.log(mVValue - eauValue);
                            let concentration = NaN;

                            if (resultat[0].length === 3) {
                                const log2Value = logValue ** 2;
                                concentration = Math.exp(parseFloat(resultat[0][0]) + parseFloat(resultat[0][1]) * logValue + parseFloat(resultat[0][2]) * log2Value);
                            } else if (resultat[0].length === 2) {
                                concentration = Math.exp(parseFloat(resultat[0][0]) + parseFloat(resultat[0][1]) * logValue);
                            } else if (resultat[0].length === 1) {
                                concentration = parseFloat(resultat[0][0]) * mVValue;
                            }

                            dataPoints.push({x: timestamp, y: concentration});
                            concentrations.push(concentration);
                            dates.push(dateHeure);
                        } else {
                            dataPoints.push({x: timestamp, y: NaN});
                        }
                    }
                }
            }
        }

        this.mettreAJourGraphique(`${traceur.nom}_${traceur.unite}`, dataPoints);

        // Ajout des résultats au contenu du fichier
        if (concentrations.length > 0 && dates.length > 0) {
            let header = lignes[2].replace(/\r|\n/g, '').split(';');
            lignes = this.controlleur.supprimerColonneParEnTete(`${traceur.nom}_${traceur.unite}`, lignes);
            header = header.filter(colonne => colonne !== `${traceur.nom}_${traceur.unite}`);
            header.push(`${traceur.nom}_${traceur.unite}`);
            lignes[2] = header.join(';');

            for (let i = 0; i < dates.length; i++) {
                for (let j = 3; j < lignes.length; j++) {
                    const cols = lignes[j].split(';');
                    const lineDate = cols[0] + '-' + cols[1];
                    if (lineDate === dates[i]) {
                        lignes[j] = lignes[j].replace(/\r|\n/g, '') + `;${arrondirA2Decimales(concentrations[i])}`;
                        break;
                    }
                }
            }

            this.controlleur.copieContenuFichierMesure = lignes.join('\n');
        }
    }
}
