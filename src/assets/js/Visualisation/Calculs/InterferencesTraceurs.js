/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 * Gère la correction des interférences entre traceurs
 */
import {afficherMessageFlash, arrondirA2Decimales} from "@/assets/js/Common/utils.js";
import {BaseCalcul} from "@/assets/js/Visualisation/Calculs/BaseCalcul.js";
import GestionnaireCourbesCalibration from "@/assets/js/Calibration/gestionCalculsCourbesCalibration.js";
import {DateTime} from "luxon";
import {arrondir8Chiffres, inverse, multiply} from "@/assets/js/Calibration/utils.js";


/**
 * =======================================================================================================================
 * Classe de correction des interférences entre traceurs
 * ======================================================================================================================
 */
export class InterferencesTraceurs extends BaseCalcul {
    constructor(controlleur) {
        super(controlleur);
        this.gestionnaireCalculs = new GestionnaireCourbesCalibration();
    }

    /**
     * Corrige les interférences entre traceurs sélectionnés et met à jour le graphique
     * @param {Array} traceurs - Liste des traceurs à corriger (1 ou 2)
     * @param {number} echelleT1 - Échelle du premier traceur
     * @param {number} echelleT2 - Échelle du second traceur
     */
    corrigerInterferences(traceurs, echelleT1, echelleT2) {
        return this.executerAvecChargement(this._effectuerCorrection, traceurs, echelleT1, echelleT2);
    }


    /**
     * Trouve la colonne dans un tableau de colonnes par différentes variations du nom
     * @private
     * @param {Array<string>} colonnes - Liste des noms de colonnes
     * @param {number} idLampe - ID de la lampe (1, 2, 3, 4)
     * @returns {number} - Index de la colonne ou -1 si non trouvé
     */
    _trouverIndexColonne(colonnes, idLampe) {
        // Recherche avec plusieurs variantes de nom possibles
        for (const format of [`L${idLampe}`, `L${idLampe}Corr`, `L${idLampe}_corr`]) {
            const index = colonnes.indexOf(format);
            if (index !== -1) return index;
        }
        return -1;
    }


    /**
     * Traitement des coefficients pour déterminer le modèle à utiliser
     * @private
     * @param {Array} coeffs - Coefficients bruts
     * @param {Object} eau - Traceur eau
     * @param {number} idLampe - ID de la lampe
     * @param {number} lampePrincipale - ID de la lampe principale
     * @param {Object} eauValeurLampeCommune - Valeur de référence de l'eau pour la lampe commune
     * @returns {Array} - Coefficients finaux traités
     */
    _traiterCoefficients(coeffs, eau, idLampe, lampePrincipale, eauValeurLampeCommune) {
        const ligneCoeffs = [];
        const countNaN = coeffs.filter(v => isNaN(v)).length;

        if (countNaN === 0) {
            // Tous les coefficients sont valides
            ligneCoeffs.push(arrondir8Chiffres(coeffs[0]));
            ligneCoeffs.push(arrondir8Chiffres(coeffs[1]));
            ligneCoeffs.push(arrondir8Chiffres(coeffs[2]));
        } else if (countNaN === 1) {
            // Un coefficient est NaN
            ligneCoeffs.push(coeffs[0]);
            ligneCoeffs.push(coeffs[1]);
        } else {
            // Plusieurs coefficients sont NaN, modèle linéaire
            ligneCoeffs.push(coeffs[0]);
            ligneCoeffs.push(eauValeurLampeCommune - coeffs[0] * eau.getDataParNom(`L${lampePrincipale}-1`));
        }

        return ligneCoeffs;
    }


