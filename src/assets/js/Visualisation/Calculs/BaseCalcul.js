/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 * Classe de base pour les calculs de visualisation
 */
import {afficherMessageFlash, arrondirA2Decimales} from "@/assets/js/Common/utils.js";
import {Calculs} from "@/assets/js/Objects/Calcul.js";
import Session from "@/assets/js/Session/Session.js";
import {DateTime} from "luxon";

/**
 * =======================================================================================================================
 * Classe de base abstraite pour les calculs de visualisation
 * ======================================================================================================================
 */
export class BaseCalcul {
    constructor(controlleur) {
        this.controlleur = controlleur;
    }


    /**
     * Récupère l'instance du graphique
     * @returns {Object|null} Instance du graphique ou null
     */
    getChartInstance() {
        return this.controlleur.getChartInstance();
    }


    /**
     * Exécute une fonction de calcul avec gestion automatique du chargement
     * @param {Function} fn - La fonction de calcul à exécuter
     * @param {...any} args - Les arguments à passer à la fonction
     * @returns {Promise<any>} - Le résultat de la fonction
     */
    async executerAvecChargement(fn, ...args) {
        if (!fn || typeof fn !== 'function') {
            console.error('La fonction à exécuter est invalide');
            return;
        }

        try {
            if (this.controlleur) {
                Object.assign(this.controlleur, { chargementCalculs: true });
            }

            await new Promise(resolve => setTimeout(resolve, 50));

            let resultat;
            if (fn.constructor.name === 'AsyncFunction') {
                resultat = await fn.apply(this, args);
            } else {
                resultat = fn.apply(this, args);
            }

            return resultat;
        } catch (error) {
            afficherMessageFlash('Une erreur est survenue lors du calcul', 'error');
            throw error;
        } finally {
            if (this.controlleur) {
                Object.assign(this.controlleur, { chargementCalculs: false });
            }
        }
    }


    /**
     * Crée et ajoute un calcul à la session
     * @param {string} nom - Nom du calcul
     * @param {Object|Array|string} parametres - Paramètres du calcul
     * @param {string} [valeur='oui'] - Valeur associée au calcul
     * @returns {Calculs} L'objet calcul créé
     */
    creerCalcul(nom, parametres, valeur = 'oui') {
        const calcul = new Calculs(nom, valeur);

        if (Array.isArray(parametres)) {
            parametres.forEach(param => {
                if (param.nom && param.valeur) {
                    calcul.ajouterParametreCalcul(param.nom, param.valeur);
                }
            });
        } else if (typeof parametres === 'object' && parametres !== null) {
            Object.entries(parametres).forEach(([nom, valeur]) => {
                calcul.ajouterParametreCalcul(nom, valeur);
            });
        } else if (parametres) {
            calcul.ajouterParametreCalcul('Paramètres', parametres);
        }

        Session.getInstance().calculs = Session.getInstance().calculs.filter(c => c.nom !== calcul.equation);
        Session.getInstance().calculs.push(calcul);

        return calcul;
    }


    /**
     * Met à jour le graphique avec un nouveau dataset
     * @param {string} label - Étiquette du dataset
     * @param {Array} data - Données du dataset
     * @param {string} [borderColor] - Couleur de la bordure (sinon généré aléatoirement)
     */
    mettreAJourGraphique(label, data, borderColor = null) {
        const chart = this.getChartInstance();
        if (!chart) return;

        chart.data.datasets = chart.data.datasets.filter(dataset => dataset.label !== label);

        const newDataset = {
            label: label,
            data: data,
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderColor: borderColor || this.controlleur.graphiqueVisualisation.getRandomColor(),
            borderWidth: 2,
            pointRadius: 0
        };

        chart.data.datasets.push(newDataset);
        chart.update();
        this.controlleur.chargementCalculs = false;
    }


    /**
     * Récupère un traceur par son unité
     * @param {string} unite - Unité du traceur à trouver
     * @returns {Object|null} Le traceur trouvé ou null
     */
    getTraceurParUnite(unite) {
        return Session.getInstance().traceurs.find(t => t.unite === unite);
    }


    /**
     * Ajoute une colonne aux données avec le résultat d'un calcul
     * @param {string} nomColonne - Nom de la colonne à ajouter
     * @param {Array} valeurs - Valeurs à ajouter
     * @param {Array} dates - Dates correspondantes aux valeurs (format "dd/MM/yy-HH:mm:ss")
     * @returns {string} Contenu du fichier mis à jour
     */
    ajouterColonneResultat(nomColonne, valeurs, dates) {
        let lignes = this.controlleur.copieContenuFichierMesure.split('\n');

        let header = lignes[2].replace(/\r|\n/g, '').split(';');
        lignes = this.controlleur.supprimerColonneParEnTete(nomColonne, lignes);
        header = header.filter(colonne => colonne !== nomColonne);
        header.push(nomColonne);
        lignes[2] = header.join(';');

        // Ajout des valeurs aux lignes correspondantes
        for (let i = 3; i < lignes.length; i++) {
            const cols = lignes[i].split(';');
            const dateHeure = cols[0] + '-' + cols[1];
            const index = dates.findIndex(date => date === dateHeure);

            if (index !== -1) {
                lignes[i] = lignes[i].replace(/\r|\n/g, '');
                lignes[i] += `;${arrondirA2Decimales(valeurs[index])}`;
            }
        }

        return lignes.join('\n');
    }


    /**
     * Extrait les données nécessaires aux calculs
     * @param {number[]} indexColonnes - Indices des colonnes à extraire
     * @returns {Object} Objet contenant les données extraites, dates et timestamps
     */
    extraireDonnees(indexColonnes) {
        const lignes = this.controlleur.copieContenuFichierMesure.split('\n').filter(l => l !== '');
        let donnees = [];
        let dates = [];
        let timestamps = [];

        for (let i = 3; i < lignes.length - 1; i++) {
            const cols = lignes[i].split(';');
            const dateHeure = cols[0] + '-' + cols[1];
            const timeDate = DateTime.fromFormat(dateHeure, 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'});
            const timestamp = timeDate.toMillis();

            let valeurs = indexColonnes.map(idx => {
                return cols[idx] !== '' ? cols[idx].replace(/\r|\n/g, '') : null;
            });

            if (valeurs.every(val => val !== null)) {
                donnees.push(valeurs);
                dates.push(dateHeure);
                timestamps.push(timestamp);
            }
        }

        return { donnees, dates, timestamps };
    }
}
