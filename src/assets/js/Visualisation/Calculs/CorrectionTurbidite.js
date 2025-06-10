/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 * Gère la correction de la turbidité sur les données de visualisation
 */
import {arrondirA2Decimales} from "@/assets/js/Common/utils.js";
import Session from "@/assets/js/Session/Session.js";
import {Calculs} from "@/assets/js/Objects/Calcul.js";
import GestionnaireCourbesCalibration from "@/assets/js/Calibration/gestionCalculsCourbesCalibration.js";
import {DateTime} from "luxon";


/**
 * =======================================================================================================================
 * Classe de correction de turbidité
 * ======================================================================================================================
 */
export class CorrectionTurbidite {
    constructor(controlleur) {
        this.controlleur = controlleur;
        this.gestionnaireCalculs = new GestionnaireCourbesCalibration();
    }


    /**
     * Applique la correction de turbidité sur les lampes sélectionnées
     * @param {Array} lampesACorriger - IDs des lampes à corriger (ex: [1,2])
     * @param {number} niveauCorrection - niveau de correction (0 à 2)
     * @param {Array} traceurs - liste des traceurs (optionnel, sinon this.controlleur.traceurs)
     */
    appliquerCorrection(lampesACorriger, niveauCorrection, traceurs = null) {
        const traceursUtilises = traceurs;
        const eau = traceursUtilises.find(traceur => traceur.unite === '');
        const turbidite = traceursUtilises.find(traceur => traceur.unite && traceur.unite.toLowerCase() === 'ntu');
        if (!eau || !turbidite) return;

        lampesACorriger.forEach(idLampe => {

            const resultat = this.gestionnaireCalculs.effectuerCalculsCourbes(idLampe, turbidite);
            const calcul = new Calculs(`Correction de turbidité (L${idLampe})`);
            calcul.ajouterParametreCalcul('TS', niveauCorrection);
            Session.getInstance().calculs = Session.getInstance().calculs.filter(c => c.nom !== calcul.equation);
            Session.getInstance().calculs.push(calcul);

            const data = {
                label: `L${idLampe}Corr`,
                data: [],
                backgroundColor: 'rgba(0, 0, 0, 0)',
                borderColor: this.controlleur.graphiqueVisualisation.getRandomColor(),
                borderWidth: 2,
                pointRadius: 0
            };

            let lignes = this.controlleur.copieContenuFichierMesure.split('\n');
            let colonnes = lignes[2].split(';').map(col => col.replace(/\r|\n/g, ''));
            let indexLampe = colonnes.indexOf(`L${idLampe}`);
            let indexTurb = colonnes.indexOf('L4');
            if (indexLampe === -1 || indexTurb === -1) return;

            let contenu = [];
            for (let i = 3; i < lignes.length - 1; i++) {
                const cols = lignes[i].split(';');
                if (cols[indexLampe] !== '' && cols[indexTurb] !== '') {
                    contenu.push([
                        cols[0] + '-' + cols[1],
                        cols[indexLampe].replace(/\r|\n/g, ''),
                        cols[indexTurb].replace(/\r|\n/g, '')
                    ]);
                }
            }

            let colonneFinale = [];
            if (resultat[0].length === 3) {
                for (let i = 0; i < contenu.length; i++) {
                    if (contenu[i][2] <= eau.getDataParNom('L4-1')) {
                        colonneFinale.push(contenu[i][1]);
                    } else {
                        const log = Math.log(parseFloat(contenu[i][2]) - parseFloat(eau.getDataParNom('L4-1')));
                        const log2 = log ** 2;
                        const exp = Math.exp(parseFloat(resultat[0][0]) + parseFloat(resultat[0][1]) * log + parseFloat(resultat[0][2]) * log2);
                        const valeur = parseFloat(contenu[i][1]) - niveauCorrection * exp;
                        colonneFinale.push(valeur);
                    }
                }
            } else if (resultat[0].length === 2) {
                for (let i = 0; i < contenu.length; i++) {
                    if (contenu[i][2] <= eau.getDataParNom('L4-1')) {
                        colonneFinale.push(contenu[i][1]);
                    } else {
                        const log = Math.log(parseFloat(contenu[i][2]) - parseFloat(eau.getDataParNom('L4-1')));
                        const exp = Math.exp(parseFloat(resultat[0][0]) + parseFloat(resultat[0][1]) * log);
                        const valeur = parseFloat(contenu[i][1]) - niveauCorrection * exp;
                        colonneFinale.push(valeur);
                    }
                }
            } else {
                for (let i = 0; i < contenu.length; i++) {
                    if (contenu[i][2] <= eau.getDataParNom('L4-1')) {
                        colonneFinale.push(contenu[i][1]);
                    } else {
                        const valeur = parseFloat(contenu[i][1]) - niveauCorrection * parseFloat(resultat[0][0]);
                        colonneFinale.push(valeur);
                    }
                }
            }

            // Mise à jour du header et des lignes
            let header = lignes[2].replace(/\r|\n/g, '').split(';');
            lignes = this.controlleur.supprimerColonneParEnTete(`L${idLampe}Corr`, lignes);
            header = header.filter(colonne => colonne !== `L${idLampe}Corr`);
            header.push(`L${idLampe}Corr`);
            lignes[2] = header.join(';');

            for (let i = 0; i < contenu.length; i++) {
                const timeDate = DateTime.fromFormat(contenu[i][0], 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'});
                const timestamp = timeDate.toMillis();
                lignes[i + 3] = lignes[i + 3].replace(/\r|\n/g, '');
                lignes[i + 3] += `;${arrondirA2Decimales(colonneFinale[i])}`;
                data.data.push({x: timestamp, y: colonneFinale[i]});
            }

            this.controlleur.copieContenuFichierMesure = lignes.join('\n');
            const chart = this.controlleur.getChartInstance();
            if (chart) {
                chart.data.datasets = chart.data.datasets.filter(dataset => dataset.label !== `L${idLampe}Corr`);
                chart.data.datasets.push(data);
                chart.update();
            }
        });
    }
}
