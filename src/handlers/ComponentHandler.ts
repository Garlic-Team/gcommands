import {Collection, MessageComponentInteraction} from 'discord.js';
import {GClient} from '../lib/GClient';
import {ComponentType} from '../lib/structures/Component';
import {ComponentContext} from '../lib/structures/ComponentContext';

const cooldowns = new Collection<string, Collection<string, number>>();

export async function ComponentHandler(interaction: MessageComponentInteraction) {
	const client = interaction.client as GClient;

	const regex = new RegExp('[A-Za-z0-9]+', 'gd');
	const args = interaction.customId.match(regex);

	const component = client.gcomponents.get(args.shift());
	if (!component || !component.type.includes(interaction.isButton() ? ComponentType.BUTTON : ComponentType.SELECT_MENU) || (component.guildId && component.guildId !== interaction.guildId)) return;

	if (component.cooldown) {
		const cooldown = client.ghandlers.cooldownHandler(interaction.user.id, component, cooldowns);
		if (cooldown) return interaction.reply({
			content: client.responses.COOLDOWN.replace('{time}', String(cooldown)).replace('{name}', component.name + (interaction.isButton() ? ' button' : ' select menu')),
			ephemeral: true,
		});
	}

	const ctx = ComponentContext.createWithInteraction(interaction, component, args);

	if (!await component.inhibit(ctx)) return;

	await Promise.resolve(component.run(ctx)).catch(async (error) => {
		const errorReply = () => ctx.interaction.replied ? ctx.editReply(client.responses.ERROR) : ctx.reply({
			content: client.responses.ERROR,
			ephemeral: true,
		});
		if (typeof component.onError === 'function') await Promise.resolve(component.onError(ctx, error)).catch(async () => await errorReply());
		else await errorReply();
	});
}
