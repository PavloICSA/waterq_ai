import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enAbout from './locales/en/about.json';
import enGuidelines from './locales/en/guidelines.json';
import enOtherApps from './locales/en/otherapps.json';
import enPrivacy from './locales/en/privacypolicy.json';
import enTerms from './locales/en/terms.json';
import enContact from './locales/en/contact.json';
import enMain from './locales/en/main.json';
import enHeader from './locales/en/header.json';
import enInput from './locales/en/input.json';
import enReferences from './locales/en/references.json';
import enResults from './locales/en/results.json';
import enDonation from './locales/en/donation.json';
import enFooter from './locales/en/footer.json';

import ukAbout from './locales/uk/about.json';
import ukGuidelines from './locales/uk/guidelines.json';
import ukOtherApps from './locales/uk/otherapps.json';
import ukPrivacy from './locales/uk/privacypolicy.json';
import ukTerms from './locales/uk/terms.json';
import ukContact from './locales/uk/contact.json';
import ukMain from './locales/uk/main.json';
import ukHeader from './locales/uk/header.json';
import ukInput from './locales/uk/input.json';
import ukReferences from './locales/uk/references.json';
import ukResults from './locales/uk/results.json';
import ukDonation from './locales/uk/donation.json';
import ukFooter from './locales/uk/footer.json';

const resources = {
  en: {
    about: enAbout,
    guidelines: enGuidelines,
    otherapps: enOtherApps,
    privacy: enPrivacy,
    terms: enTerms,
    contact: enContact,
    main: enMain,
    header: enHeader,
    input: enInput,
    references: enReferences,
    results: enResults,
    donation: enDonation,
    footer: enFooter,
    common: {
      appName: "WaterQ AI",
      appDescription: "Water quality analysis for sustainable agriculture",
      appSubtitle: "Advanced water quality analysis for sustainable agriculture",
      navigation: {
        analysis: "Analysis",
        about: "About",
        guidelines: "Guidelines", 
        references: "References",
        support: "Support Us",
        otherApps: "Other Apps"
      },
      buttons: {
        calculate: "Calculate Water Quality",
        clearResults: "Clear Results",
        downloadPdf: "Download PDF",
        analyzeNow: "Analyze Now",
        analyze: "Analyze"
      },
      footer: {
        madeWith: "Made with",
        forSustainability: "for agricultural sustainability",
        allRightsReserved: "All rights reserved.",
        privacyPolicy: "Privacy Policy",
        termsOfUse: "Terms of Use",
        contact: "Contact"
      }
    }
  },
  uk: {
    about: ukAbout,
    guidelines: ukGuidelines,
    otherapps: ukOtherApps,
    privacy: ukPrivacy,
    terms: ukTerms,
    contact: ukContact,
    main: ukMain,
    header: ukHeader,
    input: ukInput,
    references: ukReferences,
    results: ukResults,
    donation: ukDonation,
    footer: ukFooter,
    common: {
      appName: "WaterQ AI",
      appDescription: "Аналіз якості води для сталого сільського господарства",
      appSubtitle: "Передовий аналіз якості води для сталого сільського господарства",
      navigation: {
        analysis: "Аналіз",
        about: "Про нас",
        guidelines: "Інструкції",
        references: "Джерела",
        support: "Підтримайте нас",
        otherApps: "Інші додатки"
      },
      buttons: {
        calculate: "Розрахувати якість води",
        clearResults: "Очистити результати",
        downloadPdf: "Завантажити PDF",
        analyzeNow: "Аналізувати зараз",
        analyze: "Аналіз"
      },
      footer: {
        madeWith: "Зроблено з",
        forSustainability: "заради сталого сільського господарства",
        allRightsReserved: "Усі права захищено.",
        privacyPolicy: "Політика конфіденційності",
        termsOfUse: "Умови використання",
        contact: "Контакти"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    ns: [
      'about', 'guidelines', 'otherapps', 'privacy',
      'terms', 'contact', 'main', 'header',
      'input', 'references', 'results', 'donation',
      'footer', 'common'
    ],
    defaultNS: 'common'
  });

export default i18n;