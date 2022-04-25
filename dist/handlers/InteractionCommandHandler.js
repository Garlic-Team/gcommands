"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionCommandHandler = void 0;
const discord_js_1 = require("discord.js");
const GClient_1 = require("../lib/GClient");
const CommandContext_1 = require("../lib/structures/contexts/CommandContext");
const HandlerManager_1 = require("../lib/managers/HandlerManager");
const CommandManager_1 = require("../lib/managers/CommandManager");
const node_timers_1 = require("node:timers");
const Logger_1 = require("../lib/util/logger/Logger");
const Util_1 = require("../lib/util/Util");
const Container_1 = require("../lib/structures/Container");
const cooldowns = new discord_js_1.Collection();
async function InteractionCommandHandler(interaction) {
    const { client } = Container_1.container;
    const command = CommandManager_1.Commands.get(interaction.commandName);
    if (!command) {
        if (client.options.unknownCommandMessage)
            interaction.reply({
                content: await Util_1.Util.getResponse('NOT_FOUND', { client }),
            });
        return;
    }
    if (command.cooldown) {
        const cooldown = HandlerManager_1.Handlers.cooldownHandler(interaction.user.id, command, cooldowns);
        if (cooldown)
            return interaction.reply({
                content: (await Util_1.Util.getResponse('COOLDOWN', interaction))
                    .replace('{time}', String(cooldown))
                    .replace('{name}', command.name + ' command'),
                ephemeral: true,
            });
    }
    const ctx = new CommandContext_1.CommandContext(client, {
        interaction: interaction,
        channel: interaction.channel,
        createdAt: interaction.createdAt,
        createdTimestamp: interaction.createdTimestamp,
        guild: interaction.guild,
        guildId: interaction.guildId,
        user: interaction.user,
        member: interaction.member,
        memberPermissions: interaction.memberPermissions,
        command: command,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        arguments: interaction.options,
        deferReply: interaction.deferReply.bind(interaction),
        deleteReply: interaction.deleteReply.bind(interaction),
        editReply: interaction.editReply.bind(interaction),
        fetchReply: interaction.fetchReply.bind(interaction),
        followUp: interaction.followUp.bind(interaction),
        reply: interaction.reply.bind(interaction),
    });
    if (!(await command.inhibit(ctx)))
        return;
    let autoDeferTimeout;
    if (command.autoDefer)
        autoDeferTimeout = (0, node_timers_1.setTimeout)(() => {
            ctx.deferReply({ ephemeral: command.autoDefer === GClient_1.AutoDeferType.EPHEMERAL });
        }, 2500 - client.ws.ping);
    await Promise.resolve(command.run(ctx))
        .catch(async (error) => {
        Logger_1.Logger.emit(Logger_1.Events.HANDLER_ERROR, ctx, error);
        Logger_1.Logger.emit(Logger_1.Events.COMMAND_HANDLER_ERROR, ctx, error);
        Logger_1.Logger.error(typeof error.code !== 'undefined' ? error.code : '', error.message);
        if (error.stack)
            Logger_1.Logger.trace(error.stack);
        const errorReply = async () => ctx.safeReply({
            content: await Util_1.Util.getResponse('ERROR', interaction),
            components: [],
            ephemeral: true,
        });
        if (typeof command.onError === 'function')
            await Promise.resolve(command.onError(ctx, error)).catch(async () => await errorReply());
        else
            await errorReply();
    })
        .then(() => {
        Logger_1.Logger.emit(Logger_1.Events.HANDLER_RUN, ctx);
        Logger_1.Logger.emit(Logger_1.Events.COMMAND_HANDLER_RUN, ctx);
        if (autoDeferTimeout)
            clearTimeout(autoDeferTimeout);
        Logger_1.Logger.debug(`Successfully ran command (${command.name}) for ${interaction.user.username}`);
    });
}
exports.InteractionCommandHandler = InteractionCommandHandler;
