/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 */
let toastInstance = null;


/**
 * Configure le service Toast avec l'instance PrimeVue
 * @param {Object} instance - L'instance de toast retournée par useToast() dans un composant Vue
 */
export function setToastInstance(instance) {
  toastInstance = instance;
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
    life: 3000,
    closable: true
  });
}
