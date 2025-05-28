/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 */


/**
 * Calcule le logarithme népérien d'un nombre
 * @param {number} nb - Le nombre
 * @return {number} Le logarithme népérien du nombre
 */
export function ln(nb) {
    return Math.log(nb);
}


/**
 * Arrondit un nombre à 8 chiffres après la virgule
 * @param {number} nombre - Le nombre à arrondir
 * @return {number} Le nombre arrondi
 */
export function arrondir8Chiffres(nombre) {
    return Math.round(nombre * 100000000) / 100000000;
}


/**
 * Effectue une multiplication de matrices
 * @param {Array<Array<number>>} a - Première matrice
 * @param {Array<Array<number>>} b - Deuxième matrice
 * @return {Array<Array<number>>} Résultat de la multiplication
 */
export function multiply(a, b) {
    const aNumRows = a.length;
    const aNumCols = a[0].length;
    const bNumRows = b.length;
    const bNumCols = b[0].length;

    if (aNumCols !== bNumRows) {
        throw new Error('Les dimensions des matrices ne correspondent pas pour la multiplication');
    }

    const c = Array(aNumRows).fill().map(() => Array(bNumCols).fill(0));

    for (let i = 0; i < aNumRows; i++) {
        for (let j = 0; j < bNumCols; j++) {
            for (let k = 0; k < aNumCols; k++) {
                c[i][j] += a[i][k] * b[k][j];
            }
        }
    }

    return c;
}


/**
 * Transpose une matrice
 * @param {Array<Array<number>>} a - La matrice à transposer
 * @return {Array<Array<number>>} La matrice transposée
 */
export function transpose(a) {
    const numRows = a.length;
    const numCols = a[0].length;

    const b = Array(numCols).fill().map(() => Array(numRows).fill(0));

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            b[j][i] = a[i][j];
        }
    }

    return b;
}


/**
 * Calcule l'inverse d'une matrice
 * @param {Array<Array<number>>} a - La matrice à inverser
 * @return {Array<Array<number>>} La matrice inversée
 */
export function inverse(a) {
    const n = a.length;

    const identite = Array(n).fill().map((_, i) =>
        Array(n).fill().map((_, j) => i === j ? 1 : 0)
    );

    const matrice = a.map(row => [...row]);

    for (let i = 0; i < n; i++) {
        let maxVal = Math.abs(matrice[i][i]);
        let maxIndex = i;

        for (let j = i + 1; j < n; j++) {
            if (Math.abs(matrice[j][i]) > maxVal) {
                maxVal = Math.abs(matrice[j][i]);
                maxIndex = j;
            }
        }

        if (maxIndex !== i) {
            [matrice[i], matrice[maxIndex]] = [matrice[maxIndex], matrice[i]];
            [identite[i], identite[maxIndex]] = [identite[maxIndex], identite[i]];
        }

        const pivot = matrice[i][i];
        for (let j = 0; j < n; j++) {
            matrice[i][j] /= pivot;
            identite[i][j] /= pivot;
        }

        for (let j = 0; j < n; j++) {
            if (j !== i) {
                const factor = matrice[j][i];
                for (let k = 0; k < n; k++) {
                    matrice[j][k] -= factor * matrice[i][k];
                    identite[j][k] -= factor * identite[i][k];
                }
            }
        }
    }

    return identite;
}


/**
 * Effectue une régression linéaire multiple
 * @param {Array<Array<number>>} X - Matrice des variables indépendantes
 * @param {Array<Array<number>>} y - Matrice des variables dépendantes
 * @return {Array<Array<number>>} Les coefficients de la régression
 */
export function multipleLinearRegression(X, y) {
    const XT = transpose(X);
    const XTX = multiply(XT, X);
    const XTXInv = inverse(XTX);
    const XTXInvXT = multiply(XTXInv, XT);
    return multiply(XTXInvXT, y);
}


/**
 * Récupère la valeur maximale d'un traceur pour une lampe donnée avec 20% de marge
 * @param {object} traceur - L'objet traceur
 * @param {number} idLampe - L'ID de la lampe
 * @return {number} La valeur maximale avec la marge
 */
export function getValeurSup20Pourcents(traceur, idLampe) {
    let max = 0;
    for (let i = 1; i <= traceur.echelles.length; i++) {
        if (!isNaN(traceur.getDataParNom('L' + idLampe + '-' + i)) && traceur.getDataParNom('L' + idLampe + '-' + i) > max) {
            max = traceur.getDataParNom('L' + idLampe + '-' + i);
        }
    }
    return max * 1.2;
}

