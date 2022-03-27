/**
 * TODO: Replace with discord-api-types
 * Grabbed from discord-api-types (We can't use it from the package because it's not in a package version 0.26.1)
 */
export enum Locale {
	EnglishUS = 'en-US',
	EnglishGB = 'en-GB',
	Bulgarian = 'bg',
	ChineseCN = 'zh-CN',
	ChineseTW = 'zh-TW',
	Croatian = 'hr',
	Czech = 'cs',
	Danish = 'da',
	Dutch = 'nl',
	Finnish = 'fi',
	French = 'fr',
	German = 'de',
	Greek = 'el',
	Hindi = 'hi',
	Hungarian = 'hu',
	Italian = 'it',
	Japanese = 'ja',
	Korean = 'ko',
	Lithuanian = 'lt',
	Norwegian = 'no',
	Polish = 'pl',
	PortugueseBR = 'pt-BR',
	Romanian = 'ro',
	Russian = 'ru',
	SpanishES = 'es-ES',
	Swedish = 'sv-SE',
	Thai = 'th',
	Turkish = 'tr',
	Ukrainian = 'uk',
	Vietnamese = 'vi',
}

export type LocaleString = `${Locale}`;