"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sync = void 0;
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const Logger_1 = require("./logger/Logger");
const node_timers_1 = require("node:timers");
const CommandManager_1 = require("../managers/CommandManager");
const Container_1 = require("../structures/Container");
async function _sync(client, commands, guildId) {
    const rest = new rest_1.REST({ version: '9' }).setToken(client.token);
    await rest
        .put(guildId ? v9_1.Routes.applicationGuildCommands(client.user?.id, guildId) : v9_1.Routes.applicationCommands(client.user?.id), {
        body: commands.flatMap((command) => command.toJSON()),
    })
        .catch((error) => {
        if (error.status === 429)
            (0, node_timers_1.setTimeout)(() => _sync(client, commands, guildId), error.data.retry_after * 1000);
        else {
            Logger_1.Logger.error(typeof error.code !== 'undefined' ? error.code : '', error.message);
            if (error.stack)
                Logger_1.Logger.trace(error.stack);
        }
    });
}
async function sync(client) {
    if (CommandManager_1.Commands.size === 0)
        return;
    const [guild, global] = CommandManager_1.Commands.partition((command) => typeof command.guildId === 'string' || typeof Container_1.container.client.options.devGuildId === 'string');
    const guildIds = new Set(guild.map((c) => c.guildId || Container_1.container.client.options.devGuildId));
    for await (const guildId of guildIds) {
        const commands = guild.filter((item) => item.guildId === guildId);
        await _sync(client, [...commands.values()], guildId);
    }
    await _sync(client, [...global.values()]);
}
exports.sync = sync;
