import i18n from 'sveltekit-i18n';
import lang from './lang.json';
import en from './en';
import zh from './zh';
import zh_tw from './zh-tw'

/** @type {import('sveltekit-i18n').Config} */
const config = {
	fallbackLocale: 'en',
	translations: {
		en: { lang },
		zh: { lang },
		'zh-tw': { lang }
	},
	loaders: [...en, ...zh, ...zh_tw]
};

export const defaultLocale = 'en';
export const { t, locale, locales, loading, loadTranslations } = new i18n(config);
