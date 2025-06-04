import { LecteurFichierVisualisation } from './LecteurFichierVisualisation.js';
import {around, getDateAujourdhui, getDateHeure, getTime} from "@/assets/js/Common/utils.js";

// Lecteur pour les fichiers XML
export class LecteurFichierXML extends LecteurFichierVisualisation {

    async lireFichier() {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const xmlString = e.target.result;
                    const csv = this.convertirDonneesToCSV(xmlString);
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


    chargerXML(xmlString) {
        const parser = new DOMParser();
        try {
            const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
            const errors = xmlDoc.querySelectorAll('parsererror');
            if (errors.length > 0) {
                // afficherMessageFlash("Erreur lors du chargement du fichier XML", 'danger');
                return null;
            }
            return xmlDoc;
        } catch (error) {
            // afficherMessageFlash("Erreur lors du chargement du fichier XML", 'danger');
            return null;
        }
    }


    convertirDonneesToCSV(xmlString) {
        const xmlDoc = this.chargerXML(xmlString);
        if (!xmlDoc) return '';
        const times = xmlDoc.querySelectorAll('time');
        let contenuFinal = '';
        contenuFinal += `                   FluoGraphiX - Export du ${getDateAujourdhui()} - Signaux en mV\n`;
        contenuFinal += '                           -------------------------------------------\n';
        if (times.length > 0) {
            const firstTimeChildren = times[0].children;
            let header = 'Date;Time';
            for (let i = 0; i < firstTimeChildren.length; i++) {
                header += `;${firstTimeChildren[i].tagName.toUpperCase()}`;
            }
            contenuFinal += header + '\n';
        }
        for (let i = 0; i < times.length; i++) {
            const time = times[i];
            const timeValue = time.getAttribute('iso');
            if (getTime(timeValue) === 'NaN/NaN/N-NaN:NaN:NaN') continue;
            let line = `${getDateHeure(getTime(timeValue))[0]};${getDateHeure(getTime(timeValue))[1]}`;
            for (let j = 0; j < time.children.length; j++) {
                const child = time.children[j];
                line += `;${around(child.getAttribute('v'))}`;
            }
            contenuFinal += line + '\n';
        }
        return contenuFinal;
    }
}
