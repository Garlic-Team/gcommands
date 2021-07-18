const languages = [
	{
		label: 'english',
		lang: 'en',
		aliases: ['eng'],
	},
	{
		label: 'turkish',
		lang: 'tk',
		aliases: ['trk'],
	}
];

const [defaultLanguages] = languages;

export default {
	data() {
		return {
			languages,
			defaultLanguages,
			selectedLanguage: defaultLanguages.lang,
		};
	},
	mounted() {
		this.selectedLanguage = localStorage.getItem('language-lang') || defaultLanguages.lang;
	},
	methods: {
		getLanguage(version) {
			return this.languages.find(branch => branch.aliases.includes(version) || branch.lang === version);
		},
		updateLanguage(lang) {
			this.selectedLanguage = lang;
		},
	},
};