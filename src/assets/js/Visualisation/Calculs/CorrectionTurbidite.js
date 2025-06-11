/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 * Gère la correction de la turbidité sur les données de visualisation
 */
import {arrondirA2Decimales} from "@/assets/js/Common/utils.js";
import {BaseCalcul} from "@/assets/js/Visualisation/Calculs/BaseCalcul.js";
import GestionnaireCourbesCalibration from "@/assets/js/Calibration/gestionCalculsCourbesCalibration.js";
import {DateTime} from "luxon";


/**
 * =======================================================================================================================
 * Classe de correction de turbidité
 * ======================================================================================================================
 */
export class CorrectionTurbidite extends BaseCalcul {
    constructor(controlleur) {
        super(controlleur);
        this.gestionnaireCalculs = new GestionnaireCourbesCalibration();
        this.cachedResults = {};
    }


    /**
     * Applique la correction de turbidité sur les lampes sélectionnées
     * @param {Array} lampesACorriger - IDs des lampes à corriger (ex: [1,2])
     * @param {number} niveauCorrection - niveau de correction (0 à 2)
     * @param {Array} traceurs - liste des traceurs (optionnel, sinon this.controlleur.traceurs)
     */
    appliquerCorrection(lampesACorriger, niveauCorrection, traceurs = null) {
        return this.executerAvecChargement(this._effectuerCorrection, lampesACorriger, niveauCorrection, traceurs);
    }


    /**
     * Méthode interne qui effectue réellement la correction de turbidité
     * @private
     * @param {Array} lampesACorriger - IDs des lampes à corriger (ex: [1,2])
     * @param {number} niveauCorrection - niveau de correction (0 à 2)
     * @param {Array} traceurs - liste des traceurs (optionnel, sinon this.controlleur.traceurs)
     */
    _effectuerCorrection(lampesACorriger, niveauCorrection, traceurs = null) {
        const traceursUtilises = traceurs;
        const eau = this.getTraceurParUnite('');
        const turbidite = traceursUtilises.find(traceur => traceur.unite && traceur.unite.toLowerCase() === 'ntu');
        if (!eau || !turbidite) return;

        const lignes = this.controlleur.copieContenuFichierMesure.split('\n');
        const colonnes = lignes[2].replace(/\r|\n/g, '').split(';');
        const indexTurb = colonnes.indexOf('L4');
        const eauValeurL4 = parseFloat(eau.getDataParNom('L4-1'));

        // Création d'un mapping des dates pour un accès rapide
        const dateMapping = {};
        for (let i = 3; i < lignes.length - 1; i++) {
            const cols = lignes[i].split(';');
            if (cols[0] && cols[1]) {
                const dateHeure = cols[0] + '-' + cols[1];
                dateMapping[dateHeure] = i;
            }
        }

        // Pré-calculs communs pour la turbidité (si la même formule est utilisée pour toutes les lampes)
        const turbiditeCache = {};
        if (indexTurb !== -1) {
            for (let i = 3; i < lignes.length - 1; i++) {
                const cols = lignes[i].split(';');
                if (cols[indexTurb] !== '') {
                    const turbMesure = parseFloat(cols[indexTurb].replace(/\r|\n/g, ''));
                    if (turbMesure > eauValeurL4) {
                        const log = Math.log(turbMesure - eauValeurL4);
                        turbiditeCache[i] = {turbMesure, log, log2: log ** 2};
                    } else {
                        turbiditeCache[i] = {turbMesure, noCorrection: true};
                    }
                }
            }
        }

        const resultatsCache = {};

        const resultatsParLampe = lampesACorriger.map(idLampe => {
            const indexLampe = colonnes.indexOf(`L${idLampe}`);

            if (indexLampe === -1 || indexTurb === -1) return null;

            // Récupération ou calcul des coefficients
            let resultat;
            if (!resultatsCache[idLampe]) {
                resultat = this.gestionnaireCalculs.effectuerCalculsCourbes(idLampe, turbidite);
                resultatsCache[idLampe] = resultat;
            } else {
                resultat = resultatsCache[idLampe];
            }

            this.creerCalcul(`Correction de turbidité (L${idLampe})`, {'TS': niveauCorrection});

            const colonneFinale = [];
            const dataPoints = [];
            const dates = [];
            const lignesAModifier = new Map();

            for (let i = 3; i < lignes.length - 1; i++) {
                const cols = lignes[i].split(';');
                const dateHeure = cols[0] + '-' + cols[1];

                if (cols[indexLampe] !== '' && cols[indexTurb] !== '') {
                    const lampeMesure = parseFloat(cols[indexLampe].replace(/\r|\n/g, ''));
                    const turbCache = turbiditeCache[i];

                    let valeurCorrigee;
                    if (turbCache.noCorrection) {
                        valeurCorrigee = lampeMesure;
                    } else {
                        if (resultat[0].length === 3) {
                            const exp = Math.exp(
                                parseFloat(resultat[0][0]) +
                                parseFloat(resultat[0][1]) * turbCache.log +
                                parseFloat(resultat[0][2]) * turbCache.log2
                            );
                            valeurCorrigee = lampeMesure - niveauCorrection * exp;
                        } else if (resultat[0].length === 2) {
                            const exp = Math.exp(
                                parseFloat(resultat[0][0]) +
                                parseFloat(resultat[0][1]) * turbCache.log
                            );
                            valeurCorrigee = lampeMesure - niveauCorrection * exp;
                        } else {
                            valeurCorrigee = lampeMesure - niveauCorrection * parseFloat(resultat[0][0]);
                        }
                    }

                    colonneFinale.push(valeurCorrigee);
                    const timestamp = DateTime.fromFormat(dateHeure, 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'}).toMillis();
                    dataPoints.push({x: timestamp, y: valeurCorrigee});
                    dates.push(dateHeure);
                    lignesAModifier.set(i, valeurCorrigee);
                }
            }

            return {
                idLampe,
                dataPoints,
                lignesAModifier,
                dates,
                colonneFinale
            };
        }).filter(Boolean);

        if (resultatsParLampe.length > 0) {
            let lignesModifiees = [...lignes];

            for (const resultat of resultatsParLampe) {
                const {idLampe, dataPoints, lignesAModifier, colonneFinale} = resultat;

                let header = lignesModifiees[2].replace(/\r|\n/g, '').split(';');
                const nomColonne = `L${idLampe}Corr`;
                const indexColonne = header.indexOf(nomColonne);

                if (indexColonne !== -1) {
                    for (const [lineIndex, valeur] of lignesAModifier.entries()) {
                        const cols = lignesModifiees[lineIndex].split(';');
                        cols[indexColonne] = arrondirA2Decimales(valeur);
                        lignesModifiees[lineIndex] = cols.join(';');
                    }
                } else {
                    header.push(nomColonne);
                    lignesModifiees[2] = header.join(';');

                    for (const [lineIndex, valeur] of lignesAModifier.entries()) {
                        lignesModifiees[lineIndex] = lignesModifiees[lineIndex].replace(/\r|\n/g, '') + ';' + arrondirA2Decimales(valeur);
                    }
                }
                this.mettreAJourGraphique(nomColonne, dataPoints);
            }

            this.controlleur.copieContenuFichierMesure = lignesModifiees.join('\n');
        }
    }
}
