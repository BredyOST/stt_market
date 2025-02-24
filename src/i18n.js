import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './shared/locales/EN/translation.json';
import ru from './shared/locales/RU/translation.json';

const resources = {
    en: {
        translation: en,
    },
    ru: {
        translation: ru,
    },
};

i18n.use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: 'en',
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    });

export default i18n;
