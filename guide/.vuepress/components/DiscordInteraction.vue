<template>
	<div class="discord-interaction">
		<img class="discord-interaction-author-avatar" :src="user.avatar" alt="" />
		<author-info
			class="discord-interaction-author-info"
			:author="highlight ? `@${user.author}` : user.author"
			:bot="user.bot"
			:role-color="user.roleColor"
		/>
		<span v-if="command" class="discord-interaction-command">
			used
			<span class="discord-interaction-command-name">
				/<slot></slot>
			</span>
		</span>
		<span v-else class="discord-interaction-reply">
			<slot></slot>
			<span v-if="edited" class="discord-interaction-reply-edited">(edited)</span>
		</span>
	</div>
</template>

<script>
import AuthorInfo from './AuthorInfo.vue';
import filters from '../util/filters.js';
import validators from '../util/validators.js';

export default {
    name: 'DiscordInteraction',
	components: {
		AuthorInfo,
	},
	props: {
		author: {
			type: String,
			'default': 'User',
		},
		avatar: String,
		bot: {
			type: Boolean,
			'default': null,
		},
		command: Boolean,
		edited: Boolean,
		ephemeral: Boolean,
		highlight: Boolean,
		profile: String,
		roleColor: String,
	},
	computed: {
		ephemeralMessage() {
			return this.$parent.layout['discord-ephemeral-highlight'];
		},
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
	},
}
</script>

<style>
.discord-interaction {
	color: #b9bbbe;
	display: flex;
	align-items: center;
	position: relative;
	width: 100%;
	font-size: 0.95em;
	margin-bottom: 4px;
	padding-left: 56px;
	line-height: 150%;
	box-sizing: border-box;
}

.discord-compact-mode .discord-interaction {
	margin-bottom: 0;
	padding-left: 64px;
}

.discord-light-theme .discord-interaction {
	color: #4f5660;
}

.discord-interaction::before {
	content: '';
	display: block;
	position: absolute;
	width: 33px;
	top: 50%;
	bottom: 0;
	left: 18px;
	margin: -1px 0 0 0;
	border-top-left-radius: 6px;
	border-top: 2px solid #4f545c;
	border-left: 2px solid #4f545c;
	box-sizing: border-box;
}

.discord-compact-mode .discord-interaction::before {
	left: 26px;
}

.discord-interaction .discord-interaction-author-info {
	font-size: 1em;
	flex-direction: row-reverse;
}

.discord-interaction .discord-interaction-author-avatar {
	width: 16px;
	height: 16px;
	margin-right: 4px;
	border-radius: 50%;
}

.discord-compact-mode .discord-interaction .discord-interaction-author-avatar {
	display: none;
}

.discord-interaction .discord-interaction-author-info .discord-author-username {
	font-size: 1em;
	margin-right: 4px;
	opacity: 0.65;
}

.discord-compact-mode .discord-interaction .discord-interaction-author-info .discord-author-username {
	margin-left: 0;
}

.discord-interaction .discord-interaction-author-info .discord-author-bot-tag {
	font-size: 0.75em;
	margin: 1px 4px 0 0;
}

.discord-compact-mode .discord-interaction .discord-interaction-author-info .discord-author-bot-tag {
	font-size: 0.7em;
	padding-left: 4px;
	padding-right: 4px;
}

.discord-interaction .discord-interaction-command .discord-interaction-command-name {
	color: #7289da;
	opacity: 0.65;
}

.discord-interaction .discord-interaction-reply {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.discord-interaction .discord-interaction-reply .discord-interaction-reply-edited {
	color: #72767d;
	font-size: 10px;
	margin-left: 3px;
}

.discord-interaction .discord-interaction-reply:hover {
	color: #fff;
}

.discord-light-theme .discord-interaction .discord-interaction-reply:hover {
	color: #060607;
}
</style>