    /**
     * Calcule la valeur corrigée pour une lampe commune
     * @private
     * @param {boolean} est2std - Si le modèle standard à 2 paramètres doit être utilisé
     * @param {Array} coeffsFinauxT1 - Coefficients finaux du traceur 1
     * @param {Array} coeffsFinauxT2 - Coefficients finaux du traceur 2
     * @param {Array} mvCorr - Valeurs corrigées pour les lampes principales
     * @param {number} index - Index de la mesure
     * @param {number} mVValueLampeCommune - Valeur mesurée pour la lampe commune
     * @param {Object} eau - Traceur eau
     * @param {Object} traceur1 - Premier traceur
     * @param {Object} traceur2 - Second traceur
     * @param {number|null} mvParasite - Valeur parasite calculée (optionnel)
     * @returns {number} - Valeur corrigée
     */
    _calculerValeurCorrigeeCommune(est2std, coeffsFinauxT1, coeffsFinauxT2, mvCorr, index, mVValueLampeCommune, eau, traceur1, traceur2, mvParasite = null) {
        if (est2std) {
            // Utiliser le modèle logarithmique pour les deux traceurs
            const valeurT1 = Math.exp(
                coeffsFinauxT1[1] +
                coeffsFinauxT1[0] * Math.log(mvCorr[index][0] - eau.getDataParNom(`L${traceur1.lampePrincipale}-1`))
            );
            const valeurT2 = Math.exp(
                coeffsFinauxT2[1] +
                coeffsFinauxT2[0] * Math.log(mvCorr[index][1] - eau.getDataParNom(`L${traceur2.lampePrincipale}-1`))
            );

            return mVValueLampeCommune - (valeurT1 + valeurT2);
        } else if (mvParasite !== null) {
            // Utiliser le modèle linéaire avec parasite pré-calculé
            return mVValueLampeCommune - mvParasite;
        } else {
            // Ne devrait pas arriver (fallback)
            return mVValueLampeCommune;
        }
    }


