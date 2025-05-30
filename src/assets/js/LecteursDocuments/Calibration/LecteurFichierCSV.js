/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 */
import LecteurFichierCalibration from '@/assets/js/LecteursDocuments/Calibration/LecteurFichierCalibration.js';
import Traceur from '@/assets/js/Objects/Traceur.js';
import Session from '@/assets/js/Session/Session.js';


/**
 * ======================================================================================================================
 * Classe spécialisée pour la lecture des fichiers de calibration au format CSV
 * ======================================================================================================================
 */
export default class LecteurFichierCSV extends LecteurFichierCalibration {


    /**
     * Extrait les sections du fichier CSV
     * @returns {Array<string>} Les sections extraites
     */
    extraireSections() {
        return Session.getInstance().contenuFichierCalibration.split('----------------------------------------------------------------------------------------');
    }


    /**
     * Extrait les noms des traceurs du fichier CSV
     * @returns {Array<string>} Les noms des traceurs
     */
    extraireNomsTraceurs() {
        const noms = [];
        for (let i = 1; i < this.sections.length; i++) {
            const section = this.sections[i];
            const nom = section.split('\n')[1].trim();
            noms.push(nom);
        }
        return noms;
    }


    /**
     * Extrait le numéro du fluorimètre du fichier CSV
     * @returns {string} Le numéro du fluorimètre
     */
    extraireNumeroFluorimetre() {
        const premiereLigne = this.lignes[0];
        const index = premiereLigne.indexOf('Appareil');
        return this.supprimerPointVirgule(premiereLigne.substring(index + 9).trim());
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
        const sections = this.sections;

        // On commence à 1 et on s'arrête à length - 2 comme dans creerTraceurCSV
        for (let i = 1; i < sections.length - 2; i++) {
            if (sections[i] !== '' && sections[i] !== ' ') {
                const section = sections[i].split('\n');
                const nom = this.supprimerPointVirgule(section[1].trim());
                const date = this.supprimerPointVirgule(section[2].trim());
                const unite = this.supprimerPointVirgule(section[3].trim());
                const traceur = new Traceur(nom, date, unite);

                // Lampe principale : on prend le chiffre après 'L' dans section[4]
                traceur.lampePrincipale = parseFloat(section[4].charAt(1));

                // Gestion des échelles
                let futuresEchelles = [];
                if (section[3].trim() !== '') {
                    futuresEchelles = section[6].split(';').filter(echelle => echelle !== '');
                } else {
                    futuresEchelles.push(100);
                }
                const nbColonnes = futuresEchelles.length;

                for (let j = 0; j < nbColonnes; j++) {
                    if (!isNaN(parseFloat(futuresEchelles[j]))) {
                        traceur.echelles.push(parseFloat(futuresEchelles[j]));
                    }
                }

                // Ajout des données
                for (let j = 0; j < 4; j++) {
                    const ligne = section[j + 7].split(';');
                    for (let k = 0; k < nbColonnes; k++) {
                        traceur.addData(ligne[0] + `-${k + 1}`, parseFloat(ligne[k + 1]));
                    }
                }

                Session.getInstance().traceurs.push(traceur);
            }
        }
        this.creerTurbidite();
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

        if (indiceDebut === -1) return {echelles, donnees};

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

        return {echelles, donnees};
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
