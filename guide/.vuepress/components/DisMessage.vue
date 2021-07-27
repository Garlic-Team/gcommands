<template>
	<div
		class="discord-message"
		:class="{
			'discord-ephemeral-highlight': ephemeralMessage
		}"
	>
		<slot name="interactions"></slot>
		<div class="discord-message-content">
			<div class="discord-author-avatar">
				<img :src="user.avatar" alt="" />
			</div>
			<div class="discord-message-body">
				<div v-if="!compactMode">
					<author-info :bot="user.bot" :role-color="user.roleColor">
						{{ user.author }}
					</author-info>
					<span class="discord-message-timestamp">
						{{ timestamp | formatDate | padZeroes }}
					</span>
				</div>
				<template v-else>
					<span class="discord-message-timestamp">
						{{ timestamp | formatDate | padZeroes }}
					</span>
					<author-info :bot="user.bot" :role-color="user.roleColor">
						{{ user.author }}
					</author-info>
				</template>
				<slot></slot>
				<span v-if="edited" class="discord-message-edited">(edited)</span>
				<slot name="embeds"></slot>
				<slot name="actions"></slot>
				<div v-if="ephemeralMessage" class="discord-message-ephemeral-notice">
					Only you can see this
				</div>
				<slot name="reactions"></slot>
			</div>
		</div>
	</div>
</template>

<script>
import AuthorInfo from './AuthorInfo.vue';
import filters from '../util/filters.js';
import validators from '../util/validators.js';
const now = new Date();
export default {
	name: 'DisMessage',
	components: { AuthorInfo },
	filters: filters.dates,
	props: {
		author: {
			type: String,
			'default': 'User',
		},
		avatar: String,
		bot: Boolean,
		edited: Boolean,
		roleColor: String,
		timestamp: {
			type: [Date, String],
			'default': () => now,
			validator: validators.dates.validator,
		},
		profile: String,
	},
	data() {
		return {
			highlightMention: false,
		};
	},
	computed: {
		compactMode() {
			return this.$parent.layout['discord-compact-mode'];
		},
		user() {
			const { $discordMessage } = this.$root;
			const resolveAvatar = avatar => $discordMessage.avatars[avatar] || avatar || $discordMessage.avatars.default;
			const profile = $discordMessage.profiles[this.profile] || {};
			const props = { author: this.author, bot: this.bot, roleColor: this.roleColor };
			return Object.assign(props, profile, { avatar: resolveAvatar(this.avatar || profile.avatar) });
		},
		ephemeralMessage() {
			return this.$parent.layout['discord-ephemeral-highlight'];
		}
	},
	mounted() {
		this.highlightMention = this.$children.some(child => {
			return child.$options.name === 'Mention' && child.$props.highlight && child.$props.type !== 'channel';
		});
	},
};
</script>

<style>
.discord-message {
	color: #dcddde;
	display: flex;
	flex-direction: column;
	font-size: 0.9em;
	margin: 1em 0;
	padding: 0.25em 1em 0;
}
.discord-message:hover {
	background-color: #32353b;
}
.discord-light-theme .discord-message {
	color: #2e3338;
}
.discord-light-theme .discord-message:hover {
	background-color: #fafafa;
}
.discord-message a {
	color: #0096cf;
	font-weight: normal;
	text-decoration: none;
}
.discord-message a:hover {
	text-decoration: underline;
}
.discord-light-theme .discord-message a {
	color: #00b0f4;
}
.discord-message .discord-author-avatar {
	margin-top: 1px;
	margin-right: 16px;
	min-width: 40px;
}
.discord-message .discord-author-avatar img {
	width: 40px;
	height: 40px;
	border-radius: 50%;
}
.discord-message .discord-message-content .discord-message-timestamp {
	color: #72767d;
	font-size: 12px;
	margin-left: 3px;
}
.discord-message .discord-message-edited {
	color: #72767d;
	font-size: 10px;
}
.discord-message .discord-message-content {
	display: flex;
	width: 100%;
	line-height: 160%;
	font-weight: normal;
	overflow-wrap: anywhere;
}

.discord-message .discord-message-body {
	position: relative;
}

.discord-message .discord-message-body .discord-message-edited {
	color: #72767d;
	font-size: 10px;
	margin-left: 3px;
}

.discord-message .discord-message-ephemeral-notice {
	color: #72767d;
	font-size: 12px;
	margin-top: 4px;
}

.discord-light-theme .discord-message .discord-message-content .discord-message-timestamp,
.discord-compact-mode .discord-message:hover .discord-message-content .discord-message-timestamp,
.discord-compact-mode.discord-light-theme .discord-message:hover .discord-message-content .discord-message-timestamp {
	color: #99aab5;
}


.discord-compact-mode .discord-message .discord-message-content .discord-message-timestamp {
	display: inline-block;
	min-width: 48px;
	font-size: 11px;
	margin-left: 0;
	margin-right: 3px;
	text-align: right;
}

.discord-compact-mode.discord-light-theme .discord-message .discord-message-content .discord-message-timestamp {
	color: #d1d9de;
}

.discord-message .discord-message-body {
	position: relative;
	width: 100%;
}

.discord-compact-mode .discord-message-body {
	margin-left: 0.25em;
}

.discord-message.discord-ephemeral-highlight {
	background-color: rgba(88, 101, 242, 0.05);
}

.discord-message.discord-mention-highlight {
	background-color: rgba(250, 166, 26, 0.1);
}

.discord-message.discord-ephemeral-highlight,
.discord-message.discord-mention-highlight {
	position: relative;
}

.discord-message.discord-ephemeral-highlight::before,
.discord-message.discord-mention-highlight::before {
	content: '';
	display: block;
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	width: 2px;
}

.discord-message.discord-ephemeral-highlight::before {
	background-color: #5865f2;
}

.discord-message.discord-mention-highlight::before {
	background-color: #faa61a;
}

.discord-message.discord-ephemeral-highlight:hover {
	background-color: rgba(88, 101, 242, 0.1);
}

.discord-message.discord-mention-highlight:hover {
	background-color: rgba(250, 166, 26, 0.08);
}
</style>