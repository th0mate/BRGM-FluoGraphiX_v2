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

            for (let idx = 0; idx < lampesATraiter.length; idx++) {
                const idLampe = lampesATraiter[idx];
                // Récupération des coefficients de calcul
                const resultat = this.gestionnaireCalculs.effectuerCalculsCourbes(idLampe, traceur)[0].filter(v => !isNaN(v));

                if (!resultat || resultat.length === 0) {
                    continue;
                }

                const nomColonne = `L${idLampe}Corr`;
                const indexLampePrincipale = colonnes.indexOf(`L${traceur.lampePrincipale}`);
                const indexLampeSecondaire = colonnes.indexOf(`L${idLampe}`);

                if (indexLampePrincipale === -1 || indexLampeSecondaire === -1) {
                    continue;
                }

                const dataPoints = [];
                const dates = [];
                const valeursCorrigees = [];

                // Parcourir les données pour appliquer la correction
                for (let i = 3; i < lignes.length - 1; i++) {
                    const cols = lignes[i].split(';');
                    if (cols[0] === '' || cols[indexLampePrincipale] === '' || cols[indexLampeSecondaire] === '') {
                        continue;
                    }

                    const dateHeure = cols[0] + '-' + cols[1];
                    const mVValuePrincipale = parseFloat(cols[indexLampePrincipale].replace(/\r|\n/g, ''));
                    const mVValueSecondaire = parseFloat(cols[indexLampeSecondaire].replace(/\r|\n/g, ''));
                    const eauValue = parseFloat(eau.getDataParNom(`L${traceur.lampePrincipale}-1`));

                    if (isNaN(mVValuePrincipale) || isNaN(mVValueSecondaire) || isNaN(eauValue)) {
                        continue;
                    }

                    let valCorrigee;

                    if (mVValuePrincipale > eauValue) {
                        const logValue = Math.log(mVValuePrincipale - eauValue);

                        if (resultat.length === 3) {
                            const log2Value = logValue ** 2;
                            valCorrigee = mVValueSecondaire - (Math.exp(parseFloat(resultat[0]) + parseFloat(resultat[1]) * logValue + parseFloat(resultat[2]) * log2Value));
                        } else if (resultat.length === 2) {
                            valCorrigee = mVValueSecondaire - (Math.exp(parseFloat(resultat[1]) + parseFloat(resultat[0]) * logValue));
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

                if (traceur1.echelles && traceur1.echelles.length > 1 && traceur2.echelles && traceur2.echelles.length > 1) {
                    const echellesCommunes = this.controlleur.getEchelleStandardTraceur(traceur1, traceur2);
                    if (echellesCommunes && echellesCommunes.length > 0) {
                        echelleTraceur1 = echellesCommunes[0];
                    }
                }
            }

            if (echelleTraceur2 === null) {
                echelleTraceur2 = traceur2.echelles && traceur2.echelles.length > 0 ? traceur2.echelles[0] : 1;

                if (traceur1.echelles && traceur1.echelles.length > 1 && traceur2.echelles && traceur2.echelles.length > 1) {
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
            const X = [];

            const ligne1 = [
                (traceur1.getDataParNom(`L${traceur1.lampePrincipale}-${echellesT1indexOf}`) - eau.getDataParNom(`L${traceur1.lampePrincipale}-1`)) / echelleTraceur1,
                (traceur1.getDataParNom(`L${traceur2.lampePrincipale}-${echellesT1indexOf}`) - eau.getDataParNom(`L${traceur2.lampePrincipale}-1`)) / echelleTraceur1
            ];

            const ligne2 = [
                (traceur2.getDataParNom(`L${traceur1.lampePrincipale}-${echellesT2indexOf}`) - eau.getDataParNom(`L${traceur1.lampePrincipale}-1`)) / echelleTraceur2,
                (traceur2.getDataParNom(`L${traceur2.lampePrincipale}-${echellesT2indexOf}`) - eau.getDataParNom(`L${traceur2.lampePrincipale}-1`)) / echelleTraceur2
            ];

            X.push(ligne1);
            X.push(ligne2);

            const Xinverse = inverse(X);

            let indexLampe1 = -1;
            let indexLampe2 = -1;

            for (let j = 0; j < colonnes.length; j++) {
                if (colonnes[j] === `L${traceur1.lampePrincipale}`) {
                    indexLampe1 = j;
                }
                if (colonnes[j] === `L${traceur2.lampePrincipale}`) {
                    indexLampe2 = j;
                }
            }

            // Si déjà corrigées, chercher avec le suffixe Corr
            for (let j = 0; j < colonnes.length; j++) {
                if (colonnes[j] === `L${traceur1.lampePrincipale}Corr`) {
                    indexLampe1 = j;
                }
                if (colonnes[j] === `L${traceur2.lampePrincipale}Corr`) {
                    indexLampe2 = j;
                }
            }

            for (let j = 0; j < colonnes.length; j++) {
                if (colonnes[j] === `L${traceur1.lampePrincipale}_corr`) {
                    indexLampe1 = j;
                }
                if (colonnes[j] === `L${traceur2.lampePrincipale}_corr`) {
                    indexLampe2 = j;
                }
            }

            if (indexLampe1 === -1 || indexLampe2 === -1) {
                afficherMessageFlash('Colonnes de données manquantes', 'error');
                return;
            }

            // Indice de la lampe commune
            let indexLampeCommune = -1;
            for (let j = 0; j < colonnes.length; j++) {
                if (colonnes[j] === `L${lampeCommune}`) {
                    indexLampeCommune = j;
                    break;
                }
            }

            // Vérifier aussi L{lampeCommune}Corr
            if (indexLampeCommune === -1) {
                for (let j = 0; j < colonnes.length; j++) {
                    if (colonnes[j] === `L${lampeCommune}Corr`) {
                        indexLampeCommune = j;
                        break;
                    }
                }
            }

            if (indexLampeCommune === -1) {
                afficherMessageFlash(`Colonne L${lampeCommune} manquante`, 'error');
                return;
            }

            const Y = [];
            const contenu = [];
            const dates = [];

            // Recueillir les mesures aux lampes principales
            for (let i = 3; i < lignes.length - 1; i++) {
                const cols = lignes[i].split(';');
                if (cols[indexLampe1] !== '' && cols[indexLampe2] !== '') {
                    const ligneContenu = [];
                    const ligneY = [];
                    const dateHeure = cols[0] + '-' + cols[1];

                    const valLampe1 = parseFloat(cols[indexLampe1].replace(/\r|\n/g, '')) - eau.getDataParNom(`L${traceur1.lampePrincipale}-1`);
                    const valLampe2 = parseFloat(cols[indexLampe2].replace(/\r|\n/g, '')) - eau.getDataParNom(`L${traceur2.lampePrincipale}-1`);

                    ligneContenu.push(valLampe1);
                    ligneContenu.push(valLampe2);

                    // Calculer Y comme dans le code original
                    ligneY.push(valLampe1 * X[0][0]);
                    ligneY.push(valLampe2 * X[1][1]);

                    contenu.push(ligneContenu);
                    Y.push(ligneY);
                    dates.push(dateHeure);
                }
            }

            // Calcul des contributions individuelles A de chaque traceur
            const A = [];
            for (let i = 0; i < Y.length; i++) {
                const ligne = [];
                const resultat = multiply([contenu[i]], Xinverse);
                ligne.push(resultat[0][0]);
                ligne.push(resultat[0][1]);
                A.push(ligne);
            }

            // Valeurs corrigées des lampes principales
            const mvCorr = [];
            for (let i = 0; i < Y.length; i++) {
                const ligne = [];
                ligne.push(A[i][0] * X[0][0] + eau.getDataParNom(`L${traceur1.lampePrincipale}-1`));
                ligne.push(A[i][1] * X[1][1] + eau.getDataParNom(`L${traceur2.lampePrincipale}-1`));
                mvCorr.push(ligne);
            }

            // Calculer les coefficients pour la lampe commune
            const coeffsT1 = this.gestionnaireCalculs.effectuerCalculsCourbes(lampeCommune, traceur1);
            const coeffsT2 = this.gestionnaireCalculs.effectuerCalculsCourbes(lampeCommune, traceur2);
            const tousCoeffs = [coeffsT1, coeffsT2];

            const eauValeurLampeCommune = eau.getDataParNom(`L${lampeCommune}-1`);

            const totalCoeffs = [];
            const totalNaN = [];
            let est2std = false;

            for (let i = 0; i < 2; i++) {
                const resultat = tousCoeffs[i];
                const ligneCoeffs = [];

                let countNaN = 0;
                for (let j = 0; j < resultat[0].length; j++) {
                    if (isNaN(resultat[0][j])) {
                        countNaN++;
                    }
                }

                if (countNaN < 2) {
                    est2std = true;
                }

                totalNaN.push(countNaN);

                if (countNaN === 0) {
                    ligneCoeffs.push(arrondir8Chiffres(resultat[0][0]));
                    ligneCoeffs.push(arrondir8Chiffres(resultat[0][1]));
                    ligneCoeffs.push(arrondir8Chiffres(resultat[0][2]));
                } else if (countNaN === 1) {
                    ligneCoeffs.push(resultat[0][0]);
                    ligneCoeffs.push(resultat[0][1]);
                } else {
                    ligneCoeffs.push(resultat[0][0]);
                    ligneCoeffs.push(eauValeurLampeCommune - resultat[0][0] * eau.getDataParNom(`L${traceurs[i].lampePrincipale}-1`));
                }
                totalCoeffs.push(ligneCoeffs);
            }

            const coeffsFinauxT1 = totalCoeffs[0];
            const coeffsFinauxT2 = totalCoeffs[1];

            // Calcul des valeurs parasites (contribution de chaque traceur sur la lampe commune)
            const mvParasite = [];
            for (let i = 0; i < mvCorr.length; i++) {
                mvParasite.push(
                    (coeffsFinauxT1[0] * mvCorr[i][0] + coeffsFinauxT1[1] - eauValeurLampeCommune) +
                    (coeffsFinauxT2[0] * mvCorr[i][1] + coeffsFinauxT2[1] - eauValeurLampeCommune)
                );
            }

            // Préparation des datasets pour le graphique
            const dataPoints = [];
            const dataPointsT1 = [];
            const dataPointsT2 = [];

            const valeursLampeCommune = [];
            for (let i = 0; i < dates.length; i++) {
                const date = dates[i];
                const indexLigne = lignes.findIndex(ligne => ligne.includes(date.replace('-', ';')));

                if (indexLigne === -1) continue;

                const cols = lignes[indexLigne].split(';');
                if (cols[indexLampeCommune] !== '') {
                    valeursLampeCommune.push(parseFloat(cols[indexLampeCommune].replace(/\r|\n/g, '')));
                } else {
                    valeursLampeCommune.push(NaN);
                }
            }

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

            for (let i = 0; i < dates.length; i++) {
                const date = dates[i];
                const indexLigne = lignes.findIndex(ligne => ligne.includes(date.replace('-', ';')));

                if (indexLigne === -1) continue;

                const timestamp = DateTime.fromFormat(date, 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'}).toMillis();
                const mVValueLampeCommune = valeursLampeCommune[i];

                if (isNaN(mVValueLampeCommune)) continue;

                dataPointsT1.push({x: timestamp, y: mvCorr[i][0]});
                dataPointsT2.push({x: timestamp, y: mvCorr[i][1]});

                let valeurLc;

                if (est2std) {
                    const valeurT1 = Math.exp(
                        coeffsFinauxT1[1] +
                        coeffsFinauxT1[0] * Math.log(mvCorr[i][0] - eau.getDataParNom(`L${traceur1.lampePrincipale}-1`))
                    );
                    const valeurT2 = Math.exp(
                        coeffsFinauxT2[1] +
                        coeffsFinauxT2[0] * Math.log(mvCorr[i][1] - eau.getDataParNom(`L${traceur2.lampePrincipale}-1`))
                    );

                    valeurLc = mVValueLampeCommune - (valeurT1 + valeurT2);
                } else {
                    valeurLc = mVValueLampeCommune - mvParasite[i];
                }

                dataPoints.push({x: timestamp, y: valeurLc});

                lignesModifiees[indexLigne] = lignesModifiees[indexLigne].replace(/\r|\n/g, '');
                lignesModifiees[indexLigne] += `;${arrondirA2Decimales(mvCorr[i][0])}`;
                lignesModifiees[indexLigne] += `;${arrondirA2Decimales(mvCorr[i][1])}`;
                lignesModifiees[indexLigne] += `;${arrondirA2Decimales(valeurLc)}`;
            }

            this.controlleur.copieContenuFichierMesure = lignesModifiees.join('\n');

            this.mettreAJourGraphique(`L${traceur1.lampePrincipale}Corr`, dataPointsT1);
            this.mettreAJourGraphique(`L${traceur2.lampePrincipale}Corr`, dataPointsT2);
            this.mettreAJourGraphique(`L${lampeCommune}Corr`, dataPoints);
        } else {
            afficherMessageFlash('Correction d\'interférences pour plus de 2 traceurs non implémentée.', 'info');
        }
    }
}
