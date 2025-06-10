/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 * Gère la correction du bruit de fond sur les données de visualisation
 */
import {afficherMessageFlash} from "@/assets/js/Common/utils.js";
import {BaseCalcul} from "@/assets/js/Visualisation/Calculs/BaseCalcul.js";


/**
 * =======================================================================================================================
 * Classe de correction du bruit de fond
 * ======================================================================================================================
 */
export class CorrectionBruitDeFond extends BaseCalcul {
    constructor(controlleur) {
        super(controlleur);
    }


    /**
     * Applique la correction du bruit de fond sur les traceurs sélectionnés
     * @param {Array} traceurs - Traceurs concernés (1 ou 2)
     * @param {Object} options - { listeLampeBruitDeFond: Array, zoneSelectionnee: Array }
     */
    appliquerCorrection(traceurs, options = {}) {
        if (!Array.isArray(traceurs) || traceurs.length === 0) return;
        const { listeLampeBruitDeFond = [], zoneSelectionnee = [] } = options;
        const eau = this.getTraceurParUnite('');
        const chart = this.getChartInstance();
        if (!chart) return;
        const lignes = this.controlleur.contenuFichierMesures.split('\n').filter(l => l !== '');
        const colonnes = lignes[2].split(';').map(col => col.replace(/\r|\n/g, ''));

        const parametres = {
            'Variables sélectionnées': listeLampeBruitDeFond
        };

        if (zoneSelectionnee.length > 0) {
            parametres['Période'] = zoneSelectionnee[0] + ' - ' + zoneSelectionnee[1];
        }

        this.creerCalcul('Correction de bruit de fond', parametres);

        // Cas 1 traceur (le plus courant)
        if (traceurs.length === 1) {
            const traceur = traceurs[0];
            let indexLampePrincipale = colonnes.indexOf(`L${traceur.lampePrincipale}`);
            let tableauIndex = listeLampeBruitDeFond.map(lampe => colonnes.indexOf(lampe)).filter(idx => idx !== -1);
            if (indexLampePrincipale === -1 || tableauIndex.length === 0) return;
            let Y = [], X = [], dates = [];
            for (let i = 3; i < lignes.length - 1; i++) {
                const cols = lignes[i].split(';');
                const timeDate = this.controlleur.DateTime.fromFormat(cols[0] + '-' + cols[1], 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'});
                const timestamp = timeDate.toMillis();
                if (zoneSelectionnee.length > 0) {
                    const t0 = this.controlleur.DateTime.fromFormat(zoneSelectionnee[0], 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'}).toMillis();
                    const t1 = this.controlleur.DateTime.fromFormat(zoneSelectionnee[1], 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'}).toMillis();
                    if (timestamp > t0 && timestamp < t1) continue;
                }
                if (cols[indexLampePrincipale] !== '') {
                    dates.push(cols[0] + '-' + cols[1]);
                    Y.push([cols[indexLampePrincipale].replace(/\r|\n/g, '')]);
                    let ligneX = tableauIndex.map(idx => cols[idx].replace(/\r|\n/g, ''));
                    ligneX.push(1);
                    X.push(ligneX);
                }
            }

            // Régression linéaire multiple : coefficients = (X^T X)^-1 X^T Y
            const XT = this.controlleur.transpose(X);
            const XTX = this.controlleur.multiply(XT, X);
            const XTXinv = this.controlleur.inverse(XTX);
            const XTY = this.controlleur.multiply(XT, Y);
            const coefficients = this.controlleur.multiply(XTXinv, XTY);

            // Application des coefficients pour correction
            const dataCorr = [];
            const dataNat = [];

            for (let i = 3; i < lignes.length; i++) {
                const cols = lignes[i].split(';');
                if (cols[indexLampePrincipale] !== '') {
                    const timeDate = this.controlleur.DateTime.fromFormat(cols[0] + '-' + cols[1], 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'});
                    const timestamp = timeDate.toMillis();
                    let ligneX = tableauIndex.map(idx => cols[idx].replace(/\r|\n/g, ''));
                    ligneX.push(1);
                    // LxNat = somme(coeff * X) + coeff0
                    let LxNat = 0;
                    for (let k = 0; k < tableauIndex.length; k++) {
                        LxNat += coefficients[k][0] * ligneX[k];
                    }
                    LxNat += coefficients[tableauIndex.length][0];
                    const valeur = (cols[indexLampePrincipale] - LxNat) + eau.getDataParNom(`L${traceur.lampePrincipale}-1`);
                    dataNat.push({x: timestamp, y: LxNat});
                    dataCorr.push({x: timestamp, y: valeur});
                }
            }

            this.mettreAJourGraphique(`L${traceur.lampePrincipale}Corr_nat`, dataCorr);
            this.mettreAJourGraphique(`L${traceur.lampePrincipale}Nat`, dataNat);
        } else {
            afficherMessageFlash('Correction de bruit de fond pour plusieurs traceurs : fonctionnalité à compléter.', 'info');
        }
    }
}
