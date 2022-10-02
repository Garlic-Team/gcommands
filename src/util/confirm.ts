import {
	ButtonInteraction,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ComponentType,
} from 'discord.js';
import { customId } from './customId';
import type { CommandContext } from '../lib/structures/contexts/CommandContext';
import type { ComponentContext } from '../lib/structures/contexts/ComponentContext';

export interface ConfirmOptions {
	message?: string | ((ctx: CommandContext | ComponentContext) => string);
	time?: number;
	ephemeral?: boolean;
	button?: {
		label?: string;
		style?: ButtonStyle;
		emoji?: string;
	};
}

export async function confirm(
	ctx: CommandContext | ComponentContext,
	options: ConfirmOptions = {},
) {
	const id = customId('confirm', ctx.userId);
	const button = new ButtonBuilder()
		.setCustomId(id)
		.setLabel('Confirm')
		.setStyle(ButtonStyle.Danger);

	if (typeof options.button?.label === 'string')
		button.setLabel(options.button.label);
	if (typeof options.button?.style === 'string')
		button.setStyle(options.button.style);
	if (typeof options.button?.emoji === 'string')
		button.setEmoji(options.button.emoji);

	const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

	const messageContent = {
		content:
			typeof options.message === 'function'
				? options.message(ctx)
				: options.message || 'Are you sure?',
		components: [row],
		ephemeral: options.ephemeral,
	};

	ctx.deferred
		? await ctx.editReply(messageContent)
		: await ctx.reply(messageContent);

	const filter = (interaction: ButtonInteraction) =>
		interaction.customId === id && interaction.user.id === ctx.userId;

	const result = await ctx.channel
		?.awaitMessageComponent({
			filter,
			time: options.time || 10000,
			componentType: ComponentType.Button,
		})
		?.catch(() => undefined);

	if (result instanceof ButtonInteraction) result.deferUpdate();

	return result !== undefined;
}
