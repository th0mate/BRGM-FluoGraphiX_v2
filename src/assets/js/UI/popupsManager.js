
/**
 * ---------------------------------------------------------------------------------------------------------------------
 * POPUPS
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 * Affiche un popup avec les éléments correspondants
 * @param imageHTML{string} : le code HTML de l'image à afficher
 * @param titre{string} : le titre du popup en format texte
 * @param contenu{string} : le contenu du popup en format texte
 * @param boutonsHTML{string} : le code HTML des boutons à afficher
 * @returns {string} : le code HTML du popup
 */
function afficherPopup(imageHTML, titre, contenu, boutonsHTML) {
    fermerPopup();

    let overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '1000';
    overlay.classList.add('overlayPetit');
    document.body.appendChild(overlay);

    document.body.style.overflowY = 'hidden';


    let popupHTML = "";
    popupHTML += `<div class='popup'><div class="entete"><img src="Ressources/img/close.png" class="close" onclick="fermerPopup()" alt="fermer"></div> ${imageHTML}<h2>${titre}</h2><h4>${contenu}</h4><div class="conteneurBoutons">${boutonsHTML}</div></div>`;
    overlay.innerHTML += popupHTML;
}

/**
 * Ferme le popup
 */
function fermerPopup() {
    if (document.querySelector('.popup') !== null) {
        document.querySelector('.popup').remove();
    }
    if (document.querySelector('.overlayPetit') !== null) {
        document.querySelector('.overlayPetit').remove();
    }

    if (document.querySelector('.grandPopup') === null) {
        document.body.style.overflowY = 'auto';
    }
}