/**
 * ---------------------------------------------------------------------------------------------------------------------
 * POPUPS MANAGER AVEC PRIMEVUE
 * ---------------------------------------------------------------------------------------------------------------------
 */
import { ref, h, render } from 'vue';
import PopupDialog from '@/components/common/PopupDialog.vue';

// État global pour le popup
const popupState = ref({
  visible: false,
  titre: '',
  contenu: '',
  icon: '',
  boutons: [],
  width: '30rem',
});

/**
 * Affiche un popup avec les éléments correspondants
 * @param options - Options du popup
 * @param {string} options.icon - HTML de l'icône à afficher ou nom de l'icône PrimeIcons
 * @param {string} options.titre - Titre du popup
 * @param {string} options.contenu - Contenu textuel du popup
 * @param {Array} options.boutons - Liste des boutons à afficher
 * @param {string} options.width - Largeur du popup (ex: '30rem')
 * @returns {Promise} - Promise résolue lorsqu'un bouton est cliqué ou le popup est fermé
 */
export function afficherPopup({ icon = '', titre = '', contenu = '', boutons = [], width = '30rem' }) {
  return new Promise((resolve) => {
    // Prépare les boutons avec les fonctions de callback appropriées
    const boutonsFinal = boutons.map(bouton => ({
      ...bouton,
      action: () => {
        resolve({ bouton, dismissed: false });
      }
    }));

    // Configure l'état du popup
    popupState.value = {
      visible: true,
      titre,
      contenu,
      icon,
      boutons: boutonsFinal,
      width,
    };

    // Gère la fermeture sans action de bouton
    const handleClose = () => {
      resolve({ dismissed: true });
      popupState.value.visible = false;
    };

    // Utiliser un événement personnalisé pour détecter la fermeture du popup
    const closeHandler = () => {
      document.removeEventListener('popupClose', closeHandler);
      handleClose();
    };

    document.addEventListener('popupClose', closeHandler);

    // Ajouter un gestionnaire pour la fermeture via le bouton X ou le clic en dehors du dialog
    const originalVisible = popupState.value.visible;
    setTimeout(() => {
      if (originalVisible && !popupState.value.visible) {
        handleClose();
      }
    }, 300);
  });
}


/**
 * Affiche un popup de confirmation
 * @param {string} titre - Titre du popup
 * @param {string} contenu - Contenu du popup
 * @param {Object} options - Options supplémentaires
 * @returns {Promise<boolean>} - true si confirmé, false sinon
 */
export function afficherConfirmation(titre, contenu, options = {}) {
  return afficherPopup({
    icon: options.icon || '<i class="pi pi-question-circle" style="font-size: 2rem; color: var(--orangeBRGM);"></i>',
    titre,
    contenu,
    boutons: [
      {
        texte: options.texteBoutonOui || 'Confirmer',
        icone: 'pi pi-check',
        severity: 'primary'
      },
      {
        texte: options.texteBoutonNon || 'Annuler',
        icone: 'pi pi-times',
        severity: 'secondary'
      }
    ],
    width: options.width || '25rem',
  }).then(result => {
    if (result.dismissed) return false;
    return result.bouton.texte === (options.texteBoutonOui || 'Confirmer');
  });
}


/**
 * Affiche un message d'information
 * @param {string} titre - Titre du message
 * @param {string} contenu - Contenu du message
 * @param {Object} options - Options supplémentaires
 */
export function afficherInfo(titre, contenu, options = {}) {
  return afficherPopup({
    icon: options.icon || '<i class="pi pi-info-circle" style="font-size: 2rem; color: var(--orangeBRGM);"></i>',
    titre,
    contenu,
    boutons: [
      { texte: options.texteBoutonOk || 'OK', severity: 'primary' }
    ],
    width: options.width || '25rem',
  });
}


/**
 * Affiche un message d'erreur
 * @param {string} titre - Titre du message
 * @param {string} contenu - Contenu du message
 * @param {Object} options - Options supplémentaires
 */
export function afficherErreur(titre, contenu, options = {}) {
  return afficherPopup({
    icon: options.icon || '<i class="pi pi-exclamation-triangle" style="font-size: 2rem; color: var(--orangeBRGM);"></i>',
    titre,
    contenu,
    boutons: [
      { texte: options.texteBoutonOk || 'OK', severity: 'danger' }
    ],
    width: options.width || '25rem',
  });
}


/**
 * Affiche un message de succès
 * @param {string} titre - Titre du message
 * @param {string} contenu - Contenu du message
 * @param {Object} options - Options supplémentaires
 */
export function afficherSucces(titre, contenu, options = {}) {
  return afficherPopup({
    icon: options.icon || '<i class="pi pi-check-circle" style="font-size: 2rem; color: var(--orangeBRGM);"></i>',
    titre,
    contenu,
    boutons: [
      { texte: options.texteBoutonOk || 'OK', severity: 'success' }
    ],
    width: options.width || '25rem',
  });
}


/**
 * Ferme le popup actuellement affiché
 */
export function fermerPopup() {
  popupState.value.visible = false;
  document.dispatchEvent(new CustomEvent('popupClose'));
}

/**
 * Obtient l'état actuel du popup
 */
export function getPopupState() {
  return popupState;
}

export default {
  afficherPopup,
  afficherConfirmation,
  afficherInfo,
  afficherErreur,
  afficherSucces,
  fermerPopup,
  getPopupState,
};
