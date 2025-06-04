/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 * Lecteur pour les fichiers MV
 */
import { LecteurFichierVisualisation } from './LecteurFichierVisualisation.js';
import {around, getDateAujourdhui, getDateHeure, getTimeFromMV} from "@/assets/js/Common/utils.js";


/**
 * ======================================================================================================================
 * Classe pour la lecture de fichiers MV
 * =====================================================================================================================
 */
export class LecteurFichierMV extends LecteurFichierVisualisation {

    /**
     * Lit le fichier MV
     * @returns {Promise<unknown>} une promesse qui résout le contenu du fichier en format CSV
     */
    async lireFichier() {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const donnees = e.target.result;
                    const texteFinal = this.convertirDonneesToCSV(donnees);
                    this.extraireInfosCSV(texteFinal);
                    resolve(texteFinal);
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = reject;
            reader.readAsText(this.fichier);
        });
    }


    /**
     * Convertit les données du fichier MV en format CSV
     * @param donnees {string} les données du fichier MV
     * @returns {string} le contenu formaté en CSV
     */
    convertirDonneesToCSV(donnees) {
        const lignes = donnees.split('\n');
        const colonnes = lignes[2].split(/\s+/).splice(4);
        let texteFinal = '';
        texteFinal += `                   FluoGraphiX - Export du ${getDateAujourdhui()} - Signaux en mV\n`;
        texteFinal += '                           -------------------------------------------\n';
        texteFinal += this.getLabelsColonnes(colonnes).join(';') + '\n';
        for (let i = 3; i < lignes.length; i++) {
            if (lignes[i].length < 3 || /^\s+$/.test(lignes[i]) || /^\t+$/.test(lignes[i])) continue;
            const colonnesLigne = lignes[i].split(/\s+/);
            if (colonnesLigne[0] !== '') colonnesLigne.splice(0, 0, '');
            const timeValue = colonnesLigne[2];
            let ligne = `${getDateHeure(getTimeFromMV(timeValue))[0]};${getDateHeure(getTimeFromMV(timeValue))[1]}`;
            for (let j = 4; j < colonnesLigne.length; j++) {
                if (around(colonnesLigne[j]) !== '') {
                    ligne += `;${around(colonnesLigne[j])}`;
                }
            }
            ligne += '\n';
            texteFinal += ligne;
        }
        return texteFinal;
    }


    /**
     * Extrait les informations du CSV pour la visualisation
     * @param ligneColonne {string[]} les colonnes de la ligne
     * @returns {string[]} les labels des colonnes
     */
    getLabelsColonnes(ligneColonne) {
        let labels = ['Date', 'Time'];
        let label = '';
        for (let i = 0; i < ligneColonne.length; i++) {
            if (ligneColonne[i].length > 1) {
                if (label !== '') labels.push(label);
                label = ligneColonne[i];
            } else {
                if (ligneColonne[i] === 'T') {
                    labels.push(label);
                    label = 'Conductiv';
                    labels.push('T[°C]');
                } else {
                    label += ligneColonne[i];
                }
            }
        }
        return labels;
    }
}
