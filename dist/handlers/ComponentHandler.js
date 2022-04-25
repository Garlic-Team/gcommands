"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentHandler = void 0;
const discord_js_1 = require("discord.js");
const GClient_1 = require("../lib/GClient");
const Component_1 = require("../lib/structures/Component");
const ComponentContext_1 = require("../lib/structures/contexts/ComponentContext");
const ComponentManager_1 = require("../lib/managers/ComponentManager");
const HandlerManager_1 = require("../lib/managers/HandlerManager");
const node_timers_1 = require("node:timers");
const Logger_1 = require("../lib/util/logger/Logger");
const Util_1 = require("../lib/util/Util");
const Container_1 = require("../lib/structures/Container");
const cooldowns = new discord_js_1.Collection();
async function ComponentHandler(interaction) {
    const { client } = Container_1.container;
    const regex = new RegExp('[A-Za-z0-9]+', 'gd');
    const args = interaction.customId.match(regex);
    const component = ComponentManager_1.Components.get(args?.shift());
    if (!component ||
        !component.type.includes(interaction.isButton() ? Component_1.ComponentType.BUTTON : Component_1.ComponentType.SELECT_MENU) ||
        (component.guildId && component.guildId !== interaction.guildId))
        return;
    if (component.cooldown) {
        const cooldown = HandlerManager_1.Handlers.cooldownHandler(interaction.user.id, component, cooldowns);
        if (cooldown)
            return interaction.reply({
                content: (await Util_1.Util.getResponse('COOLDOWN', interaction))
                    .replace('{time}', String(cooldown))
                    .replace('{name}', component.name + (interaction.isButton() ? ' button' : ' select menu')),
                ephemeral: true,
            });
    }
    const ctx = new ComponentContext_1.ComponentContext(client, {
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
    if (!(await component.inhibit(ctx)))
        return;
    let autoDeferTimeout;
    if (component.autoDefer)
        autoDeferTimeout = (0, node_timers_1.setTimeout)(() => {
            component.autoDefer === GClient_1.AutoDeferType.UPDATE
                ? ctx.deferUpdate()
                : ctx.deferReply({ ephemeral: component.autoDefer === GClient_1.AutoDeferType.EPHEMERAL });
        }, 2500 - client.ws.ping);
    await Promise.resolve(component.run(ctx))
        .catch(async (error) => {
        Logger_1.Logger.emit(Logger_1.Events.HANDLER_ERROR, ctx, error);
        Logger_1.Logger.emit(Logger_1.Events.COMPONENT_HANDLER_ERROR, ctx, error);
        Logger_1.Logger.error(typeof error.code !== 'undefined' ? error.code : '', error.message);
        if (error.stack)
            Logger_1.Logger.trace(error.stack);
        const errorReply = async () => ctx.safeReply({
            content: await Util_1.Util.getResponse('ERROR', interaction),
            ephemeral: true,
            components: [],
        });
        if (typeof component.onError === 'function')
            await Promise.resolve(component.onError(ctx, error)).catch(async () => await errorReply());
        else
            await errorReply();
    })
        .then(() => {
        Logger_1.Logger.emit(Logger_1.Events.HANDLER_RUN, ctx);
        Logger_1.Logger.emit(Logger_1.Events.COMPONENT_HANDLER_RUN, ctx);
        if (autoDeferTimeout)
            clearTimeout(autoDeferTimeout);
        Logger_1.Logger.debug(`Successfully ran component (${component.name}) for ${interaction.user.username}`);
    });
}
exports.ComponentHandler = ComponentHandler;
