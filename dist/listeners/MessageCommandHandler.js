"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Listener_1 = require("../lib/structures/Listener");
const HandlerManager_1 = require("../lib/managers/HandlerManager");
const Logger_1 = require("../lib/util/logger/Logger");
const Container_1 = require("../lib/structures/Container");
new Listener_1.Listener({
    event: 'messageCreate',
    name: 'gcommands-messageCommandHandler',
    run: async (message) => {
        const { client } = Container_1.container;
        if (!client.options.messageSupport)
            return;
        const mention = message.content.split(' ')[0].match(new RegExp(`^<@!?(${client.user?.id})>`));
        const prefix = mention?.[0] || client.options?.messagePrefix;
        if (!message.content.startsWith(prefix))
            return;
        const [commandName, ...args] = message.content.slice(prefix?.length).trim().split(/ +/g);
        if (commandName.length === 0)
            return;
        await Promise.resolve(HandlerManager_1.Handlers.messageCommandHandler(message, commandName, args)).catch((error) => {
            Logger_1.Logger.error(typeof error.code !== 'undefined' ? error.code : '', error.message);
            if (error.stack)
                Logger_1.Logger.trace(error.stack);
        });
    },
});
