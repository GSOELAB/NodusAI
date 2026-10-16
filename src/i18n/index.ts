import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/translation.json';
import ru from './locales/ru/translation.json';
import { getLanguage } from 'obsidian';

export const i18nReady = i18n.use(initReactI18next).init({
	resources: {
		en: { translation: en },
		ru: { translation: ru },
	},
	lng: getLanguage(),
	fallbackLng: 'en',
	supportedLngs: ['en', 'ru'],
	load: 'languageOnly',
	debug: false,
	interpolation: {
		escapeValue: false,
	},
});

export default i18n;
