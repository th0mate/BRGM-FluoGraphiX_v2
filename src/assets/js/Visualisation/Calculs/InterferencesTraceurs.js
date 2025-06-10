/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 * Gère la correction des interférences entre traceurs
 */
import {afficherMessageFlash} from "@/assets/js/Common/utils.js";
import {BaseCalcul} from "@/assets/js/Visualisation/Calculs/BaseCalcul.js";


/**
 * =======================================================================================================================
 * Classe de correction des interférences entre traceurs
 * ======================================================================================================================
 */
export class InterferencesTraceurs extends BaseCalcul {
    constructor(controlleur) {
        super(controlleur);
    }


    /**
     * Corrige les interférences entre traceurs sélectionnés et met à jour le graphique
     * @param {Array} traceurs - Liste des traceurs à corriger (1 ou 2)
     */
    corrigerInterferences(traceurs) {
        if (!Array.isArray(traceurs) || traceurs.length === 0) return;
        const eau = this.getTraceurParUnite('');
        const lignes = this.controlleur.contenuFichierMesures.split('\n');
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
            const lampesATraiter = [1, 2, 3, 4].filter(i => i !== traceur.lampePrincipale && i !== 4);
            lampesATraiter.forEach((idLampe, idx) => {
                const resultat = this.controlleur.effectuerCalculsCourbes(idLampe, traceur)[0].filter(v => !isNaN(v));
                const dataPoints = [];

                for (let i = 3; i < lignes.length - 1; i++) {
                    const cols = lignes[i].split(';');
                    if (cols[0] !== '') {
                        const dateHeure = cols[0] + '-' + cols[1];
                        const indexPrincipal = colonnes.indexOf(`L${traceur.lampePrincipale}`);
                        const indexSecondaire = colonnes.indexOf(`L${idLampe}`);

                        if (indexPrincipal !== -1 && indexSecondaire !== -1 &&
                            cols[indexPrincipal] !== '' && cols[indexSecondaire] !== '') {

                            const valPrincipale = parseFloat(cols[indexPrincipal]);
                            const valSecondaire = parseFloat(cols[indexSecondaire]);
                            const eauValeur = eau.getDataParNom(`L${idLampe}-1`) || 0;

                            let valCorrigee;
                            if (resultat.length === 3) {
                                valCorrigee = valSecondaire - (resultat[0] + resultat[1] * valPrincipale + resultat[2] * Math.pow(valPrincipale, 2));
                            } else if (resultat.length === 2) {
                                valCorrigee = valSecondaire - (resultat[0] + resultat[1] * valPrincipale);
                            } else {
                                valCorrigee = valSecondaire - resultat[0];
                            }

                            valCorrigee = valCorrigee + eauValeur;

                            const timeDate = this.controlleur.DateTime.fromFormat(dateHeure, 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'});
                            const timestamp = timeDate.toMillis();

                            dataPoints.push({x: timestamp, y: valCorrigee});
                        }
                    }
                }

                this.mettreAJourGraphique(`L${idLampe}Corr`, dataPoints);
            });
        }
        else if (traceurs.length === 2) {
            afficherMessageFlash('Correction d\'interférences pour 2 traceurs en cours d\'implémentation.', 'info');

            // TODO: Implémentation de la correction pour 2 traceurs
        }
    }
}
