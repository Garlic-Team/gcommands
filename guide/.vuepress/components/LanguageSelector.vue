<template>
	<div class="branch-selector-wrapper">
		<label for="branch-selector" class="branch-selector-label">Language:</label>
		<select id="branch-selector" v-model="selectedLanguage" @change="updateLanguage">
			<option v-for="language in languages" :key="language.lang" :value="language.lang">
				{{ language.label }}
			</option>
		</select>
	</div>
</template>

<script>
import eventBus from '../eventBus.js';
import languages from '../mixins/languages.js';

function getVersionFromRoute({ query, hash }) {
	const versionRegex = /\?(?:lang)=(.*)/;
	return query.lang || query.lang || (hash.length && versionRegex.test(hash) ? hash.match(versionRegex)[1] : null);
}

export default {
	name: 'LanguageSelector',
	mixins: [languages],
	mounted() {
		const language = this.getLanguage(getVersionFromRoute({ query: this.$route.query, hash: this.$route.hash }));
		if (language) {
			this.selectedLanguage = language.lang;
			return this.updateLanguage();
		}
	},
	methods: {
		updateLanguage() {
			localStorage.setItem('language-lang', this.selectedLanguage);
			eventBus.$emit('language-update', this.selectedLanguage);
		},
	},
};
</script>

<style lang="stylus">
.user-options-before {
	display: flex;
}
.branch-selector-wrapper {
	display: flex;
	margin-right: 1em;
	min-width: 240px;
	.branch-selector-label {
		margin-right: 0.5em;
	}
	#branch-selector {
		display: block;
		width: 100%;
		border-color: #eaecef;
		padding: 5px;
		box-sizing: border-box;
		border-radius: 4px;
	}
	@media screen and (max-width: $MQMobile) {
		min-width: unset;
		.branch-selector-label {
			display: none;
		}
	}
}
.yuu-theme-dark #branch-selector {
	color: #f3f3f3;
	background-color: #1a1a1a;
	border-color: rgba(255, 255, 255, 0.1);
}
</style>
