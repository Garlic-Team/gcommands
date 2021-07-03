<template>
	<div v-if="showNotice" class="oldversion-notice">
		<!--You currently have version 3.x selected, which means you see new features. <a href="#" @click.prevent="dismiss">[Dismiss]</a>-->
		We no longer provide support, maintain bug fixes or new features for v3 of gcommands. <a href="/guide/additional/fromv3tov4">Please update your bot to version 4.</a>
	</div>
</template>

<script>
import semver from 'semver';
import eventBus from '../eventBus.js';
import branches from '../mixins/branches.js';
export default {
	mixins: [branches],
	data() {
		return {
			hideUntil: null,
		};
	},
	computed: {
		showNotice() {
			return semver.satisfies(semver.coerce('3.x'), this.selectedBranch) && (!this.hideUntil || Date.now() > parseInt(this.hideUntil));
		},
	},
	mounted() {
		eventBus.$on('branch-update', this.updateBranch);
		this.hideUntil = localStorage.getItem('oldversion-notice-expiration');
	},
	destroyed() {
		eventBus.$off('branch-update', this.updateBranch);
	},
	methods: {
		dismiss() {
			const expirationTimestamp = Date.now() + (7 * 60 * 60 * 24 * 1000);
			this.hideUntil = expirationTimestamp;
			localStorage.setItem('oldversion-notice-expiration', expirationTimestamp);
		},
	},
};
</script>

<style lang="stylus">
.oldversion-notice {
	background-color: #fff;
	position: fixed;
	right: 1rem;
	bottom: 1rem;
	left: 21rem;
	padding: 1em;
	border: 1px solid #3eaf7c;
	border-radius: 4px;
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
	text-align: center;
	z-index: 100;
	@media (max-width: 959px) {
		left: 17.4rem;
	}
	@media (max-width: 719px) {
		left: 1rem;
	}
}
.yuu-theme-dark .oldversion-notice {
	background-color: #1a1a1a;
}
.yuu-theme-blue .oldversion-notice {
	border-color: #2196f3;
}
.yuu-theme-red .oldversion-notice {
	border-color: #de3636;
}
.yuu-theme-purple .oldversion-notice {
	border-color: #a846eb;
}
</style>