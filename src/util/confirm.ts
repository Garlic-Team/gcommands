import {CommandContext} from '../lib/structures/contexts/CommandContext';
import {ButtonInteraction, MessageActionRow, MessageButton} from 'discord.js';
import {CustomId} from './CustomId';
import {ComponentContext} from '../lib/structures/contexts/ComponentContext';

export interface ConfirmOptions {
	message?: string | ((ctx: CommandContext | ComponentContext) => string);
	time?: number;
	ephemeral?: boolean;
	button?: {
		label?: string;
		style?: 'DANGER' | 'SUCCESS' | 'PRIMARY' | 'SECONDARY';
		emoji?: string;
	};
}

export async function confirm(ctx: CommandContext | ComponentContext, options: ConfirmOptions = {}) {
	const customId = CustomId('confirm', ctx.userId);
	const button = new MessageButton()
		.setCustomId(customId)
		.setLabel('Confirm')
		.setStyle('DANGER');

	if (typeof options.button?.label === 'string') button.setLabel(options.button.label);
	if (typeof options.button?.style === 'string') button.setStyle(options.button.style);
	if (typeof options.button?.emoji === 'string') button.setEmoji(options.button.emoji);

	const row = new MessageActionRow().addComponents([button]);

	const messageContent = {
		content: typeof options.message === 'function' ? options.message(ctx) : options.message || 'Are you sure?',
		components: [row],
		ephemeral: options.ephemeral,
	};

	ctx.deferred ? await ctx.editReply(messageContent) : await ctx.reply(messageContent);

	const filter = (interaction: ButtonInteraction) => {
		return interaction.customId === customId && interaction.user.id === ctx.userId;
	};

	const result = await ctx.channel.awaitMessageComponent({
		filter,
		time: options.time || 10000,
		componentType: 'BUTTON'
	}).catch(() => {
		return undefined;
	});

	return result !== undefined;
}
