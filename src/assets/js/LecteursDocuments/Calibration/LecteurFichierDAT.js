/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 * Permet de lire les fichiers de calibration DAT et d'en extraire les informations nécessaires. Héritée de LecteurFichierCalibration.
 */
import LecteurFichierCalibration from '@/assets/js/LecteursDocuments/Calibration/LecteurFichierCalibration.js';
import Traceur from '@/assets/js/Objects/Traceur.js';
import Session from "@/assets/js/Session/Session.js";
import {getDateAujourdhui} from "@/assets/js/Common/utils.js";


/**
 * ======================================================================================================================
 * Classe spécialisée pour la lecture des fichiers de calibration au format DAT
 * =====================================================================================================================
 */
export default class LecteurFichierDAT extends LecteurFichierCalibration {


    /**
     * Extrait les sections du fichier DAT
     * @returns {Array<string>} Les sections extraites
     */
    extraireSections() {
        const sections = [];
        let section = '';

        for (let i = 0; i < this.lignes.length; i++) {
            if (this.lignes[i].startsWith('----------------')) {
                sections.push(section);
                section = '';
            } else {
                section += this.lignes[i] + '\n';
            }
        }

        return sections;
    }


    /**
     * Extrait les noms des traceurs du fichier DAT
     * @returns {Array<string>} Les noms des traceurs
     */
    extraireNomsTraceurs() {
        const noms = [];

        for (let i = 0; i < 3; i++) {
            if (this.sections[i]) {
                const premiereLigne = this.sections[i].split('\n')[0];
                if (premiereLigne) {
                    const parties = premiereLigne.split(' ');
                    if (parties.length > 1) {
                        noms.push(parties.slice(1).join(' '));
                    }
                }
            }
        }

        return noms;
    }


    /**
     * Extrait le numéro du fluorimètre du fichier DAT
     * @returns {string} Le numéro du fluorimètre
     */
    extraireNumeroFluorimetre() {
        if (this.lignes.length > 0) {
            const premiereLigne = this.lignes[0];
            const index = premiereLigne.indexOf('#');
            if (index !== -1) {
                return premiereLigne.substring(index + 1).trim();
            }
        }

        return '';
    }


    /**
     * Extrait la date de calibration du fichier DAT
     * @returns {string} La date de calibration au format jj/mm/aa
     */
    extraireDateCalibration() {
        if (this.sections.length > 0) {
            const section = this.sections[0].split('\n');
            if (section.length > 2) {
                const dateParts = section[2].split(': ');
                if (dateParts.length > 1) {
                    const date = dateParts[1];
                    const jour = date.substring(4, 6);
                    const mois = date.substring(2, 4);
                    const annee = date.substring(0, 2);
                    return jour + '/' + mois + '/' + annee;
                }
            }
        }

        return '';
    }


    /**
     * Crée les objets Traceur à partir des données du fichier DAT
     */
    creerTraceurs() {
        Session.getInstance().traceurs = [];

        // Création des traceurs principaux
        for (let i = 1; i <= 4; i++) {
            if (this.sections.length <= i) continue;

            const section = this.sections[i].split('\n');
            const nom = section[0].trim();
            let traceur;

            if (i === 1) {
                // Traceur eau
                traceur = new Traceur(nom, this.extraireDateCalibration(), '');
            } else {
                // Autres traceurs
                traceur = new Traceur(nom, this.extraireDateCalibration(), 'ppb');
            }

            traceur.echelles.push(this.arrondirSansVirgule(this.sections[14].split('  ')[0]));

            // Ajout des données L1-1, L2-1, L3-1, L4-1
            for (let j = 0; j < 4; j++) {
                if (section.length > j + 1) {
                    const ligne = section[j + 1].split(/\s+/);
                    traceur.addData(ligne[0] + '-1', parseFloat(ligne[1]));
                }
            }

            // Traitement spécial pour les traceurs non-eau
            if (i !== 1) {
                this.traiterDonneesSupplementaires(traceur, i);
            } else {
                traceur.lampePrincipale = 'NaN';
            }

            Session.getInstance().traceurs.push(traceur);
        }

        this.creerTurbidite();
    }


