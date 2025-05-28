/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 * Permet de lire les fichiers de calibration CSV et d'en extraire les informations nécessaires
 */
import { LecteurFichierCalibration } from './LecteurFichierCalibration.js';
import Traceur from '@/assets/js/Objects/Traceur.js';
import Session from '@/assets/js/Session/Session.js';


/**
 * ======================================================================================================================
 * Classe spécialisée pour la lecture des fichiers de calibration au format CSV
 * ======================================================================================================================
 */
export class LecteurFichierCSV extends LecteurFichierCalibration {


    /**
     * Extrait les sections du fichier CSV
     * @returns {Array<string>} Les sections extraites
     */
    extraireSections() {
        const sections = [];
        let section = '';
        let sectionEnCours = 0;

        for (let i = 0; i < this.lignes.length; i++) {
            if (this.lignes[i].startsWith('----') || this.lignes[i].includes(',----')) {
                sections.push(section);
                section = '';
                sectionEnCours++;
            } else if (this.lignes[i].trim() !== '') {
                section += this.lignes[i] + '\n';
            }
        }

        if (section.trim() !== '') {
            sections.push(section);
        }

        return sections;
    }


    /**
     * Extrait les noms des traceurs du fichier CSV
     * @returns {Array<string>} Les noms des traceurs
     */
    extraireNomsTraceurs() {
        const noms = [];

        for (let i = 0; i < this.sections.length; i++) {
            const section = this.sections[i].split('\n');
            if (section[0] && section[0].includes('Traceur')) {
                const nomTraceur = section[0].split(',')[1];
                if (nomTraceur) {
                    noms.push(nomTraceur.trim());
                }
            }
        }

        return noms;
    }


    /**
     * Extrait le numéro du fluorimètre du fichier CSV
     * @returns {string} Le numéro du fluorimètre
     */
    extraireNumeroFluorimetre() {
        for (let i = 0; i < this.lignes.length; i++) {
            if (this.lignes[i].includes('Fluorimètre n°')) {
                const parties = this.lignes[i].split(',');
                if (parties.length > 1) {
                    return parties[1].trim();
                }
            }
        }

        return '';
    }


    /**
     * Extrait la date de calibration du fichier CSV
     * @returns {string} La date de calibration au format jj/mm/aa
     */
    extraireDateCalibration() {
        for (let i = 0; i < this.lignes.length; i++) {
            if (this.lignes[i].includes('Date de calibration')) {
                const parties = this.lignes[i].split(',');
                if (parties.length > 1) {
                    return parties[1].trim();
                }
            }
        }

        return '';
    }


    /**
     * Crée les objets Traceur à partir des données du fichier CSV
     */
    creerTraceurs() {
        Session.getInstance().traceurs = [];

        // Parcourir les sections pour trouver et créer les traceurs
        for (let i = 0; i < this.sections.length; i++) {
            const section = this.sections[i].split('\n');
            if (section[0] && section[0].includes('Traceur')) {
                const nomTraceur = section[0].split(',')[1].trim();
                let unite = 'ppb';

                // Déterminer l'unité du traceur
                if (nomTraceur.toLowerCase().includes('eau')) {
                    unite = '';
                } else if (nomTraceur.toLowerCase().includes('turbid')) {
                    unite = 'NTU';
                }

                const traceur = new Traceur(nomTraceur, this.extraireDateCalibration(), unite);

                // Extraire les échelles et valeurs
                const donneesTraceur = this.extraireDonneesTraceur(section);

                // Ajouter les échelles au traceur
                traceur.echelles = donneesTraceur.echelles;

                // Ajouter les données au traceur
                for (let j = 0; j < donneesTraceur.donnees.length; j++) {
                    const donnee = donneesTraceur.donnees[j];
                    traceur.addData(donnee.label, donnee.valeur);
                }

                // Déterminer la lampe principale
                if (unite === '') {
                    traceur.lampePrincipale = 'NaN';
                } else if (unite === 'NTU') {
                    traceur.lampePrincipale = 4;
                } else {
                    this.determinerLampePrincipale(traceur);
                }

                Session.getInstance().traceurs.push(traceur);
            }
        }
    }


