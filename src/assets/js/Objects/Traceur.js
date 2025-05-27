/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 */


/**
 * Classe Traceur pour la création d'objets Traceur
 */
class Traceur {
    nom;
    dateMesure;
    unite;
    data = new Map();
    echelles = [];
    lampePrincipale = 5;


    /**
     * Constructeur de la classe Traceur
     * @param nom le nom du traceur
     * @param dateMesure la date de la mesure
     * @param unite l'unité de mesure
     */
    constructor(nom, dateMesure, unite) {
        this.nom = nom;
        this.dateMesure = dateMesure;
        this.unite = unite;
    }


    /**
     * Ajoute une donnée au traceur
     * @param {string} label le label de la donnée
     * @param {any} valeur la valeur de la donnée
     */
    addData(label, valeur) {
        this.data.set(label, valeur);
    }


    /**
     * Récupère une donnée par son label
     * @param {string} label le label de la donnée
     * @returns {any} la valeur de la donnée
     */
    getDataParNom(label) {
        return this.data.get(label);
    }


    /**
     * Récupère un label par sa valeur
     * @param {any} valeur la valeur de la donnée
     * @returns {string} le label de la donnée
     */
    getLabelParValeur(valeur) {
        for (const [label, val] of this.data.entries()) {
            if (val === valeur) return label;
        }
        return '';
    }


    /**
     * Retourne une représentation lisible de l'objet Traceur
     * @returns {string}
     */
    toString() {
        const dataStr = Array.from(this.data.entries())
            .map(([k, v]) => `${k}: ${v}`)
            .join(', ');
        return `${this.nom} : { ${dataStr} }`;
    }
}

