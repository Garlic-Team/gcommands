<template>
	<span v-show="displayContent" :style="{ display: inline ? 'inline-block' : 'block' }">
		<slot></slot>
	</span>
</template>

<script>
import eventBus from '../eventBus.js';
import languages from '../mixins/languages.js';
export default {
	name: 'Language',
	mixins: [languages],
	props: {
		lang: {
			type: String,
			required: true,
		},
		inline: {
			type: Boolean,
			'default': false,
		},
	},
	computed: {
		displayContent() {
			if(this.lang == this.selectedLanguage) return true;
			else return false;
		},
	},
	mounted() {
		eventBus.$on('language-update', this.updateLanguage);
	},
	destroyed() {
		eventBus.$off('language-update', this.updateLanguage);
	},
};
</script>
