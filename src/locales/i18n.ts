import { createI18n } from 'vue-i18n';
import fr from './fr';
import en from './en';

const defaultLocale = localStorage.getItem('locale') ||
  navigator.language.split('-')[0] || 'fr';

const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: 'fr',
  messages: {
    fr,
    en
  }
});

export default i18n;
