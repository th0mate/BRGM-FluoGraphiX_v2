// InterferencesTraceurs.js
// Gère la correction des interférences entre traceurs

import {afficherMessageFlash} from "@/assets/js/Common/utils.js";

export class InterferencesTraceurs {
    constructor(controlleur) {
        this.controlleur = controlleur;
    }
    /**
     * Corrige les interférences entre traceurs sélectionnés et met à jour le graphique
     * @param {Array} traceurs - Liste des traceurs à corriger (1 ou 2)
     */
    corrigerInterferences(traceurs) {
        if (!Array.isArray(traceurs) || traceurs.length === 0) return;
        const eau = this.controlleur.traceurs.find(t => t.unite === '');
        const lignes = this.controlleur.contenuFichierMesures.split('\n');
        const colonnes = lignes[2].split(';').map(col => col.replace(/\r|\n/g, ''));
        const chart = this.controlleur.getChartInstance();
        if (!chart) return;

        // Ajout du calcul dans la liste des calculs
        const calcul = new this.controlleur.Calculs(`Correction d'interférences`, 'oui');
        calcul.ajouterParametreCalcul('nombreTraceurs', traceurs.length);
        traceurs.forEach((t, i) => calcul.ajouterParametreCalcul(`traceur${i}`, t.nom));
        this.controlleur.listeCalculs = this.controlleur.listeCalculs.filter(c => c.nom !== calcul.nom);
        this.controlleur.listeCalculs.push(calcul);

        // Cas 1 traceur : correction sur les lampes secondaires
        if (traceurs.length === 1) {
            const traceur = traceurs[0];
            const lampesATraiter = [1, 2, 3, 4].filter(i => i !== traceur.lampePrincipale && i !== 4);
            lampesATraiter.forEach((idLampe, idx) => {
                const resultat = this.controlleur.effectuerCalculsCourbes(idLampe, traceur)[0].filter(v => !isNaN(v));
                const data = {
                    label: `L${idLampe}Corr`,
                    data: [],
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    borderColor: this.controlleur.getRandomColor(),
                    borderWidth: 2,
                    pointRadius: 0
                };
                let indexLampeATraiter = colonnes.indexOf(`L${idLampe}`);
                let indexLampePrincipale = colonnes.indexOf(`L${traceur.lampePrincipale}`);
                if (indexLampeATraiter === -1 || indexLampePrincipale === -1) return;
                let contenu = [];
                for (let i = 3; i < lignes.length - 1; i++) {
                    const cols = lignes[i].split(';');
                    if (cols[indexLampeATraiter] !== '' && cols[indexLampePrincipale] !== '') {
                        contenu.push([
                            cols[0] + '-' + cols[1],
                            cols[indexLampePrincipale].replace(/\r|\n/g, ''),
                            cols[indexLampeATraiter].replace(/\r|\n/g, '')
                        ]);
                    }
                }
                let header = lignes[2].replace(/\r|\n/g, '').split(';');
                let newLignes = this.controlleur.supprimerColonneParEnTete(`L${idLampe}Corr`, lignes);
                header = header.filter(colonne => colonne !== `L${idLampe}Corr`);
                header.push(`L${idLampe}Corr`);
                newLignes[2] = header.join(';');
                for (let k = 0; k < contenu.length; k++) {
                    const timestamp = this.controlleur.DateTime.fromFormat(contenu[k][0], 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'}).toMillis();
                    const mVValueLampeTraceur1 = contenu[k][1];
                    const mVValueLampeATraiter = contenu[k][2];
                    let valeur = 0.01;
                    if (!isNaN(mVValueLampeTraceur1)) {
                        const eauValue = parseFloat(eau.getDataParNom('L' + traceur.lampePrincipale + '-1'));
                        if (!isNaN(eauValue) && mVValueLampeTraceur1 > eauValue) {
                            const logValue = Math.log(mVValueLampeTraceur1 - eauValue);
                            if (resultat.length === 3) {
                                const log2Value = logValue ** 2;
                                valeur = mVValueLampeATraiter - (Math.exp(parseFloat(resultat[0]) + parseFloat(resultat[1]) * logValue + parseFloat(resultat[2]) * log2Value));
                            } else if (resultat.length === 2) {
                                valeur = mVValueLampeATraiter - (Math.exp(parseFloat(resultat[1]) + parseFloat(resultat[0]) * logValue));
                            } else if (resultat.length === 1) {
                                valeur = mVValueLampeATraiter - (parseFloat(resultat[0]) * (mVValueLampeTraceur1 - eauValue));
                            }
                        }
                    }
                    data.data.push({x: timestamp, y: valeur});
                    newLignes[k + 3] = newLignes[k + 3].replace(/\r|\n/g, '');
                    newLignes[k + 3] += `;${this.controlleur.arrondirA2Decimales(valeur)}`;
                }
                this.controlleur.contenuFichierMesures = newLignes.join('\n');
                chart.data.datasets = chart.data.datasets.filter(dataset => dataset.label !== `L${idLampe}Corr`);
                chart.data.datasets.push(data);
            });
            chart.update();
        }
        // Cas 2 traceurs : correction croisée (voir legacy pour détails)
        else if (traceurs.length === 2) {
            // ...implémentation à compléter selon le legacy (voir calculs de matrices, etc.)
            // Pour l’instant, on affiche un message d’info
            afficherMessageFlash('Correction interférences à 2 traceurs : fonctionnalité à compléter.', 'info');
        }
    }
}
