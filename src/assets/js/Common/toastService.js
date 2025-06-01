/**
 * Service de notification Toast global
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 */

// Variable qui stockera la référence au service Toast de PrimeVue
let toastInstance = null;

/**
 * Configure le service Toast avec l'instance PrimeVue
 * @param {Object} instance - L'instance de toast retournée par useToast() dans un composant Vue
 */
export function setToastInstance(instance) {
  toastInstance = instance;
}

/**
 * Applique tabindex=-1 à tous les éléments du toast pour éviter le focus par tabulation
 */
function preventTabFocus() {
  setTimeout(() => {
    const toastElements = document.querySelectorAll('.p-toast .p-toast-message-content *');
    toastElements.forEach(element => {
      element.setAttribute('tabindex', '-1');
    });

    const closeButtons = document.querySelectorAll('.p-toast .p-toast-icon-close');
    closeButtons.forEach(button => {
      button.setAttribute('tabindex', '-1');
    });
  }, 100);
}

/**
 * Affiche un message toast
 * @param {string|null} titre - Le titre de la notification. Si null, un titre par défaut sera choisi selon le type.
 * @param {string} message - Le message à afficher dans la notification.
 * @param {string} type - Le type de notification ('success', 'info', 'warn', 'error'). Par défaut, 'success'.
 */
export function afficherToast(titre = null, message, type = 'success') {
  if (!toastInstance) {
    console.error('Service Toast non initialisé. Utilisez setToastInstance dans un composant Vue avant d\'appeler afficherToast.');
    return;
  }

  const titreAffiche = titre || (() => {
    switch(type) {
      case 'success': return 'Succès';
      case 'info': return 'Information';
      case 'warn': return 'Avertissement';
      case 'error': return 'Erreur';
      default: return 'Succès';
    }
  })();

  toastInstance.add({
    severity: type,
    summary: titreAffiche,
    detail: message,
    life: 4500,
    closable: true
  });

  // Applique la désactivation du focus après l'ajout du toast
  preventTabFocus();
}
