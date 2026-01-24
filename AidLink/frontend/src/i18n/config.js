import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from './locales/en.json';
import amTranslations from './locales/am.json';

try {
  i18n
    // Detect user language
    .use(LanguageDetector)
    // Pass the i18n instance to react-i18next
    .use(initReactI18next)
    // Initialize i18next
    .init({
      resources: {
        en: {
          translation: enTranslations,
        },
        am: {
          translation: amTranslations,
        },
      },
      lng: 'am',
      fallbackLng: 'am',
      supportedLngs: ['am', 'en'],
      nonExplicitSupportedLngs: true,
      defaultNS: 'translation',
      interpolation: {
        escapeValue: false, // React already escapes values
      },
      detection: {
        order: ['localStorage'],
        caches: ['localStorage'],
        lookupLocalStorage: 'i18nextLng',
      },
    });
} catch (error) {
  console.error('Error initializing i18n:', error);
}

export default i18n;





