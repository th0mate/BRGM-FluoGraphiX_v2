/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 * Gère la conversion d'un traceur en concentration
 */
import {arrondirA2Decimales} from "@/assets/js/Common/utils.js";
import {Calculs} from "@/assets/js/Objects/Calcul.js";
import Session from "@/assets/js/Session/Session.js";
import GestionnaireCourbesCalibration from "@/assets/js/Calibration/gestionCalculsCourbesCalibration.js";


/**
 * =======================================================================================================================
 * Classe de conversion d'un traceur en concentration
 * ======================================================================================================================
 */
export class ConvertirTraceurConcentration {
    constructor(controlleur) {
        this.controlleur = controlleur;
        this.gestionnaireCalculsCourbes = new GestionnaireCourbesCalibration()
    }


    /**
     * Convertit un traceur en concentration et ajoute la courbe au graphique
     * @param {Object} traceur - Traceur à convertir
     */
    convertir(traceur) {
        if (!traceur) return;
        const eau = this.controlleur.traceurs.find(t => t.unite === '');
        const resultat = this.gestionnaireCalculsCourbes.effectuerCalculsCourbes(traceur.lampePrincipale, traceur);
        const calcul = new Calculs(`${traceur.nom}: Coefficients mV->${traceur.unite}`);
        calcul.ajouterParametreCalcul('Coefficients', resultat);
        Session.getInstance().calculs = Session.getInstance().calculs.filter(c => c.nom !== calcul.equation);
        Session.getInstance().calculs.push(calcul);

        const data = {
            label: `${traceur.nom}_${traceur.unite}`,
            data: [],
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderColor: this.controlleur.getRandomColor(),
            borderWidth: 2,
            pointRadius: 0
        };

        let contenu = [];
        let lignes = this.controlleur.lecteur.lignes;
        let colonnes = lignes[2].split(';').map(col => col.replace(/\r|\n/g, ''));
        let indexLampe = colonnes.indexOf(`L${traceur.lampePrincipale}`);
        if (indexLampe === -1) return;

        for (let i = 3; i < lignes.length - 1; i++) {
            const cols = lignes[i].split(';');
            if (cols[indexLampe] !== '') {
                contenu.push([
                    cols[0] + '-' + cols[1],
                    parseFloat(cols[indexLampe].replace(/\r|\n/g, ''))
                ]);
            }
        }

        let header = lignes[2].replace(/\r|\n/g, '').split(';');
        lignes = this.controlleur.supprimerColonneParEnTete(`${traceur.nom}`, lignes);
        header = header.filter(colonne => colonne !== `${traceur.nom}`);
        header.push(`${traceur.nom}_${traceur.unite}`);
        lignes[2] = header.join(';');

        for (let i = 0; i < contenu.length; i++) {
            const timestamp = this.controlleur.DateTime.fromFormat(contenu[i][0], 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'}).toMillis();
            const mVValue = contenu[i][1];
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
                    data.data.push({x: timestamp, y: concentration});
                    lignes[i + 3] = lignes[i + 3].replace(/\r|\n/g, '');
                    lignes[i + 3] += `;${arrondirA2Decimales(concentration)}`;
                } else {
                    data.data.push({x: timestamp, y: NaN});
                    lignes[i + 3] = lignes[i + 3].replace(/\r|\n/g, '');
                    lignes[i + 3] += `;NaN`;
                }
            }
        }

        this.controlleur.contenuFichierMesures = lignes.join('\n');
        const chart = this.controlleur.getChartInstance();
        if (chart) {
            chart.data.datasets = chart.data.datasets.filter(dataset => dataset.label !== `${traceur.nom}_${traceur.unite}`);
            chart.data.datasets.push(data);
            chart.update();
        }
    }
}
