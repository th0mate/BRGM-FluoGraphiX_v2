/**
 * Service d'internationalisation pour utilisation en dehors des composants Vue
 * Permet d'accéder aux traductions depuis n'importe quel fichier JavaScript/TypeScript
 */
import i18n from './i18n';


/**
 * Traduit une clé en utilisant le système i18n
 * @param key Clé de traduction
 * @param params Paramètres optionnels pour la traduction
 * @returns Texte traduit
 */
export function t(key: string, params?: Record<string, any>): string {
  if (!i18n.global) {
    console.warn(`i18n global non disponible lors de la traduction de "${key}"`);
    return key;
  }
  return i18n.global.t(key, params);
}


/**
 * Récupère la locale actuelle
 * @returns Code de langue actif
 */
export function getLocale(): string {
  if (!i18n.global) return 'fr';
  return i18n.global.locale.value;
}


/**
 * Change la locale active
 * @param locale Nouvelle locale
 */
export function setLocale(locale: string): void {
  if (!i18n.global) return;
  i18n.global.locale.value = locale;
  localStorage.setItem('locale', locale);
}


export default {
  t,
  getLocale,
  setLocale
};
