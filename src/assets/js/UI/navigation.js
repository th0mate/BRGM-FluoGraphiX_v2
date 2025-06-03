/**
* Réalisé par Thomas LOYE pour le compte du BRGM en 2025
* www.thomasloye.fr
 * Toutes les fonctions relatives à l'interface utilisateur et à la navigation dans l'application
*/


/**
 * Permet de faire défiler la page jusqu'à un élément spécifique de la page.
 * @param elementQuerySelector {string} - Le sélecteur CSS de l'élément vers lequel faire défiler la page.
 * @param area {"start"|"center"|"end"|"nearest"} - La position de l'élément dans la fenêtre de visualisation. Peut être 'start', 'center', 'end', ou 'nearest'. Par défaut, 'center'.
 */
export function scrollToElement(elementQuerySelector, area = 'center') {
    const allowedAreas = ['start', 'center', 'end', 'nearest'];
    const block = allowedAreas.includes(area) ? area : 'center';
    const element = document.querySelector(elementQuerySelector);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block });
    } else {
        console.warn(`scrollToElement() - Élément non trouvé : ${elementQuerySelector}`);
    }
}

