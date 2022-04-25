"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutocompleteHandler = void 0;
const AutocompleteContext_1 = require("../lib/structures/contexts/AutocompleteContext");
const CommandManager_1 = require("../lib/managers/CommandManager");
const Logger_1 = require("../lib/util/logger/Logger");
const Container_1 = require("../lib/structures/Container");
async function AutocompleteHandler(interaction) {
    const { client } = Container_1.container;
    const command = CommandManager_1.Commands.get(interaction.commandName);
    if (!command)
        return;
    let args = command.arguments;
    if (interaction.options.getSubcommandGroup(false))
        args = args.find((argument) => argument.name === interaction.options.getSubcommandGroup())?.arguments;
    if (interaction.options.getSubcommand(false))
        args = args.find((argument) => argument.name === interaction.options.getSubcommand())?.arguments;
    const focused = interaction.options.getFocused(true);
    const argument = args.find((argument) => argument.name === focused.name);
    if (!argument)
        return;
    const ctx = new AutocompleteContext_1.AutocompleteContext(client, {
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
        argument: argument,
        value: focused.value,
        respond: interaction.respond.bind(interaction),
    });
    await Promise.resolve(argument.run(ctx))
        .catch((error) => {
        Logger_1.Logger.emit(Logger_1.Events.HANDLER_ERROR, ctx, error);
        Logger_1.Logger.emit(Logger_1.Events.AUTOCOMPLETE_HANDLER_ERROR, ctx, error);
        Logger_1.Logger.error(typeof error.code !== 'undefined' ? error.code : '', error.message);
        if (error.stack)
            Logger_1.Logger.trace(error.stack);
    })
        .then(() => {
        Logger_1.Logger.emit(Logger_1.Events.HANDLER_RUN, ctx);
        Logger_1.Logger.emit(Logger_1.Events.AUTOCOMPLETE_HANDLER_RUN, ctx);
        Logger_1.Logger.debug(`Successfully ran autocomplete (${argument.name} -> ${command.name}) for ${interaction.user.username}`);
    });
}
exports.AutocompleteHandler = AutocompleteHandler;