    /**
     * Extrait les données d'un traceur à partir d'une section CSV
     * @param {Array<string>} section - Les lignes de la section du traceur
     * @returns {Object} Un objet contenant les échelles et les données du traceur
     */
    extraireDonneesTraceur(section) {
        const echelles = [];
        const donnees = [];

        // Trouver l'indice de début des données
        let indiceDebut = -1;
        for (let i = 0; i < section.length; i++) {
            if (section[i].includes('Lampe') || section[i].includes('L1,L2,L3,L4')) {
                indiceDebut = i + 1;
                break;
            }
        }

        if (indiceDebut === -1) return { echelles, donnees };

        // Extraire les données
        for (let i = indiceDebut; i < section.length; i++) {
            const ligne = section[i].split(',');
            if (ligne.length < 5) continue;

            // La première colonne est l'échelle
            const echelle = parseFloat(ligne[0]);
            if (!isNaN(echelle) && !echelles.includes(echelle)) {
                echelles.push(echelle);
            }

            // Les 4 colonnes suivantes sont les valeurs des lampes
            for (let j = 1; j <= 4; j++) {
                const valeur = parseFloat(ligne[j]);
                const index = echelles.indexOf(echelle) + 1;
                if (!isNaN(valeur) && index > 0) {
                    donnees.push({
                        label: `L${j}-${index}`,
                        valeur: valeur
                    });
                }
            }
        }

        return { echelles, donnees };
    }


    /**
     * Détermine la lampe principale d'un traceur
     * @param {Traceur} traceur - Le traceur à analyser
     */
    determinerLampePrincipale(traceur) {
        let maxDataLength = 0;
        let maxDataIndex = 0;
        const labels = traceur.echelles;

        for (let i = 1; i <= 4; i++) {
            let nbValeurs = 0;
            for (let j = 0; j < labels.length; j++) {
                const value = traceur.getDataParNom(`L${i}-${j + 1}`);
                if (value !== null && value !== 'NaN' && !isNaN(value)) {
                    nbValeurs++;
                }
            }
            if (nbValeurs > maxDataLength) {
                maxDataLength = nbValeurs;
                maxDataIndex = i;
            }
        }

        traceur.lampePrincipale = maxDataIndex;
    }


    /**
     * Crée un objet Traceur de type Turbidité
     * Note: Cette méthode n'est pas utilisée dans le lecteur CSV puisque la turbidité est créée
     * en même temps que les autres traceurs dans la méthode creerTraceurs()
     */
    creerTurbidite() {
        const sections = this.extraireSections();
        const section = sections[sections.length - 2].split('\n');

        const turbidite = new Traceur('Turbidité', this.supprimerPointVirgule(section[2].trim()), this.supprimerPointVirgule(section[3].trim()));
        turbidite.lampePrincipale = 4;
        let futuresEchelles = section[6].split(';');
        futuresEchelles = futuresEchelles.filter(echelle => echelle !== '');
        const nbColonnes = futuresEchelles.length;

        for (let i = 0; i < nbColonnes; i++) {
            turbidite.echelles.push(parseFloat(futuresEchelles[i]));
        }

        for (let i = 0; i < 4; i++) {
            const ligne = section[i + 7].split(';');
            for (let j = 0; j < nbColonnes; j++) {
                turbidite.addData(ligne[0] + `-${j + 1}`, parseFloat(ligne[j + 1]));
            }
        }
        Session.getInstance().traceurs.push(turbidite);
    }


    /**
     * Supprime tous les ';' d'un texte passé en paramètre
     * @param texte le texte à modifier
     * @return {string} le texte sans les ';'
     */
    supprimerPointVirgule(texte) {
        return texte.replace(/;/g, '');
    }
}
