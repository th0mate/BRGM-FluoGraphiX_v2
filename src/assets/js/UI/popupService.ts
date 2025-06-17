/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 * Service de gestion des popups dans l'application avec une approche Vue.js
 */
import { reactive, readonly } from 'vue';
import { t } from '@/locales/i18nService';

interface PopupState {
  visible: boolean;
  headerTitle: string;
  title: string;
  content: string;
  buttonText: string;
  imageUrl: string;
  imageHtml: string;
}

// État initial du popup
const state = reactive<PopupState>({
  visible: false,
  headerTitle: '',
  title: '',
  content: '',
  buttonText: t('buttons.close'), // Utilisation de la traduction par défaut
  imageUrl: '',
  imageHtml: ''
});

// Actions pour manipuler l'état du popup
const actions = {
  /**
   * Affiche un popup avec les éléments correspondants
   * @param options Les options du popup
   */
  showPopup(options: {
    imageUrl?: string,
    imageHtml?: string,
    headerTitle?: string,
    title?: string,
    content?: string,
    buttonText?: string
  }) {
    // Réinitialiser l'état d'abord
    this.resetPopup();

    // Mettre à jour l'état avec les nouvelles valeurs
    if (options.imageUrl) state.imageUrl = options.imageUrl;
    if (options.imageHtml) state.imageHtml = options.imageHtml;
    if (options.headerTitle) state.headerTitle = options.headerTitle;
    if (options.title) state.title = options.title;
    if (options.content) state.content = options.content;
    if (options.buttonText) state.buttonText = options.buttonText;

    // Afficher le popup
    state.visible = true;

    // Désactiver le défilement du body
    document.body.style.overflowY = 'hidden';
  },

  /**
   * Ferme le popup
   */
  closePopup() {
    state.visible = false;

    // Réactiver le défilement du body
    document.body.style.overflowY = 'auto';
  },

  /**
   * Réinitialise l'état du popup
   */
  resetPopup() {
    state.visible = false;
    state.headerTitle = '';
    state.title = '';
    state.content = '';
    state.buttonText = t('buttons.close'); // Utilisation de la traduction
    state.imageUrl = '';
    state.imageHtml = '';
  }
};

// Exporter un état en lecture seule et les actions
export default {
  state: readonly(state),
  ...actions
};

/**
 * Pour maintenir la compatibilité avec l'ancienne API
 * @deprecated Utiliser popupService.showPopup() à la place
 */
export function afficherPopup(
  imageHTML: string,
  titreOnglet: string,
  titre: string,
  contenu: string,
  texteBouton: string
): void {
  const headerTitle = titreOnglet.includes('.') ? t(titreOnglet) : titreOnglet;
  const title = titre.includes('.') ? t(titre) : titre;
  const content = contenu.includes('.') ? t(contenu) : contenu;
  const buttonText = texteBouton.includes('.') ? t(texteBouton) : texteBouton;

  actions.showPopup({
    imageHtml: imageHTML,
    headerTitle,
    title,
    content,
    buttonText
  });
}

/**
 * Pour maintenir la compatibilité avec l'ancienne API
 * @deprecated Utiliser popupService.closePopup() à la place
 */
export function fermerPopup(): void {
  actions.closePopup();
}
