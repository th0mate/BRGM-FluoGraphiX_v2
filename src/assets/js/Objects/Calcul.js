/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 */


/**
 * Classe Calculs
 * Crée un objet calcul, permettant de savoir quels calculs ont été effectués
 * Et plus particulièrement d'avoir une liste des calculs effectués, et de leurs paramètres
 */
class Calculs {
    nom;
    estFait;
    parametres = new Map();


    /**
     * Constructeur de la classe Calculs
     * @param {string} nom le nom du calcul, par exemple "Correction de turbidité"
     * @param {boolean|string} estFait précise si le calcul a été utilisé (oui ou non)
     */
    constructor(nom, estFait) {
        this.nom = nom;
        this.estFait = estFait;
    }


    /**
     * Ajoute un paramètre au calcul
     * @param {string} nom le nom du paramètre
     * @param {any} valeur la valeur du paramètre
     */
    ajouterParametreCalcul(nom, valeur) {
        this.parametres.set(nom, valeur);
    }


    /**
     * Récupère un paramètre par son nom
     * @param {string} nom le nom du paramètre
     * @return {any} la valeur du paramètre
     */
    getParametreParNom(nom) {
        return this.parametres.get(nom);
    }


    /**
     * Retourne une représentation lisible de l'objet Calculs
     * @returns {string}
     */
    toString() {
        const params = Array.from(this.parametres.entries())
            .map(([nom, valeur]) => `------------------------------\n${nom} : ${valeur}`)
            .join('\n');
        return `${this.nom} : (${this.estFait})\nParamètres : \n${params}\n------------------------------\n\n-------------------------------------------------------------------\n\n`;
    }


    /**
     * Retourne une équation sous la forme Ln(C)=a0+a1*ln(dmV)+a2*ln(dmV)^2
     * @returns {string}
     */
    toStringEquation() {
        return this.nom;
    }


    /**
     * Retourne un string contenant simplement les valeurs des paramètres
     * @returns {string}
     */
    toStringValeursParametres() {
        return Array.from(this.parametres.entries())
            .map(([nom, valeur]) => `${nom} = ${valeur}`)
            .join('\n');
    }
}
