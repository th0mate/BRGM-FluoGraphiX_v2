/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 * Lecteur pour les fichiers TXT
 */
import { LecteurFichierVisualisation } from './LecteurFichierVisualisation.js';
import {around, getDateAujourdhui, getDateHeure, getTime} from "@/assets/js/Common/utils.js";


/**
 * ======================================================================================================================
 * Lecteur pour les fichiers TXT
 * =====================================================================================================================
 */
export class LecteurFichierTXT extends LecteurFichierVisualisation {


    /**
     * Lit le fichier TXT
     * @returns {Promise<unknown>} une promesse qui résout le contenu du fichier TXT converti en CSV
     */
    async lireFichier() {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const texte = e.target.result;
                    const csv = this.convertirDonneesToCSV(texte);
                    this.extraireInfosCSV(csv);
                    resolve(csv);
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = reject;
            reader.readAsText(this.fichier);
        });
    }


    /**
     * Convertit les données du fichier TXT en format CSV
     * @param texte {string} le contenu du fichier TXT
     * @returns {string} le contenu converti en format CSV
     */
    convertirDonneesToCSV(texte) {
        const lignes = texte.split('\n');
        let stringFinal = '';
        stringFinal += `                   FluoGraphiX - Export du ${getDateAujourdhui()} - Signaux en mV\n`;
        stringFinal += '                           -------------------------------------------\n';
        const colonnes = lignes[0].split('\t');
        let header = 'Date;Time';
        let indicesColonnesValides = [];
        for (let i = 0; i < colonnes.length; i++) {
            if (lignes[1].split('\t')[i] !== undefined && !isNaN(lignes[1].split('\t')[i]) && colonnes[i] !== 'Timestamp') {
                if (colonnes[i] === 'T [�C]') {
                    header += ';T';
                } else {
                    header += `;${colonnes[i]}`;
                }
                indicesColonnesValides.push(i);
            }
        }
        indicesColonnesValides = indicesColonnesValides.filter(e => e !== 56);
        stringFinal += header + '\n';
        for (let i = 1; i < lignes.length; i++) {
            if (lignes[i].length < 3 || /^\s+$/.test(lignes[i]) || /^\t+$/.test(lignes[i])) continue;
            const colonnes = lignes[i].split('\t');
            const timeValue = lignes[i].substring(3, 32);
            if (getTime(timeValue) === 'NaN/NaN/N-NaN:NaN:NaN') continue;
            let line = `${getDateHeure(getTime(timeValue))[0]};${getDateHeure(getTime(timeValue))[1]}`;
            for (let j = 0; j < indicesColonnesValides.length; j++) {
                line += `;${around(colonnes[indicesColonnesValides[j]])}`;
            }
            stringFinal += line + '\n';
        }
        return stringFinal;
    }
}
