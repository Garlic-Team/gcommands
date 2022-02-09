import { Collection, MessageComponentInteraction } from 'discord.js';
import { AutoDeferType, GClient } from '../lib/GClient';
import { ComponentType } from '../lib/structures/Component';
import { ComponentContext } from '../lib/structures/contexts/ComponentContext';
import { Components } from '../lib/managers/ComponentManager';
import { Handlers } from '../lib/managers/HandlerManager';
import { setTimeout } from 'node:timers';
import { Logger, Events } from '../lib/util/logger/Logger';

const cooldowns = new Collection<string, Collection<string, number>>();

export async function ComponentHandler(interaction: MessageComponentInteraction) {
	const client = interaction.client as GClient;

	const regex = new RegExp('[A-Za-z0-9]+', 'gd');
	const args = interaction.customId.match(regex);

	const component = Components.get(args.shift());
	if (
		!component ||
		!component.type.includes(interaction.isButton() ? ComponentType.BUTTON : ComponentType.SELECT_MENU) ||
		(component.guildId && component.guildId !== interaction.guildId)
	)
		return;

	if (component.cooldown) {
		const cooldown = Handlers.cooldownHandler(interaction.user.id, component, cooldowns);
		if (cooldown)
			return interaction.reply({
				content: client.responses.COOLDOWN.replace('{time}', String(cooldown)).replace(
					'{name}',
					component.name + (interaction.isButton() ? ' button' : ' select menu'),
				),
				ephemeral: true,
			});
	}

	const ctx = new ComponentContext(client, {
		interaction: interaction,
		channel: interaction.channel,
		createdAt: interaction.createdAt,
		createdTimestamp: interaction.createdTimestamp,
		guild: interaction.guild,
		guildId: interaction.guildId,
		user: interaction.user,
		member: interaction.member,
		memberPermissions: interaction.memberPermissions,
		component: component,
		customId: interaction.customId,
		arguments: args,
		values: interaction.isSelectMenu() ? interaction.values : undefined,
		deferReply: interaction.deferReply.bind(interaction),
		deferUpdate: interaction.deferUpdate.bind(interaction),
		deleteReply: interaction.deleteReply.bind(interaction),
		editReply: interaction.editReply.bind(interaction),
		fetchReply: interaction.fetchReply.bind(interaction),
		followUp: interaction.followUp.bind(interaction),
		reply: interaction.reply.bind(interaction),
		type: interaction.isButton() ? 'BUTTON' : 'SELECT_MENU',
	});

	if (!(await component.inhibit(ctx))) return;

	let autoDeferTimeout;
	if (component.autoDefer)
		autoDeferTimeout = setTimeout(() => {
			component.autoDefer === AutoDeferType.UPDATE
				? ctx.deferUpdate()
				: ctx.deferReply({ ephemeral: component.autoDefer === AutoDeferType.EPHEMERAL });
		}, 2500 - client.ws.ping);

	await Promise.resolve(component.run(ctx))
		.catch(async (error) => {
			Logger.emit(Events.HANDLER_ERROR, ctx, error);
			Logger.emit(Events.COMPONENT_HANDLER_ERROR, ctx, error);
			Logger.error(typeof error.code !== 'undefined' ? error.code : '', error.message);
			if (error.stack) Logger.trace(error.stack);
			const errorReply = () =>
				ctx.safeReply({
					content: client.responses.ERROR,
					ephemeral: true,
					components: [],
				});
			if (typeof component.onError === 'function')
				await Promise.resolve(component.onError(ctx, error)).catch(async () => await errorReply());
			else await errorReply();
		})
		.then(() => {
			Logger.emit(Events.HANDLER_RUN, ctx);
			Logger.emit(Events.COMPONENT_HANDLER_RUN, ctx);
			if (autoDeferTimeout) clearTimeout(autoDeferTimeout);
			Logger.debug(`Successfully ran component (${component.name}) for ${interaction.user.username}`);
		});
}