    /**
     * Méthode interne pour appliquer la correction à un seul traceur
     * @private
     * @param {Object} traceur - Traceur à corriger
     * @param {Array} lampesATraiter - Liste des IDs de lampes à traiter
     * @param {Object} eau - Traceur eau
     * @param {Array<string>} lignes - Lignes du fichier de mesures
     * @param {Array<string>} colonnes - Noms des colonnes (headers)
     */
    _appliquerCorrectionUnTraceur(traceur, lampesATraiter, eau, lignes, colonnes) {
        for (const idLampe of lampesATraiter) {
            // Récupération des coefficients de calcul
            const resultat = this.gestionnaireCalculs.effectuerCalculsCourbes(idLampe, traceur)[0].filter(v => !isNaN(v));

            if (!resultat || resultat.length === 0) continue;

            const nomColonne = `L${idLampe}Corr`;
            const indexLampePrincipale = this._trouverIndexColonne(colonnes, traceur.lampePrincipale);
            const indexLampeSecondaire = this._trouverIndexColonne(colonnes, idLampe);

            if (indexLampePrincipale === -1 || indexLampeSecondaire === -1) continue;

            const dataPoints = [];
            const dates = [];
            const valeursCorrigees = [];

            // Parcourir les données pour appliquer la correction
            for (let i = 3; i < lignes.length - 1; i++) {
                const cols = lignes[i].split(';');
                if (cols[0] === '' || cols[indexLampePrincipale] === '' || cols[indexLampeSecondaire] === '') continue;

                const dateHeure = cols[0] + '-' + cols[1];
                const mVValuePrincipale = parseFloat(cols[indexLampePrincipale].replace(/\r|\n/g, ''));
                const mVValueSecondaire = parseFloat(cols[indexLampeSecondaire].replace(/\r|\n/g, ''));
                const eauValue = parseFloat(eau.getDataParNom(`L${traceur.lampePrincipale}-1`));

                if (isNaN(mVValuePrincipale) || isNaN(mVValueSecondaire) || isNaN(eauValue)) continue;

                let valCorrigee;

                if (mVValuePrincipale > eauValue) {
                    const logValue = Math.log(mVValuePrincipale - eauValue);

                    if (resultat.length === 3) {
                        const log2Value = logValue ** 2;
                        valCorrigee = mVValueSecondaire - (Math.exp(
                            parseFloat(resultat[0]) +
                            parseFloat(resultat[1]) * logValue +
                            parseFloat(resultat[2]) * log2Value
                        ));
                    } else if (resultat.length === 2) {
                        valCorrigee = mVValueSecondaire - (Math.exp(
                            parseFloat(resultat[1]) +
                            parseFloat(resultat[0]) * logValue
                        ));
                    } else if (resultat.length === 1) {
                        valCorrigee = mVValueSecondaire - (parseFloat(resultat[0]) * (mVValuePrincipale - eauValue));
                    }
                } else {
                    valCorrigee = 0.01; // Valeur minimale par défaut
                }

                const timestamp = DateTime.fromFormat(dateHeure, 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'}).toMillis();
                dataPoints.push({x: timestamp, y: valCorrigee});
                valeursCorrigees.push(valCorrigee);
                dates.push(dateHeure);
            }

            this.controlleur.copieContenuFichierMesure = this.ajouterColonneResultat(nomColonne, valeursCorrigees, dates);
            this.mettreAJourGraphique(nomColonne, dataPoints);
        }
    }


    /**
     * Prépare la matrice X des rapports de signaux pour le calcul avec deux traceurs
     * @private
     * @param {Object} traceur1 - Premier traceur
     * @param {Object} traceur2 - Second traceur
     * @param {number} echellesT1indexOf - Index de l'échelle du premier traceur
     * @param {number} echellesT2indexOf - Index de l'échelle du second traceur
     * @param {number} echelleTraceur1 - Valeur de l'échelle du premier traceur
     * @param {number} echelleTraceur2 - Valeur de l'échelle du second traceur
     * @param {Object} eau - Traceur eau
     * @returns {Array<Array<number>>} - Matrice X
     */
    _preparerMatriceX(traceur1, traceur2, echellesT1indexOf, echellesT2indexOf, echelleTraceur1, echelleTraceur2, eau) {
        // Ligne 1: valeurs normalisées du traceur 1 pour les lampes principales des deux traceurs
        const ligne1 = [
            (traceur1.getDataParNom(`L${traceur1.lampePrincipale}-${echellesT1indexOf}`) -
             eau.getDataParNom(`L${traceur1.lampePrincipale}-1`)) / echelleTraceur1,

            (traceur1.getDataParNom(`L${traceur2.lampePrincipale}-${echellesT1indexOf}`) -
             eau.getDataParNom(`L${traceur2.lampePrincipale}-1`)) / echelleTraceur1
        ];

        // Ligne 2: valeurs normalisées du traceur 2 pour les lampes principales des deux traceurs
        const ligne2 = [
            (traceur2.getDataParNom(`L${traceur1.lampePrincipale}-${echellesT2indexOf}`) -
             eau.getDataParNom(`L${traceur1.lampePrincipale}-1`)) / echelleTraceur2,

            (traceur2.getDataParNom(`L${traceur2.lampePrincipale}-${echellesT2indexOf}`) -
             eau.getDataParNom(`L${traceur2.lampePrincipale}-1`)) / echelleTraceur2
        ];

        return [ligne1, ligne2];
    }


    /**
     * Méthode interne qui effectue réellement la correction des interférences
     * @private
     * @param {Array} traceurs - Liste des traceurs à corriger (1 ou 2)
     * @param {number} echelleT1 - Échelle du premier traceur
     * @param {number} echelleT2 - Échelle du second traceur
     */
    _effectuerCorrection(traceurs, echelleT1 = null, echelleT2 = null) {
        if (!Array.isArray(traceurs) || traceurs.length === 0) return;

        const eau = this.getTraceurParUnite('');
        if (!eau) {
            afficherMessageFlash('Traceur eau non trouvé', 'error');
            return;
        }

        const lignes = this.controlleur.copieContenuFichierMesure.split('\n');
        const colonnes = lignes[2].split(';').map(col => col.replace(/\r|\n/g, ''));
        const chart = this.getChartInstance();
        if (!chart) return;

        // Initialisation du calcul dans la session
        const parametres = {
            'nombreTraceurs': traceurs.length
        };
        traceurs.forEach((t, i) => {
            parametres[`traceur${i}`] = t.nom;
        });
        this.creerCalcul(`Correction d'interférences`, parametres);

        // Cas 1 traceur : correction sur les lampes secondaires
        if (traceurs.length === 1) {
            const traceur = traceurs[0];
            const lampesATraiter = [1, 2, 3].filter(i => i !== traceur.lampePrincipale);
            this._appliquerCorrectionUnTraceur(traceur, lampesATraiter, eau, lignes, colonnes);
        }
        // Cas 2 traceurs
        else if (traceurs.length === 2) {
            const traceur1 = traceurs[0];
            const traceur2 = traceurs[1];

            // Trouver la lampe commune non utilisée par les deux traceurs
            let lampeCommune = 0;
            for (let i = 1; i <= 3; i++) {
                if (i !== traceur1.lampePrincipale && i !== traceur2.lampePrincipale) {
                    lampeCommune = i;
                    break;
                }
            }

            if (lampeCommune === 0) {
                afficherMessageFlash('Impossible de trouver une lampe commune pour la correction', 'error');
                return;
            }

            let echelleTraceur1 = echelleT1;
            let echelleTraceur2 = echelleT2;

            // Si les échelles ne sont pas fournies, utiliser la logique existante pour les déterminer
            if (echelleTraceur1 === null) {
                echelleTraceur1 = traceur1.echelles && traceur1.echelles.length > 0 ? traceur1.echelles[0] : 1;

                if (traceur1.echelles && traceur1.echelles.length > 1 &&
                    traceur2.echelles && traceur2.echelles.length > 1) {
                    const echellesCommunes = this.controlleur.getEchelleStandardTraceur(traceur1, traceur2);
                    if (echellesCommunes && echellesCommunes.length > 0) {
                        echelleTraceur1 = echellesCommunes[0];
                    }
                }
            }

            if (echelleTraceur2 === null) {
                echelleTraceur2 = traceur2.echelles && traceur2.echelles.length > 0 ? traceur2.echelles[0] : 1;

                if (traceur1.echelles && traceur1.echelles.length > 1 &&
                    traceur2.echelles && traceur2.echelles.length > 1) {
                    const echellesCommunes = this.controlleur.getEchelleStandardTraceur(traceur1, traceur2);
                    if (echellesCommunes && echellesCommunes.length > 0) {
                        echelleTraceur2 = echellesCommunes[0];
                    }
                }
            }

            // Ajouter les échelles aux paramètres du calcul pour traçabilité
            parametres['echelleT1'] = echelleTraceur1;
            parametres['echelleT2'] = echelleTraceur2;

            const echellesT1indexOf = traceur1.echelles ? traceur1.echelles.indexOf(echelleTraceur1) + 1 : 1;
            const echellesT2indexOf = traceur2.echelles ? traceur2.echelles.indexOf(echelleTraceur2) + 1 : 1;

            // Construction de la matrice X des rapports de signaux
            const X = this._preparerMatriceX(
                traceur1, traceur2, echellesT1indexOf, echellesT2indexOf,
                echelleTraceur1, echelleTraceur2, eau
            );

            const Xinverse = inverse(X);

            // Collecter les données de mesure pour les deux lampes principales
            const indexLampe1 = this._trouverIndexColonne(colonnes, traceur1.lampePrincipale);
            const indexLampe2 = this._trouverIndexColonne(colonnes, traceur2.lampePrincipale);
            const indexLampeCommune = this._trouverIndexColonne(colonnes, lampeCommune);

            if (indexLampe1 === -1 || indexLampe2 === -1 || indexLampeCommune === -1) {
                afficherMessageFlash('Colonnes de données manquantes', 'error');
                return;
            }

            const Y = [];
            const contenu = [];
            const dates = [];

            for (let i = 3; i < lignes.length - 1; i++) {
                const cols = lignes[i].split(';');
                if (cols[indexLampe1] === '' || cols[indexLampe2] === '') continue;

                const dateHeure = cols[0] + '-' + cols[1];
                const valLampe1 = parseFloat(cols[indexLampe1].replace(/\r|\n/g, '')) -
                                  eau.getDataParNom(`L${traceur1.lampePrincipale}-1`);
                const valLampe2 = parseFloat(cols[indexLampe2].replace(/\r|\n/g, '')) -
                                  eau.getDataParNom(`L${traceur2.lampePrincipale}-1`);

                const ligneContenu = [valLampe1, valLampe2];
                const ligneY = [
                    valLampe1 * X[0][0],
                    valLampe2 * X[1][1]
                ];

                contenu.push(ligneContenu);
                Y.push(ligneY);
                dates.push(dateHeure);
            }

            const A = contenu.map(ligne => {
                const resultat = multiply([ligne], Xinverse);
                return [resultat[0][0], resultat[0][1]];
            });

            // Valeurs corrigées des lampes principales
            const mvCorr = A.map((ligne, i) => [
                ligne[0] * X[0][0] + eau.getDataParNom(`L${traceur1.lampePrincipale}-1`),
                ligne[1] * X[1][1] + eau.getDataParNom(`L${traceur2.lampePrincipale}-1`)
            ]);

            const coeffsT1 = this.gestionnaireCalculs.effectuerCalculsCourbes(lampeCommune, traceur1);
            const coeffsT2 = this.gestionnaireCalculs.effectuerCalculsCourbes(lampeCommune, traceur2);

            const eauValeurLampeCommune = eau.getDataParNom(`L${lampeCommune}-1`);

            // Traitement des coefficients et détermination du modèle à utiliser
            const totalCoeffs = [];
            let est2std = false;

            for (let i = 0; i < 2; i++) {
                const resultat = i === 0 ? coeffsT1[0] : coeffsT2[0];
                const countNaN = resultat.filter(v => isNaN(v)).length;

                if (countNaN < 2) {
                    est2std = true;
                }

                const lampePrincipale = i === 0 ? traceur1.lampePrincipale : traceur2.lampePrincipale;
                const coeffsFinaux = this._traiterCoefficients(
                    resultat, eau, lampeCommune, lampePrincipale, eauValeurLampeCommune
                );

                totalCoeffs.push(coeffsFinaux);
            }

            const coeffsFinauxT1 = totalCoeffs[0];
            const coeffsFinauxT2 = totalCoeffs[1];

            const mvParasite = mvCorr.map((ligne, i) =>
                (coeffsFinauxT1[0] * ligne[0] + coeffsFinauxT1[1] - eauValeurLampeCommune) +
                (coeffsFinauxT2[0] * ligne[1] + coeffsFinauxT2[1] - eauValeurLampeCommune)
            );

            // Préparation des datasets pour le graphique
            const dataPoints = [];
            const dataPointsT1 = [];
            const dataPointsT2 = [];

            const valeursLampeCommune = dates.map(date => {
                const indexLigne = lignes.findIndex(ligne => ligne.includes(date.replace('-', ';')));
                if (indexLigne === -1) return NaN;

                const cols = lignes[indexLigne].split(';');
                return cols[indexLampeCommune] !== '' ?
                    parseFloat(cols[indexLampeCommune].replace(/\r|\n/g, '')) : NaN;
            });

            // Supprimer les colonnes corrigées existantes avant d'en ajouter de nouvelles
            let lignesModifiees = [...lignes];
            let header = lignesModifiees[2].replace(/\r|\n/g, '').split(';');

            // Filtrer et retirer les colonnes déjà corrigées
            header = header.filter(colonne =>
                colonne !== `L${lampeCommune}Corr` &&
                colonne !== `L${traceur1.lampePrincipale}Corr` &&
                colonne !== `L${traceur2.lampePrincipale}Corr`
            );

            header.push(`L${traceur1.lampePrincipale}Corr`);
            header.push(`L${traceur2.lampePrincipale}Corr`);
            header.push(`L${lampeCommune}Corr`);
            lignesModifiees[2] = header.join(';');

            // Calcul et ajout des valeurs corrigées pour chaque ligne
            for (let i = 0; i < dates.length; i++) {
                const date = dates[i];
                const indexLigne = lignes.findIndex(ligne => ligne.includes(date.replace('-', ';')));

                if (indexLigne === -1) continue;

                const timestamp = DateTime.fromFormat(date, 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'}).toMillis();
                const mVValueLampeCommune = valeursLampeCommune[i];

                if (isNaN(mVValueLampeCommune)) continue;

                dataPointsT1.push({x: timestamp, y: mvCorr[i][0]});
                dataPointsT2.push({x: timestamp, y: mvCorr[i][1]});

                // Calculer la valeur corrigée pour la lampe commune
                const valeurLc = this._calculerValeurCorrigeeCommune(
                    est2std,
                    coeffsFinauxT1,
                    coeffsFinauxT2,
                    mvCorr,
                    i,
                    mVValueLampeCommune,
                    eau,
                    traceur1,
                    traceur2,
                    mvParasite[i]
                );

                dataPoints.push({x: timestamp, y: valeurLc});

                // Mettre à jour la ligne avec les valeurs corrigées
                lignesModifiees[indexLigne] = lignesModifiees[indexLigne].replace(/\r|\n/g, '') +
                    `;${arrondirA2Decimales(mvCorr[i][0])}` +
                    `;${arrondirA2Decimales(mvCorr[i][1])}` +
                    `;${arrondirA2Decimales(valeurLc)}`;
            }

            // Mise à jour du contenu du fichier et du graphique
            this.controlleur.copieContenuFichierMesure = lignesModifiees.join('\n');
            this.mettreAJourGraphique(`L${traceur1.lampePrincipale}Corr`, dataPointsT1);
            this.mettreAJourGraphique(`L${traceur2.lampePrincipale}Corr`, dataPointsT2);
            this.mettreAJourGraphique(`L${lampeCommune}Corr`, dataPoints);
        } else {
            afficherMessageFlash('Correction d\'interférences pour plus de 2 traceurs non implémentée.', 'info');
        }
    }
}
