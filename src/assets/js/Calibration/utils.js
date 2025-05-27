/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 */


/**
 * Calcule le logarithme népérien d'un nombre
 * @param {number} nb
 * @return {number}
 */
const ln = Math.log;


/**
 * Arrondi un nombre à 8 chiffres après la virgule maximum
 * @param {number} nb
 * @returns {number}
 */
const arrondir8Chiffres = nb => Math.round(nb * 1e8) / 1e8;


/**
 * Transpose une matrice
 * @param {Array<Array<any>>} matrix
 * @returns {Array<Array<any>>}
 */
const transpose = matrix => matrix[0].map((_, col) => matrix.map(row => row[col]));


/**
 * Multiplie deux matrices
 * @param {Array<Array<number>>} matrixA
 * @param {Array<Array<number>>} matrixB
 * @returns {Array<Array<number>>}
 */
const multiply = (matrixA, matrixB) =>
    matrixA.map(row => matrixB[0].map((_, j) =>
        row.reduce((sum, val, i) => sum + val * matrixB[i][j], 0)
    ));


/**
 * Calcule l'inverse d'une matrice carrée (méthode de Gauss-Jordan)
 * @param {Array<Array<number>>} matrix
 * @returns {Array<Array<number>>}
 */
function inverse(matrix) {
    const size = matrix.length;
    const augmented = matrix.map((row, i) => [
        ...row,
        ...Array.from({ length: size }, (_, j) => (i === j ? 1 : 0))
    ]);
    for (let i = 0; i < size; i++) {
        let maxRow = i;
        for (let j = i + 1; j < size; j++) {
            if (Math.abs(augmented[j][i]) > Math.abs(augmented[maxRow][i])) maxRow = j;
        }
        if (augmented[maxRow][i] === 0) {
            afficherPopup('<img src="Ressources/img/404.png" alt="">', 'Erreur générale de calcul', 'Une erreur de calcul a empêché l\'exécution d\'une partie du code. Erreur : "La matrice est singulière et ne peut pas être inversée". Vérifiez vos données et les variables explicatives sélectionnées.', '<div class="bouton boutonFonce" onclick="fermerPopup()">FERMER</div>');
            console.error(matrix);
            return null;
        }
        [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
        const div = augmented[i][i];
        for (let j = 0; j < size * 2; j++) augmented[i][j] /= div;
        for (let j = 0; j < size; j++) {
            if (j !== i) {
                const factor = augmented[j][i];
                for (let k = 0; k < size * 2; k++) {
                    augmented[j][k] -= factor * augmented[i][k];
                }
            }
        }
    }
    return augmented.map(row => row.slice(size));
}


/**
 * Effectue une régression linéaire multiple
 * @param {Array<Array<number>>} X
 * @param {Array<Array<number>>} y
 * @returns {Array<Array<number>>}
 */
function multipleLinearRegression(X, y) {
    const XT = transpose(X);
    const XT_X = multiply(XT, X);
    const XT_X_inv = inverse(XT_X);
    if (!XT_X_inv) return null;
    const XT_y = multiply(XT, transpose(y));
    return multiply(XT_X_inv, XT_y);
}


/**
 * Retourne une valeur supérieure (+20%) à la valeur maximale du traceur LidLampe
 * @param {object} traceur
 * @param {number|string} idLampe
 * @returns {number}
 */
function getValeurSup20Pourcents(traceur, idLampe) {
    const valeurs = Array.from({ length: traceur.echelles.length }, (_, i) =>
        traceur.getDataParNom('L' + idLampe + '-' + (i + 1))
    ).filter(v => !isNaN(v));
    return Math.max(...valeurs) * 1.2;
}
