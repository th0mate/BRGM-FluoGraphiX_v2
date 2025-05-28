/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 */


/**
 * ======================================================================================================================
 * Classe de base pour les calculs d'équation
 * =====================================================================================================================
 */
class Calculs {


    /**
     * Constructeur de la classe Calculs
     * @param {string} equation - L'équation sous forme de texte
     */
    constructor(equation) {
        this.equation = equation;
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
     * Retourne l'équation sous forme de texte
     * @return {string} L'équation
     */
    toStringEquation() {
        return this.equation;
    }


    /**
     * Retourne les valeurs des paramètres sous forme de texte
     * @return {string} Les valeurs des paramètres
     */
    toStringValeursParametres() {
        let result = '';
        this.parametres.forEach((valeur, nom) => {
            result += `<br>${nom} = ${valeur}`;
        });
        return result;
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
        super("Equation du type Y-Y0 = a1 * (X-X0)");
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
 * ======================================================================================================================
 * Classe pour les calculs d'équation logarithmique
 * ===================================================================================================================
 */
class EquationLogarithmique extends Calculs {


    /**
     * Constructeur de la classe EquationLogarithmique
     */
    constructor() {
        super("Equation du type ln(Y-Y0) = a0 + a1*ln(X-X0)");
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
        super("Equation du type ln(Y-Y0) = a0 + a1*ln(X-X0) + a2*ln(X-X0)^2");
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

