import { t } from '@/locales/i18nService';

/**
 * ======================================================================================================================
 * Classe de base pour les calculs d'équation
 * =====================================================================================================================
 */
class Calculs {


    /**
     * Constructeur de la classe Calculs
     * @param {string} equationKey - La clé de traduction de l'équation
     */
    constructor(equationKey) {
        this.equationKey = equationKey;
        this.parametres = new Map();
    }


    /**
     * Ajoute un paramètre de calcul à l'équation
     * @param {string} nom - Le nom du paramètre
     * @param {number} valeur - La valeur du paramètre
     */
    ajouterParametreCalcul(nom, valeur) {
        this.parametres.set(nom, valeur);
    }


    /**
     * Récupère la valeur d'un paramètre
     * @param {string} nom - Le nom du paramètre
     * @return {number} La valeur du paramètre
     */
    getParametre(nom) {
        return this.parametres.get(nom);
    }


    /**
     * Retourne l'équation traduite
     * @return {string} L'équation traduite
     */
    get equation() {
        return t(this.equationKey);
    }


    /**
     * Retourne l'équation traduite
     * @return {string} L'équation traduite
     */
    toStringEquation() {
        return t(this.equationKey);
    }


    /**
     * Retourne les valeurs des paramètres sous forme de texte
     * @return {string} Les valeurs des paramètres
     */
    toStringValeursParametres() {
        let result = '';
        this.parametres.forEach((valeur, nom) => {
            result += `\n${nom} = ${valeur}`;
        });
        return result;
    }


    /**
     * Retourne les valeurs des paramètres sous forme de texte HTML
     * @returns {string} Les valeurs des paramètres en HTML
     */
    toStringValeurParametresHTML() {
        let result = '';
        this.parametres.forEach((valeur, nom) => {
            result += `<span>${nom} = ${valeur}</span>`;
        });
        return result;
    }


    toString() {
        return `${this.toStringEquation()} : \nParamètres:${this.toStringValeursParametres()}\n----------------------------------------\n`;
    }


}


/**
 * ======================================================================================================================
 * Classe pour les calculs d'équation linéaire
 * ====================================================================================================================
 */
class EquationLineaire extends Calculs {


    /**
     * Constructeur de la classe EquationLineaire
     */
    constructor() {
        super('equations.linear');
    }


    /**
     * Calcule la valeur de Y pour une valeur de X donnée
     * @param {number} x - La valeur de X
     * @return {number} La valeur de Y calculée
     */
    calculer(x) {
        const a1 = this.getParametre('a1');
        const x0 = this.getParametre('X0');
        const y0 = this.getParametre('Y0');

        return y0 + a1 * (x - x0);
    }
}


/**
 * =====================================================================================================================
 * Classe pour les calculs d'équation logarithmique
 * ===================================================================================================================
 */
class EquationLogarithmique extends Calculs {


    /**
     * Constructeur de la classe EquationLogarithmique
     */
    constructor() {
        super('equations.logarithmic');
    }


    /**
     * Calcule la valeur de Y pour une valeur de X donnée
     * @param {number} x - La valeur de X
     * @return {number} La valeur de Y calculée
     */
    calculer(x) {
        const a0 = this.getParametre('a0');
        const a1 = this.getParametre('a1');
        const x0 = this.getParametre('X0');
        const y0 = this.getParametre('Y0');

        return y0 + Math.exp(a0 + a1 * Math.log(x - x0));
    }
}


/**
 * =====================================================================================================================
 * Classe pour les calculs d'équation logarithmique quadratique
 * ===================================================================================================================
 */
class EquationLogarithmiqueQuadratique extends Calculs {


    /**
     * Constructeur de la classe EquationLogarithmiqueQuadratique
     */
    constructor() {
        super('equations.logarithmicQuadratic');
    }


    /**
     * Calcule la valeur de Y pour une valeur de X donnée
     * @param {number} x - La valeur de X
     * @return {number} La valeur de Y calculée
     */
    calculer(x) {
        const a0 = this.getParametre('a0');
        const a1 = this.getParametre('a1');
        const a2 = this.getParametre('a2');
        const x0 = this.getParametre('X0');
        const y0 = this.getParametre('Y0');

        const lnXX0 = Math.log(x - x0);
        return y0 + Math.exp(a0 + a1 * lnXX0 + a2 * lnXX0 * lnXX0);
    }
}

export { Calculs, EquationLineaire, EquationLogarithmique, EquationLogarithmiqueQuadratique };

