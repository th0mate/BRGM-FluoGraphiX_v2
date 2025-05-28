/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 */
import {afficherMessageFlash} from "@/assets/js/Common/utils.js";

/**
 * Copie dans le presse-papiers un élément HTML de la page, et affiche un message flash
 * @param {string} querySelectorElement Nom de la classe de l'élément à convertir en image
 */
export async function copierScreenElement(querySelectorElement) {
    const element = document.querySelector(`${querySelectorElement}`);

    if (!element) {
        afficherMessageFlash('Element introuvable dans le DOM', 'danger');
        return;
    }

    const elementRect = element.getBoundingClientRect();

    try {
        const canvas = await html2canvas(element, {
            scrollY: -window.scrollY,
            width: elementRect.width,
            height: elementRect.height,
            useCORS: true,
            debug: false,
        });

        const blob = await new Promise(resolve => canvas.toBlob(resolve));
        const clipboardItem = new ClipboardItem({'image/png': blob});
        await navigator.clipboard.write([clipboardItem]);
        afficherMessageFlash('Image copiée dans le presse-papiers.', 'success');
    } catch (error) {
        afficherMessageFlash('Impossible de copier l\'image dans le presse-papiers.', 'danger');
        console.error(error);
    }
}


/**
 * Copie dans le presse papier le texte de l'élément du DOM passé en paramètre
 * @param {string} querySelectorElement Nom de la classe de l'élément à copier
 */
export async function copierTexte(querySelectorElement) {
    const element = document.querySelector(`${querySelectorElement}`);

    if (!element) {
        afficherMessageFlash('Element introuvable dans le DOM', 'danger');
        return;
    }

    try {
        await navigator.clipboard.writeText(element.innerText);
        afficherMessageFlash('Texte copié dans le presse-papiers.', 'success');
    } catch (error) {
        afficherMessageFlash('Impossible de copier le texte dans le presse-papiers.', 'danger');
        console.error(error);
    }
}