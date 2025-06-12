/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 * Gère la correction du bruit de fond sur les données de visualisation (adapté de v1)
 */
import {afficherMessageFlash, arrondirA2Decimales} from "@/assets/js/Common/utils.js";
import {BaseCalcul} from "@/assets/js/Visualisation/Calculs/BaseCalcul.js";
import {afficherPopup} from "@/assets/js/UI/popupService.js";
import {DateTime} from "luxon";
import {transpose, multiply, inverse} from "@/assets/js/Calibration/utils.js";
import warningImage from "@/assets/img/popup/warning.png";


/**
 * =======================================================================================================================
 * Classe de correction du bruit de fond
 * Adaptation directe du code de la v1 pour assurer des résultats identiques
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
     * @returns {Promise} - Promise résolue après l'application de la correction
     */
    appliquerCorrection(traceurs, options = {}) {
        return this.executerAvecChargement(this._effectuerCorrection, traceurs, options);
    }


    /**
     * Calcule le coefficient de corrélation de Pearson entre deux séries de valeurs
     * @private
     * @param {Array<number>} x - Première série de valeurs
     * @param {Array<number>} y - Deuxième série de valeurs
     * @returns {number} - Coefficient de corrélation (entre -1 et 1)
     */
    _calculerCorrelationPearson(x, y) {
        let moyenneX = x.reduce((acc, val) => acc + val, 0) / x.length;
        let moyenneY = y.reduce((acc, val) => acc + val, 0) / y.length;

        let sommeNumerateur = 0;
        let sommeDenominateurX = 0;
        let sommeDenominateurY = 0;

        for (let i = 0; i < x.length; i++) {
            sommeNumerateur += (x[i] - moyenneX) * (y[i] - moyenneY);
            sommeDenominateurX += Math.pow(x[i] - moyenneX, 2);
            sommeDenominateurY += Math.pow(y[i] - moyenneY, 2);
        }

        return sommeNumerateur / (Math.sqrt(sommeDenominateurX) * Math.sqrt(sommeDenominateurY));
    }


    /**
     * Tri les noms de lampes selon leur numéro et suffixe
     * @private
     * @param {Array<string>} lampes - Liste des noms de lampes (ex: ["L1", "L2Corr"])
     * @returns {Array<string>} - Liste triée
     */
    _trierLampes(lampes) {
        return [...lampes].sort((a, b) => {
            if (a.includes('Corr') && b.includes('Corr')) {
                return parseInt(a.replace('L', '').replace('Corr', '')) - parseInt(b.replace('L', '').replace('Corr', ''));
            } else if (a.includes('Corr')) {
                return parseInt(a.replace('L', '').replace('Corr', '')) - parseInt(b.replace('L', ''));
            } else if (b.includes('Corr')) {
                return parseInt(a.replace('L', '')) - parseInt(b.replace('L', '').replace('Corr', ''));
            } else {
                return parseInt(a.replace('L', '')) - parseInt(b.replace('L', ''));
            }
        });
    }


    /**
     * Méthode interne qui effectue réellement la correction du bruit de fond
     * @private
     * @param {Array} traceurs - Traceurs concernés (1 ou 2)
     * @param {Object} options - { listeLampeBruitDeFond: Array, zoneSelectionnee: Array }
     */
    _effectuerCorrection(traceurs, options = {}) {
        if (!traceurs || traceurs.length === 0) {
            afficherMessageFlash("Erreur", "Aucun traceur disponible pour la correction du bruit de fond", "error");
            return;
        }

        if (traceurs.length > 2) {
            afficherMessageFlash("Erreur", "La correction de bruit de fond n'est possible qu'avec un ou deux traceurs", "error");
            return;
        }

        const eau = this.getTraceurParUnite('');
        if (!eau) {
            afficherMessageFlash("Erreur", "Traceur eau non trouvé. Vérifiez vos données de calibration", "error");
            return;
        }

        const listeLampeBruitDeFond = options.listeLampeBruitDeFond || [];
        const zoneSelectionnee = options.zoneSelectionnee || [];

        if (listeLampeBruitDeFond.length === 0) {
            afficherMessageFlash("Erreur", "Veuillez sélectionner au moins une variable explicative", "error");
            return;
        }

        const calcul = this.creerCalcul("Correction de bruit de fond", {
            "Variables sélectionnées": listeLampeBruitDeFond
        });

        if (zoneSelectionnee && zoneSelectionnee.length === 2) {
            calcul.ajouterParametreCalcul("Période", `${zoneSelectionnee[0]} - ${zoneSelectionnee[1]}`);
        }

        let resultatsTraceur = [];

        for (const traceur of traceurs) {
            const result = this._corrigerBruitFondPourTraceur(
                traceur,
                this._trierLampes(listeLampeBruitDeFond),
                zoneSelectionnee,
                eau
            );

            if (result) {
                resultatsTraceur.push(result);
                calcul.ajouterParametreCalcul(`${traceur.nom}`, `R2 = ${result.coeffCorrelation}`);
            }
        }

        if (zoneSelectionnee && zoneSelectionnee.length === 2) {
            this._ajouterAnnotationZone(zoneSelectionnee);
        }

        return resultatsTraceur;
    }


    /**
     * Corrige le bruit de fond pour un traceur spécifique
     * @private
     * @param {Object} traceur - Traceur à corriger
     * @param {Array<string>} listeLampesTriees - Liste des lampes triées
     * @param {Array<string>} zoneSelectionnee - Zone à exclure [dateDebut, dateFin]
     * @param {Object} eau - Traceur eau
     * @returns {Object|null} - Résultat de la correction ou null en cas d'erreur
     */
    _corrigerBruitFondPourTraceur(traceur, listeLampesTriees, zoneSelectionnee, eau) {
        const lignes = this.controlleur.copieContenuFichierMesure.split('\n').filter(ligne => ligne !== '');
        const colonnes = lignes[2].split(';').map(colonne => colonne.replace(/\r|\n/g, ''));

        let indexLampePrincipale = colonnes.indexOf(`L${traceur.lampePrincipale}`);
        const tableauIndex = listeLampesTriees.map(lampe => colonnes.indexOf(lampe)).filter(index => index !== -1);

        const indexLampeCorrigee = colonnes.indexOf(`L${traceur.lampePrincipale}Corr`);
        if (indexLampeCorrigee !== -1) {
            indexLampePrincipale = indexLampeCorrigee;
        }

        if (indexLampePrincipale === -1 || tableauIndex.length === 0) {
            afficherMessageFlash("Erreur", `Colonnes non trouvées pour le traceur ${traceur.nom}`, "error");
            return null;
        }

        let dates = [];
        let Y = [];
        let X = [];

        for (let i = 3; i < lignes.length - 1; i++) {
            const cols = lignes[i].split(';');
            if (cols[indexLampePrincipale] === '') continue;

            const dateHeure = cols[0] + '-' + cols[1];
            const timestamp = DateTime.fromFormat(dateHeure, 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'}).toMillis();

            if (zoneSelectionnee && zoneSelectionnee.length === 2) {
                const dateDebutTS = DateTime.fromFormat(zoneSelectionnee[0], 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'}).toMillis();
                const dateFinTS = DateTime.fromFormat(zoneSelectionnee[1], 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'}).toMillis();

                if (timestamp > dateDebutTS && timestamp < dateFinTS) {
                    continue;
                }
            }

            const ligne = [];
            dates.push(dateHeure);
            Y.push([parseFloat(cols[indexLampePrincipale].replace(/\r|\n/g, ''))]);

            for (const index of tableauIndex) {
                ligne.push(parseFloat(cols[index].replace(/\r|\n/g, '')));
            }

            ligne.push(1);
            X.push(ligne);
        }

        if (X.length === 0 || Y.length === 0) {
            afficherMessageFlash("Avertissement", "Pas assez de données pour la correction du bruit de fond", "warning");
            return null;
        }

        const XTX = multiply(inverse(multiply(transpose(X), X)), transpose(X));
        const coefficients = multiply(XTX, Y);

        const LxNatPourCoeff = [];
        const yPourCoeff = [];

        for (let j = 3; j < lignes.length - 1; j++) {
            const cols = lignes[j].split(';');
            if (cols[indexLampePrincipale] === '') continue;

            const dateHeure = cols[0] + '-' + cols[1];
            const timestamp = DateTime.fromFormat(dateHeure, 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'}).toMillis();

            if (zoneSelectionnee && zoneSelectionnee.length === 2) {
                const dateDebutTS = DateTime.fromFormat(zoneSelectionnee[0], 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'}).toMillis();
                const dateFinTS = DateTime.fromFormat(zoneSelectionnee[1], 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'}).toMillis();

                if (timestamp > dateDebutTS && timestamp < dateFinTS) {
                    continue;
                }
            }

            let LxNat = 0;

            for (let k = 0; k < tableauIndex.length; k++) {
                if (cols[tableauIndex[k]] === '') continue;
                LxNat += coefficients[k][0] * parseFloat(cols[tableauIndex[k]].replace(/\r|\n/g, ''));
            }

            LxNat += coefficients[tableauIndex.length][0];

            LxNatPourCoeff.push(LxNat);
            yPourCoeff.push(parseFloat(cols[indexLampePrincipale].replace(/\r|\n/g, '')));
        }

        const coeffCorrelation = arrondirA2Decimales(this._calculerCorrelationPearson(LxNatPourCoeff, yPourCoeff));

        if (coeffCorrelation <= 0.5) {
            afficherPopup(
                `<img src="${warningImage}" alt="Attention" style="width: 120px;">`,
                'Avertissement',
                `Avertissement - coefficient de corrélation`,
                `Le coefficient de corrélation de Pearson pour "${traceur.nom}" est de ${coeffCorrelation}. Il est conseillé de vérifier l'absence de dérive instrumentale ou de choisir une plage de donnée différente pour ce calcul.`,
                'Fermer'
            );
        } else {
            afficherMessageFlash(`Le coefficient de corrélation de Pearson pour "${traceur.nom}" est de ${coeffCorrelation}.`, 'info');
        }

        let dataPointsCorr = [];
        let dataPointsNat = [];
        let datesFinales = [];
        let valeursCorr = [];
        let valeursNat = [];

        for (let j = 3; j < lignes.length; j++) {
            const cols = lignes[j].split(';');
            if (cols[indexLampePrincipale] === '') continue;

            const dateHeure = cols[0] + '-' + cols[1];
            const timestamp = DateTime.fromFormat(dateHeure, 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'}).toMillis();
            datesFinales.push(dateHeure);

            let LxNat = 0;
            let valeursOK = true;

            for (let k = 0; k < tableauIndex.length; k++) {
                if (!cols[tableauIndex[k]] || cols[tableauIndex[k]] === '') {
                    valeursOK = false;
                    break;
                }
                LxNat += coefficients[k][0] * parseFloat(cols[tableauIndex[k]].replace(/\r|\n/g, ''));
            }

            if (!valeursOK) continue;
            LxNat += coefficients[tableauIndex.length][0];

            const valeurTraceur = parseFloat(cols[indexLampePrincipale].replace(/\r|\n/g, ''));
            const valeurCorrigee = (valeurTraceur - LxNat) + eau.getDataParNom(`L${traceur.lampePrincipale}-1`);

            dataPointsNat.push({x: timestamp, y: LxNat});
            dataPointsCorr.push({x: timestamp, y: valeurCorrigee});
            valeursNat.push(LxNat);
            valeursCorr.push(valeurCorrigee);
        }

        this.controlleur.copieContenuFichierMesure = this.ajouterColonneResultat(
            `L${traceur.lampePrincipale}Nat`,
            valeursNat,
            datesFinales
        );

        this.controlleur.copieContenuFichierMesure = this.ajouterColonneResultat(
            `L${traceur.lampePrincipale}Corr_nat`,
            valeursCorr,
            datesFinales
        );

        this.mettreAJourGraphique(`L${traceur.lampePrincipale}Nat`, dataPointsNat);
        this.mettreAJourGraphique(`L${traceur.lampePrincipale}Corr_nat`, dataPointsCorr);

        return {
            traceur,
            coeffCorrelation,
            coefficients,
            dataPointsCorr,
            dataPointsNat
        };
    }


    /**
     * Ajoute une annotation visuelle sur le graphique pour la zone exclue
     * @private
     * @param {Array<string>} zoneSelectionnee - [dateDebut, dateFin]
     */
    _ajouterAnnotationZone(zoneSelectionnee) {
        if (!zoneSelectionnee || zoneSelectionnee.length !== 2) return;

        const chart = this.getChartInstance();
        if (!chart) return;

        const zoneStart = DateTime.fromFormat(zoneSelectionnee[0], 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'}).toMillis();
        const zoneEnd = DateTime.fromFormat(zoneSelectionnee[1], 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'}).toMillis();

        const minGraphique = chart.scales['x'].min;
        const maxGraphique = chart.scales['x'].max;

        const annotation1 = {
            type: 'box',
            xMin: minGraphique + 100,
            xMax: zoneStart,
            yMin: -Infinity,
            yMax: Infinity,
            backgroundColor: 'rgba(255,99,104,0.10)',
            borderColor: 'rgb(255,24,75, 0.50)',
            borderWidth: 2
        };

        const annotation2 = {
            type: 'box',
            xMin: zoneEnd,
            xMax: maxGraphique - 100,
            yMin: -Infinity,
            yMax: Infinity,
            backgroundColor: 'rgba(255,99,104,0.10)',
            borderColor: 'rgb(255,24,75, 0.50)',
            borderWidth: 2
        };

        chart.options.plugins.annotation.annotations = [annotation1, annotation2];
        chart.update();
    }
}