    /**
     * Traite les données supplémentaires pour les traceurs non-eau
     * @param {Traceur} traceur - Le traceur à compléter
     * @param {number} i - L'indice du traceur
     */
    traiterDonneesSupplementaires(traceur, i) {
        if (this.sections.length <= 7 + i) return;

        const sectionConcentration = this.sections[7 + i].split('\n');
        const nbLignes = parseInt(sectionConcentration[0].charAt(0));

        let valeuraRemplacer = 0;
        let valeurRemplacement = [];

        for (let k = nbLignes - 1; k >= 0; k--) {
            if (sectionConcentration.length <= k + 1) continue;

            const ligne = sectionConcentration[k + 1].split(/\s+/);
            if (ligne.length < 2) continue;

            if (!traceur.echelles.includes(this.calculerEchelle(parseFloat(ligne[0])))) {
                traceur.echelles.push(this.calculerEchelle(parseFloat(ligne[0])));
            }

            if (traceur.getLabelParValeur(parseFloat(ligne[1])).substring(3, 4) === '1') {
                valeuraRemplacer = parseFloat(ligne[1]);
            } else {
                valeurRemplacement.push(parseFloat(ligne[1]));
            }
        }

        // Attribution des valeurs aux lampes
        for (let j = 0; j < valeurRemplacement.length; j++) {
            for (let k = 1; k <= 4; k++) {
                if (valeuraRemplacer) {
                    const idValeuraModifier = traceur.getLabelParValeur(valeuraRemplacer).substring(1, 2);
                    if (k === parseFloat(idValeuraModifier)) {
                        traceur.addData('L' + parseFloat(idValeuraModifier) + `-${2 + j}`, valeurRemplacement[j]);
                    } else {
                        traceur.addData('L' + k + `-${2 + j}`, 'NaN');
                    }
                } else {
                    if (i - 1 === k) {
                        traceur.addData('L' + k + `-${2 + j}`, valeurRemplacement[j]);
                    } else {
                        traceur.addData('L' + k + `-${2 + j}`, 'NaN');
                    }
                }
            }
        }

        this.determinerLampePrincipale(traceur);
    }


    /**
     * Détermine la lampe principale d'un traceur
     * @param {Traceur} traceur - Le traceur à analyser
     */
    determinerLampePrincipale(traceur) {
        let maxDataLength = 0;
        let maxDataIndex = 0;
        const labels = traceur.echelles;

        for (let i = 1; i <= traceur.data.size; i++) {
            let nbValeurs = 0;
            for (let j = 0; j < labels.length; j++) {
                const value = traceur.getDataParNom('L' + i + '-' + (j + 1));
                if (value !== null && value !== 'NaN' && !isNaN(value)) {
                    nbValeurs++;
                }
            }
            if (nbValeurs > maxDataLength) {
                maxDataLength = nbValeurs;
                maxDataIndex = i;
            }
        }

        if (traceur.unite.toLowerCase() !== 'ntu') {
            traceur.lampePrincipale = maxDataIndex;
        } else {
            traceur.lampePrincipale = 4;
        }
    }


    /**
     * Crée un objet Traceur de type Turbidité
     */
    creerTurbidite() {
        const turbidite = new Traceur('Turbidité', this.extraireDateCalibration(), 'NTU');
        let k = 1;

        for (let i = 5; i <= 7; i++) {
            if (this.sections.length <= i) continue;

            const section = this.sections[i].split('\n');
            if (section.length <= 0) continue;

            const premiereLigne = section[0].split(' ');
            if (premiereLigne.length > 0) {
                turbidite.echelles.push(parseFloat(premiereLigne[0]));
                turbidite.lampePrincipale = 4;
            }

            for (let j = 0; j < 4; j++) {
                if (section.length <= j + 1) continue;

                const ligne = section[j + 1].split(/\s+/);
                if (ligne.length > 1) {
                    turbidite.addData(ligne[0] + `-${k}`, parseFloat(ligne[1]));
                }
            }
            k++;
        }

        Session.getInstance().traceurs.push(turbidite);
    }


    /**
     * Convertit le contenu du fichier DAT en format CSV
     * @returns {string} Le contenu formaté en CSV
     */
    convertirEnCSV() {
        let texte = `FluoGraphiX - Export du ${getDateAujourdhui()} - Appareil ${this.numeroFluorimetre}\n\n`;
        texte += `/!\\ Par convention, la turbidité doit toujours se trouver en dernière position dans le fichier, et l'eau en première position.\n`;
        texte += `Pour plus d'informations sur le fonctionnement de ce fichier, visitez la rubrique 'Documentation' du site FluoGraphiX.\n\n`;
        texte += `----------------------------------------------------------------------------------------\n`;

        const traceurs = Session.getInstance().traceurs;

        for (let i = 0; i < traceurs.length; i++) {
            texte += `${traceurs[i].nom}\n`;
            texte += `${traceurs[i].dateMesure}\n`;

            let echelles = traceurs[i].echelles.map((echelle, index) => ({echelle, index}));

            if (traceurs[i].unite !== '') {

                texte += `${traceurs[i].unite}\n`;
                texte += `L${traceurs[i].lampePrincipale}\n\n`;

                echelles.sort((a, b) => a.echelle - b.echelle);

                texte += '';
                for (let j = 0; j < echelles.length; j++) {
                    texte += `;${echelles[j].echelle}`;
                }
                texte += '\n';
            } else {
                texte += '\n\n\n\n';
            }

            for (let j = 1; j <= 4; j++) {
                texte += `L${j}`;
                for (let k = 0; k < echelles.length; k++) {
                    const dataValue = traceurs[i].getDataParNom('L' + j + '-' + (echelles[k].index + 1));
                    if (dataValue !== undefined) {
                        texte += `;${dataValue}`;
                    }
                }
                texte += '\n';
            }

            texte += `----------------------------------------------------------------------------------------\n`;
        }
        return texte;
    }
}
