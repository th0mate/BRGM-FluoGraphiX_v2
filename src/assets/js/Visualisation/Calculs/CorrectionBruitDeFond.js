/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 * Gère la correction du bruit de fond sur les données de visualisation
 */
import {afficherMessageFlash, arrondirA2Decimales} from "@/assets/js/Common/utils.js";
import {BaseCalcul} from "@/assets/js/Visualisation/Calculs/BaseCalcul.js";
import {afficherPopup, fermerPopup} from "@/assets/js/UI/popupService.js";
import {DateTime} from "luxon";
import {arrondir8Chiffres, transpose, multiply, inverse} from "@/assets/js/Calibration/utils.js";
import GestionnaireCourbesCalibration from "@/assets/js/Calibration/gestionCalculsCourbesCalibration.js";
import warningImage from "@/assets/img/popup/warning.png";


/**
 * =======================================================================================================================
 * Classe de correction du bruit de fond
 * ======================================================================================================================
 */
export class CorrectionBruitDeFond extends BaseCalcul {
    constructor(controlleur) {
        super(controlleur);
        this.cachedResults = {};
        this.gestionnaireCalculs = new GestionnaireCourbesCalibration();
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
     * Méthode interne qui effectue réellement la correction du bruit de fond
     * @private
     * @param {Array} traceurs - Traceurs concernés (1 ou 2)
     * @param {Object} options - { listeLampeBruitDeFond: Array, zoneSelectionnee: Array }
     */
    _effectuerCorrection(traceurs, options = {}) {
        if (!Array.isArray(traceurs) || traceurs.length === 0) return;

        const {listeLampeBruitDeFond = [], zoneSelectionnee = []} = options;

        const eau = this.getTraceurParUnite('');
        if (!eau) {
            afficherMessageFlash("Erreur", 'Traceur eau non trouvé. Veuillez vérifier vos données de calibration', 'error');
            return;
        }

        const chart = this.getChartInstance();
        if (!chart) return;

        const lignes = this.controlleur.copieContenuFichierMesure.split('\n').filter(l => l !== '');
        const colonnes = lignes[2].split(';').map(col => col.replace(/\r|\n/g, ''));

        const dateMapping = this._creerMappingDates(lignes);

        // Enregistrement des paramètres du calcul pour traçabilité
        const parametres = {
            'Variables sélectionnées': listeLampeBruitDeFond,
            'Nombre de traceurs': traceurs.length
        };

        if (zoneSelectionnee.length > 0) {
            parametres['Période'] = zoneSelectionnee[0] + ' - ' + zoneSelectionnee[1];
        }

        this.creerCalcul('Correction de bruit de fond', parametres);

        // Application de la correction selon le nombre de traceurs
        if (traceurs.length === 1) {
            this._corrigerUnTraceur(traceurs[0], listeLampeBruitDeFond, zoneSelectionnee, eau, lignes, colonnes, dateMapping);
        } else if (traceurs.length === 2) {
            this._corrigerDeuxTraceurs(traceurs, listeLampeBruitDeFond, zoneSelectionnee, eau, lignes, colonnes, dateMapping);
        } else {
            afficherMessageFlash("Information", 'Correction de bruit de fond pour plus de 2 traceurs non implémentée.', 'info');
        }
    }


    /**
     * Crée un mapping des dates pour un accès rapide aux lignes
     * @private
     * @param {Array} lignes - Lignes du fichier de mesures
     * @returns {Object} - Mapping des dates vers les indices de ligne
     */
    _creerMappingDates(lignes) {
        const dateMapping = {};
        for (let i = 3; i < lignes.length - 1; i++) {
            const cols = lignes[i].split(';');
            if (cols[0] && cols[1]) {
                const dateHeure = cols[0] + '-' + cols[1];
                dateMapping[dateHeure] = i;
            }
        }
        return dateMapping;
    }


    /**
     * Méthode interne pour appliquer la correction à un seul traceur
     * @private
     * @param {Object} traceur - Traceur à corriger
     * @param {Array} listeLampeBruitDeFond - Liste des lampes à utiliser pour le bruit de fond
     * @param {Array} zoneSelectionnee - Période exclue [dateDebut, dateFin] au format 'dd/MM/yy-HH:mm:ss'
     * @param {Object} eau - Traceur eau
     * @param {Array} lignes - Lignes du fichier de mesures
     * @param {Array} colonnes - Noms des colonnes
     * @param {Object} dateMapping - Mapping des dates pour accès rapide
     */
    _corrigerUnTraceur(traceur, listeLampeBruitDeFond, zoneSelectionnee, eau, lignes, colonnes, dateMapping) {
        const cacheKey = `${traceur.nom}_${listeLampeBruitDeFond.join('_')}_${zoneSelectionnee.join('_')}`;
        if (this.cachedResults[cacheKey]) {
            const {dataCorr, dataNat} = this.cachedResults[cacheKey];
            this.mettreAJourGraphique(`L${traceur.lampePrincipale}Corr_nat`, dataCorr);
            this.mettreAJourGraphique(`L${traceur.lampePrincipale}Nat`, dataNat);
            this._mettreMajDansFichier(lignes, dataCorr, traceur.lampePrincipale, dateMapping);
            return;
        }

        let indexLampePrincipale = this._trouverIndexColonne(colonnes, traceur.lampePrincipale);
        let tableauIndex = listeLampeBruitDeFond.map(lampe => this._trouverIndexColonne(colonnes, lampe)).filter(idx => idx !== -1);

        if (indexLampePrincipale === -1 || tableauIndex.length === 0) {
            afficherMessageFlash("Erreur", 'Impossible de trouver les colonnes nécessaires pour la correction', 'error');
            return;
        }

        const {X, Y, dates, zoneExclue} = this._preparerDonneesRegression(
            lignes, indexLampePrincipale, tableauIndex, zoneSelectionnee
        );

        if (X.length < tableauIndex.length + 1) {
            afficherMessageFlash("Erreur", 'Pas assez de données pour effectuer la régression linéaire', 'error');
            return;
        }

        const coefficients = this._calculerCoefficientsRegression(X, Y);
        if (!coefficients) return;

        const {dataCorr, dataNat} = this._appliquerCorrection(
            lignes, indexLampePrincipale, tableauIndex, coefficients, eau, traceur
        );

        // Calculer le coefficient de corrélation pour vérifier la qualité de la régression
        if (dataNat.length > 0 && dataCorr.length > 0) {
            const yPredicted = dataNat.map(point => point.y);
            const yActual = lignes
                .slice(3)
                .map(ligne => ligne.split(';')[indexLampePrincipale])
                .filter((val, i) => val && !isNaN(val) && dataNat[i])
                .map(val => parseFloat(val));

            if (yActual.length > 0 && yPredicted.length === yActual.length) {
                const coeffCorrelation = this._calculerCoeffCorrelation(yPredicted, yActual);

                if (coeffCorrelation <= 0.5) {
                    this._afficherAvertissementCorrelation(coeffCorrelation, traceur.nom);
                } else {
                    afficherMessageFlash("Information", `Le coefficient de corrélation de Pearson pour "${traceur.nom}" est de ${coeffCorrelation}.`, 'info');
                }
            }
        }

        this.cachedResults[cacheKey] = {dataCorr, dataNat};
        this.mettreAJourGraphique(`L${traceur.lampePrincipale}Corr_nat`, dataCorr);
        this.mettreAJourGraphique(`L${traceur.lampePrincipale}Nat`, dataNat);
        this._mettreMajDansFichier(lignes, dataCorr, traceur.lampePrincipale, dateMapping);
    }


    /**
     * Méthode interne pour appliquer la correction à deux traceurs
     * @private
     * @param {Array} traceurs - Les deux traceurs à corriger
     * @param {Array} listeLampeBruitDeFond - Liste des lampes à utiliser pour le bruit de fond
     * @param {Array} zoneSelectionnee - Période exclue [dateDebut, dateFin] au format 'dd/MM/yy-HH:mm:ss'
     * @param {Object} eau - Traceur eau
     * @param {Array} lignes - Lignes du fichier de mesures
     * @param {Array} colonnes - Noms des colonnes
     * @param {Object} dateMapping - Mapping des dates pour accès rapide
     */
    _corrigerDeuxTraceurs(traceurs, listeLampeBruitDeFond, zoneSelectionnee, eau, lignes, colonnes, dateMapping) {
        const cacheKey = `${traceurs[0].nom}_${traceurs[1].nom}_${listeLampeBruitDeFond.join('_')}_${zoneSelectionnee.join('_')}`;
        if (this.cachedResults[cacheKey]) {
            const {dataCorr1, dataNat1, dataCorr2, dataNat2} = this.cachedResults[cacheKey];

            this.mettreAJourGraphique(`L${traceurs[0].lampePrincipale}Corr_nat`, dataCorr1);
            this.mettreAJourGraphique(`L${traceurs[0].lampePrincipale}Nat`, dataNat1);

            this.mettreAJourGraphique(`L${traceurs[1].lampePrincipale}Corr_nat`, dataCorr2);
            this.mettreAJourGraphique(`L${traceurs[1].lampePrincipale}Nat`, dataNat2);

            return;
        }

        // Trier les lampes de bruit de fond pour un traitement cohérent
        const sortedLampeBruitDeFond = this._trierLampesBruitDeFond(listeLampeBruitDeFond);
        const resultats = [];

        for (let i = 0; i < traceurs.length; i++) {
            const traceur = traceurs[i];

            let indexLampePrincipale = this._trouverIndexColonne(colonnes, traceur.lampePrincipale);

            if (indexLampePrincipale === -1) {
                indexLampePrincipale = colonnes.indexOf(`L${traceur.lampePrincipale}Corr`);
            }

            if (indexLampePrincipale === -1) {
                afficherMessageFlash("Erreur", `Impossible de trouver la colonne pour la lampe principale du traceur ${traceur.nom}`, 'error');
                continue;
            }

            let tableauIndex = sortedLampeBruitDeFond.map(lampe => {
                const idx = colonnes.indexOf(lampe);
                return idx !== -1 ? idx : null;
            }).filter(idx => idx !== null);

            if (tableauIndex.length === 0) {
                afficherMessageFlash("Erreur", `Aucune colonne de bruit de fond trouvée pour le traceur ${traceur.nom}`, 'error');
                continue;
            }

            const {X, Y, dates} = this._preparerDonneesRegression(
                lignes, indexLampePrincipale, tableauIndex, zoneSelectionnee
            );

            if (X.length < tableauIndex.length + 1) {
                afficherMessageFlash("Erreur", `Pas assez de données pour effectuer la régression linéaire pour ${traceur.nom}`, 'error');
                continue;
            }

            const coefficients = this._calculerCoefficientsRegression(X, Y);
            if (!coefficients) continue;

            const {yPredicted, yActual} = this._calculerValeursPredictesEtActuelles(
                lignes, indexLampePrincipale, tableauIndex, coefficients, zoneSelectionnee
            );

            const coeffCorrelation = this._calculerCoeffCorrelation(yPredicted, yActual);
            this._afficherAvertissementCorrelation(coeffCorrelation, traceur.nom);

            const {dataCorr, dataNat, nomColonneCorr, nomColonneNat} = this._preparerDonneesCorrigees(
                traceur, lignes, indexLampePrincipale, tableauIndex, coefficients, eau
            );

            resultats.push({
                traceur,
                dataCorr,
                dataNat,
                nomColonneCorr,
                nomColonneNat
            });
        }

        // Fusionner les résultats et mettre à jour le fichier
        if (resultats.length > 0) {
            let lignesModifiees = this._fusionnerResultatsMultiTraceurs(lignes, resultats);

            this.controlleur.copieContenuFichierMesure = lignesModifiees.join('\n');

            for (const resultat of resultats) {
                this.mettreAJourGraphique(resultat.nomColonneCorr, resultat.dataCorr);
                this.mettreAJourGraphique(resultat.nomColonneNat, resultat.dataNat);
            }

            // Mettre en cache les résultats si les deux traceurs ont été traités avec succès
            if (resultats.length === 2) {
                this.cachedResults[cacheKey] = {
                    dataCorr1: resultats[0].dataCorr,
                    dataNat1: resultats[0].dataNat,
                    dataCorr2: resultats[1].dataCorr,
                    dataNat2: resultats[1].dataNat
                };
            }
        }
    }


    /**
     * Tri les lampes de bruit de fond pour un traitement cohérent
     * @private
     * @param {Array<string>} listeLampeBruitDeFond - Liste des noms de lampes
     * @returns {Array<string>} - Liste triée des noms de lampes
     */
    _trierLampesBruitDeFond(listeLampeBruitDeFond) {
        return [...listeLampeBruitDeFond].sort((a, b) => {
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
     * Calcule les valeurs prédites et actuelles pour évaluer la qualité de la régression
     * @private
     * @param {Array} lignes - Lignes du fichier de mesures
     * @param {number} indexLampePrincipale - Index de la colonne de la lampe principale
     * @param {Array} tableauIndex - Tableau des indices des colonnes utilisées comme variables explicatives
     * @param {Array} coefficients - Coefficients de la régression
     * @param {Array} zoneSelectionnee - Période exclue [dateDebut, dateFin]
     * @returns {Object} - {yPredicted, yActual}
     */
    _calculerValeursPredictesEtActuelles(lignes, indexLampePrincipale, tableauIndex, coefficients, zoneSelectionnee) {
        let t0 = null, t1 = null;
        if (zoneSelectionnee && zoneSelectionnee.length === 2) {
            t0 = DateTime.fromFormat(zoneSelectionnee[0], 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'}).toMillis();
            t1 = DateTime.fromFormat(zoneSelectionnee[1], 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'}).toMillis();
        }

        const yPredicted = [];
        const yActual = [];

        for (let i = 3; i < lignes.length - 1; i++) {
            const cols = lignes[i].split(';');
            if (cols[0] === '' || cols[1] === '' || cols[indexLampePrincipale] === '') continue;

            const dateHeure = cols[0] + '-' + cols[1];
            const timeDate = DateTime.fromFormat(dateHeure, 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'});
            const timestamp = timeDate.toMillis();

            if (t0 !== null && t1 !== null && timestamp > t0 && timestamp < t1) continue;
            if (tableauIndex.some(idx => cols[idx] === '')) continue;

            let predicted = 0;
            for (let k = 0; k < tableauIndex.length; k++) {
                predicted += coefficients[k][0] * parseFloat(cols[tableauIndex[k]].replace(/\r|\n/g, ''));
            }
            predicted += coefficients[tableauIndex.length][0];

            yPredicted.push(predicted);
            yActual.push(parseFloat(cols[indexLampePrincipale].replace(/\r|\n/g, '')));
        }

        return {yPredicted, yActual};
    }


    /**
     * Affiche un avertissement si la corrélation est faible
     * @private
     * @param {number} coeffCorrelation - Coefficient de corrélation
     * @param {string} nomTraceur - Nom du traceur
     */
    _afficherAvertissementCorrelation(coeffCorrelation, nomTraceur) {
        if (coeffCorrelation <= 0.5) {
            afficherPopup(
                `<img src="${warningImage}" alt="Avertissement" style="width: 120px;">`,
                'Avertissement',
                `Avertissement - coefficient de corrélation`,
                `Le coefficient de corrélation de Pearson pour "${traceur.nom}" est de ${coeffCorrelation}. 
                        Il est conseillé de vérifier l'absence de dérive instrumentale ou de choisir 
                        une plage de données différente pour ce calcul.`,
                'Fermer'
            );
        } else {
            afficherMessageFlash("Informations", `Le coefficient de corrélation de Pearson pour "${nomTraceur}" est de ${coeffCorrelation}.`, 'info');
        }
    }


    /**
     * Prépare les données corrigées pour un traceur
     * @private
     * @param {Object} traceur - Traceur concerné
     * @param {Array} lignes - Lignes du fichier de mesures
     * @param {number} indexLampePrincipale - Index de la colonne de la lampe principale
     * @param {Array} tableauIndex - Indices des colonnes de bruit de fond
     * @param {Array} coefficients - Coefficients de régression
     * @param {Object} eau - Traceur eau
     * @returns {Object} - {dataCorr, dataNat, nomColonneCorr, nomColonneNat}
     */
    _preparerDonneesCorrigees(traceur, lignes, indexLampePrincipale, tableauIndex, coefficients, eau) {
        const dataCorr = [];
        const dataNat = [];
        const nomColonneCorr = `L${traceur.lampePrincipale}Corr_nat`;
        const nomColonneNat = `L${traceur.lampePrincipale}Nat`;

        for (let i = 3; i < lignes.length; i++) {
            const cols = lignes[i].split(';');
            if (cols.length <= indexLampePrincipale || cols[indexLampePrincipale] === '') continue;

            const dateHeure = cols[0] + '-' + cols[1];
            const timeDate = DateTime.fromFormat(dateHeure, 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'});
            const timestamp = timeDate.toMillis();

            if (tableauIndex.some(idx => cols.length <= idx || cols[idx] === '')) continue;
            let LxNat = this._calculerBruitDeFond(cols, tableauIndex, coefficients);

            // Calcul de la valeur corrigée
            const valeurMesuree = parseFloat(cols[indexLampePrincipale].replace(/\r|\n/g, ''));
            const valeurEau = eau.getDataParNom(`L${traceur.lampePrincipale}-1`);
            const valeurCorrigee = (valeurMesuree - LxNat) + valeurEau;

            dataNat.push({x: timestamp, y: LxNat});
            dataCorr.push({x: timestamp, y: valeurCorrigee});
        }

        return {dataCorr, dataNat, nomColonneCorr, nomColonneNat};
    }


    /**
     * Calcule le bruit de fond estimé à partir des coefficients
     * @private
     * @param {Array} cols - Colonnes d'une ligne de données
     * @param {Array} tableauIndex - Indices des colonnes de bruit de fond
     * @param {Array} coefficients - Coefficients de régression
     * @returns {number} - Bruit de fond estimé
     */
    _calculerBruitDeFond(cols, tableauIndex, coefficients) {
        let bruitDeFond = 0;
        for (let k = 0; k < tableauIndex.length; k++) {
            bruitDeFond += coefficients[k][0] * parseFloat(cols[tableauIndex[k]].replace(/\r|\n/g, ''));
        }
        bruitDeFond += coefficients[tableauIndex.length][0];
        return bruitDeFond;
    }


    /**
     * Fusionne les résultats de plusieurs traceurs dans un fichier
     * @private
     * @param {Array} lignes - Lignes du fichier de mesures
     * @param {Array} resultats - Résultats des traceurs
     * @returns {Array} - Lignes modifiées
     */
    _fusionnerResultatsMultiTraceurs(lignes, resultats) {
        let lignesModifiees = [...lignes];
        let header = lignesModifiees[2].replace(/\r|\n/g, '').split(';');

        const colonnesAAjouter = new Set();
        const indexColonnes = {};

        // Supprimer les colonnes existantes et collecter les colonnes à ajouter
        for (const resultat of resultats) {
            const nomColonneCorr = resultat.nomColonneCorr;
            const nomColonneNat = resultat.nomColonneNat;
            const indexCorr = header.indexOf(nomColonneCorr);
            const indexNat = header.indexOf(nomColonneNat);

            if (indexCorr !== -1) {
                header.splice(indexCorr, 1);
            }
            if (indexNat !== -1) {
                header.splice(indexNat, 1);
            }

            colonnesAAjouter.add(nomColonneCorr);
            colonnesAAjouter.add(nomColonneNat);
        }

        for (const colonne of colonnesAAjouter) {
            header.push(colonne);
            indexColonnes[colonne] = header.length - 1;
        }

        lignesModifiees[2] = header.join(';');
        const nouvellesValeurs = {};

        for (let i = 3; i < lignesModifiees.length; i++) {
            nouvellesValeurs[i] = Array(colonnesAAjouter.size).fill('');
        }

        // Remplir les nouvelles valeurs pour chaque traceur
        for (const resultat of resultats) {
            const {dataCorr, dataNat, nomColonneCorr, nomColonneNat} = resultat;

            for (const point of dataCorr) {
                const date = DateTime.fromMillis(point.x, {zone: 'UTC'}).toFormat('dd/MM/yy-HH:mm:ss');
                for (let i = 3; i < lignesModifiees.length; i++) {
                    const cols = lignesModifiees[i].split(';');
                    if (cols[0] + '-' + cols[1] === date) {
                        const indexCol = indexColonnes[nomColonneCorr] - header.length + colonnesAAjouter.size;
                        nouvellesValeurs[i][indexCol] = arrondirA2Decimales(point.y);
                        break;
                    }
                }
            }

            for (const point of dataNat) {
                const date = DateTime.fromMillis(point.x, {zone: 'UTC'}).toFormat('dd/MM/yy-HH:mm:ss');
                for (let i = 3; i < lignesModifiees.length; i++) {
                    const cols = lignesModifiees[i].split(';');
                    if (cols[0] + '-' + cols[1] === date) {
                        const indexCol = indexColonnes[nomColonneNat] - header.length + colonnesAAjouter.size;
                        nouvellesValeurs[i][indexCol] = arrondirA2Decimales(point.y);
                        break;
                    }
                }
            }
        }

        for (let i = 3; i < lignesModifiees.length; i++) {
            if (nouvellesValeurs[i].some(val => val !== '')) {
                lignesModifiees[i] = lignesModifiees[i].replace(/\r|\n/g, '') + ';' + nouvellesValeurs[i].join(';');
            }
        }

        return lignesModifiees;
    }


    /**
     * Trouve la colonne dans un tableau de colonnes par différentes variations du nom
     * @private
     * @param {Array<string>} colonnes - Liste des noms de colonnes
     * @param {number|string} idLampe - ID de la lampe (1, 2, 3, 4) ou nom complet de colonne
     * @returns {number} - Index de la colonne ou -1 si non trouvé
     */
    _trouverIndexColonne(colonnes, idLampe) {
        if (typeof idLampe === 'number') {
            for (const format of [`L${idLampe}`, `L${idLampe}Corr`, `L${idLampe}_corr`]) {
                const index = colonnes.indexOf(format);
                if (index !== -1) return index;
            }
        } else if (typeof idLampe === 'string') {
            return colonnes.indexOf(idLampe);
        }
        return -1;
    }


    /**
     * Prépare les données pour la régression linéaire
     * @private
     * @param {Array} lignes - Lignes du fichier de mesures
     * @param {number} indexLampePrincipale - Index de la colonne de la lampe principale
     * @param {Array} tableauIndex - Tableau des indices des colonnes à utiliser comme variables explicatives
     * @param {Array} zoneSelectionnee - Période exclue [dateDebut, dateFin]
     * @returns {Object} - Données préparées pour la régression
     */
    _preparerDonneesRegression(lignes, indexLampePrincipale, tableauIndex, zoneSelectionnee) {
        let Y = [], X = [], dates = [];
        let t0 = null, t1 = null;
        let zoneExclue = false;

        // Préparation des bornes temporelles si une zone est sélectionnée
        if (zoneSelectionnee && zoneSelectionnee.length === 2) {
            t0 = DateTime.fromFormat(zoneSelectionnee[0], 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'}).toMillis();
            t1 = DateTime.fromFormat(zoneSelectionnee[1], 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'}).toMillis();
            zoneExclue = true;
        }

        // Collecte des données pour la régression
        for (let i = 3; i < lignes.length - 1; i++) {
            const cols = lignes[i].split(';');
            if (cols[0] === '' || cols[1] === '') continue;

            const dateHeure = cols[0] + '-' + cols[1];
            const timeDate = DateTime.fromFormat(dateHeure, 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'});
            const timestamp = timeDate.toMillis();

            if (zoneExclue && timestamp > t0 && timestamp < t1) {
                continue;
            }

            if (cols[indexLampePrincipale] === '' || tableauIndex.some(idx => cols[idx] === '')) {
                continue;
            }

            dates.push(dateHeure);
            Y.push([parseFloat(cols[indexLampePrincipale].replace(/\r|\n/g, ''))]);

            let ligneX = tableauIndex.map(idx => parseFloat(cols[idx].replace(/\r|\n/g, '')));
            ligneX.push(1);
            X.push(ligneX);
        }

        return {X, Y, dates, zoneExclue};
    }


    /**
     * Calcule les coefficients de la régression linéaire
     * @private
     * @param {Array} X - Matrice des variables explicatives
     * @param {Array} Y - Vecteur de la variable à expliquer
     * @returns {Array} - Coefficients de la régression
     */
    _calculerCoefficientsRegression(X, Y) {
        try {
            const XT = transpose(X);
            const XTX = multiply(XT, X);
            const XTXinv = inverse(XTX);
            const XTY = multiply(XT, Y);
            return multiply(XTXinv, XTY);
        } catch (e) {
            console.error('Erreur dans le calcul des coefficients de régression:', e);
            afficherMessageFlash("Erreur", 'Erreur dans le calcul de la régression. Vérifiez vos données.', 'error');
            return null;
        }
    }


    /**
     * Calcule le coefficient de corrélation de Pearson entre deux séries de données
     * @private
     * @param {Array<number>} x - Première série de données
     * @param {Array<number>} y - Deuxième série de données
     * @returns {number} - Coefficient de corrélation arrondi à 2 décimales
     */
    _calculerCoeffCorrelation(x, y) {
        if (!x || !y || x.length !== y.length || x.length === 0) return 0;

        const n = x.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;

        for (let i = 0; i < n; i++) {
            sumX += x[i];
            sumY += y[i];
            sumXY += x[i] * y[i];
            sumX2 += x[i] * x[i];
            sumY2 += y[i] * y[i];
        }

        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

        if (denominator === 0) return 0;

        return arrondirA2Decimales(numerator / denominator);
    }


    /**
     * Applique les coefficients pour corriger les données
     * @private
     * @param {Array} lignes - Lignes du fichier de mesures
     * @param {number} indexLampePrincipale - Index de la colonne de la lampe principale
     * @param {Array} tableauIndex - Tableau des indices des colonnes utilisées comme variables explicatives
     * @param {Array} coefficients - Coefficients de la régression
     * @param {Object} eau - Traceur eau
     * @param {Object} traceur - Traceur concerné
     * @returns {Object} - Données corrigées
     */
    _appliquerCorrection(lignes, indexLampePrincipale, tableauIndex, coefficients, eau, traceur) {
        if (!coefficients) return {dataCorr: [], dataNat: []};

        const dataCorr = [];
        const dataNat = [];
        const valeursCorrigees = {};

        for (let i = 3; i < lignes.length; i++) {
            const cols = lignes[i].split(';');
            if (cols.length <= indexLampePrincipale || cols[indexLampePrincipale] === '') continue;

            const dateHeure = cols[0] + '-' + cols[1];
            const timeDate = DateTime.fromFormat(dateHeure, 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'});
            const timestamp = timeDate.toMillis();

            if (tableauIndex.some(idx => cols.length <= idx || cols[idx] === '')) continue;
            let LxNat = this._calculerBruitDeFond(cols, tableauIndex, coefficients);

            // Valeur corrigée = mesure - bruit de fond estimé + valeur eau (référence)
            const valeurMesuree = parseFloat(cols[indexLampePrincipale].replace(/\r|\n/g, ''));
            const valeurEau = eau.getDataParNom(`L${traceur.lampePrincipale}-1`);
            const valeur = (valeurMesuree - LxNat) + valeurEau;

            dataNat.push({x: timestamp, y: LxNat});
            dataCorr.push({x: timestamp, y: valeur});
            valeursCorrigees[dateHeure] = valeur;
        }

        return {dataCorr, dataNat, valeursCorrigees};
    }


    /**
     * Met à jour le fichier de mesures avec les valeurs corrigées
     * @private
     * @param {Array} lignes - Lignes du fichier de mesures
     * @param {Array} dataCorr - Données corrigées
     * @param {number} lampePrincipale - ID de la lampe principale
     * @param {Object} dateMapping - Mapping des dates pour accès rapide
     */
    _mettreMajDansFichier(lignes, dataCorr, lampePrincipale, dateMapping) {
        let header = lignes[2].replace(/\r|\n/g, '').split(';');
        const nomColonne = `L${lampePrincipale}Corr_nat`;
        const indexColonne = header.indexOf(nomColonne);

        let lignesModifiees = [...lignes];

        if (indexColonne !== -1) {
            for (const point of dataCorr) {
                const date = DateTime.fromMillis(point.x, {zone: 'UTC'}).toFormat('dd/MM/yy-HH:mm:ss');
                const lineIndex = dateMapping[date];
                if (lineIndex !== undefined) {
                    const cols = lignesModifiees[lineIndex].split(';');
                    cols[indexColonne] = arrondirA2Decimales(point.y);
                    lignesModifiees[lineIndex] = cols.join(';');
                }
            }
        } else {
            header.push(nomColonne);
            lignesModifiees[2] = header.join(';');

            for (const point of dataCorr) {
                const date = DateTime.fromMillis(point.x, {zone: 'UTC'}).toFormat('dd/MM/yy-HH:mm:ss');
                const lineIndex = dateMapping[date];
                if (lineIndex !== undefined) {
                    lignesModifiees[lineIndex] = lignesModifiees[lineIndex].replace(/\r|\n/g, '') +
                        ';' + arrondirA2Decimales(point.y);
                }
            }
        }

        // Mettre à jour le contenu du fichier
        this.controlleur.copieContenuFichierMesure = lignesModifiees.join('\n');
    }
}
