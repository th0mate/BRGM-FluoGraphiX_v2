/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 */
import Session from "@/assets/js/Session/Session.js";


/**
 * Retourne un tableau (matrice) contenant les signaux nets pour un traceur et une lampe donnée.
 * Les titres des colonnes sont les logarithmes népériens des échelles du traceur
 * Les titres des lignes sont L1 à L4
 * Le contenu des cellules est le signal net, donc le signal (L lampe - X) - la valeur LX - 1 de l'eau
 * @param traceur
 * @param lampe
 */
function creerTableauValeursNettes(traceur, lampe) {
    const eau = Session.getInstance().traceurs.find(t => t.unite === '');
    const echelles = traceur.echelles.map(e => arrondir8Chiffres(ln(e)));
    const ligne = traceur.echelles.map((_, j) =>
        arrondir8Chiffres(traceur.getDataParNom(`L${lampe}-${j + 1}`) - eau.getDataParNom(`L${lampe}-1`))
    );
    return [echelles, ligne];
}

/**
 * Retourne un tableau (matrice) contenant les signaux nets pour un traceur et une lampe donnée (logarithme).
 * Les titres des colonnes sont les logarithmes népériens des échelles du traceur
 * Les titres des lignes sont L1 à L4
 * Le contenu des cellules est le signal net, donc le signal (L lampe - X) - la valeur LX - 1 de l'eau
 * @param traceur
 * @param lampe
 */
function creerTableauValeursNettesLn(traceur, lampe) {
    const eau = Session.getInstance().traceurs.find(t => t.unite === '');
    const echelles = traceur.echelles.map(e => arrondir8Chiffres(ln(e)));
    const ligne = [];
    const ligneCarre = [];
    for (let j = 1; j <= traceur.echelles.length; j++) {
        const signal = ln(traceur.getDataParNom(`L${lampe}-${j}`) - eau.getDataParNom(`L${lampe}-1`));
        const arrondi = arrondir8Chiffres(signal);
        ligne.push(arrondi);
        ligneCarre.push(arrondir8Chiffres(signal ** 2));
    }
    return transpose([echelles, ligne, ligneCarre]);
}

/**
 * Crée une matrice contenant ln(creerTableauValeursNettes)** position de chaque cellule de traceur.echelles
 * @param traceur
 * @param tableauValeursNettes
 * @returns {Array<Array<number>>}
 */
function creerMatriceLn(traceur, tableauValeursNettes) {
    return traceur.echelles.map((_, i) =>
        tableauValeursNettes[1].map(v => arrondir8Chiffres(ln(v) ** i))
    );
}
