import {Collection, MessageComponentInteraction} from 'discord.js';
import {AutoDeferType, GClient} from '../lib/GClient';
import {ComponentType} from '../lib/structures/Component';
import {ComponentContext} from '../lib/structures/ComponentContext';
import {Components} from '../lib/managers/ComponentManager';
import {Handlers} from '../lib/managers/HandlerManager';
import Logger from 'js-logger';

const cooldowns = new Collection<string, Collection<string, number>>();

export async function ComponentHandler(interaction: MessageComponentInteraction) {
	const client = interaction.client as GClient;

	const regex = new RegExp('[A-Za-z0-9]+', 'gd');
	const args = interaction.customId.match(regex);

	const component = Components.get(args.shift());
	if (!component || !component.type.includes(interaction.isButton() ? ComponentType.BUTTON : ComponentType.SELECT_MENU) || (component.guildId && component.guildId !== interaction.guildId)) return;

	if (component.cooldown) {
		const cooldown = Handlers.cooldownHandler(interaction.user.id, component, cooldowns);
		if (cooldown) return interaction.reply({
			content: client.responses.COOLDOWN.replace('{time}', String(cooldown)).replace('{name}', component.name + (interaction.isButton() ? ' button' : ' select menu')),
			ephemeral: true,
		});
	}

	const ctx = ComponentContext.createWithInteraction(interaction, component, args);

	if (!await component.inhibit(ctx)) return;

	let autoDeferTimeout;
	if (component.autoDefer) autoDeferTimeout = setTimeout(() => {
		component.autoDefer === AutoDeferType.UPDATE ? ctx.deferUpdate() : ctx.deferReply({ephemeral: component.autoDefer === AutoDeferType.EPHEMERAL});
	}, 2500 - client.ws.ping);

	await Promise.resolve(component.run(ctx)).catch(async (error) => {
		Logger.error(error.code, error.message);
		if (error.stack) Logger.trace(error.stack);
		const errorReply = () => ctx.interaction.replied ? ctx.editReply(client.responses.ERROR) : ctx.reply({
			content: client.responses.ERROR,
			ephemeral: true,
		});
		if (typeof component.onError === 'function') await Promise.resolve(component.onError(ctx, error)).catch(async () => await errorReply());
		else await errorReply();
	}).then(() => {
		if (autoDeferTimeout) clearTimeout(autoDeferTimeout);
		Logger.debug(`Successfully ran component (${component.name}) for ${interaction.user.username}`);
	});
}
