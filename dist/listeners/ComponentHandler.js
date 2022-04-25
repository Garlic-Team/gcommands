"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Listener_1 = require("../lib/structures/Listener");
const HandlerManager_1 = require("../lib/managers/HandlerManager");
const Logger_1 = require("../lib/util/logger/Logger");
new Listener_1.Listener({
    event: 'interactionCreate',
    name: 'gcommands-componentHandler',
    run: async (interaction) => {
        if (interaction.isMessageComponent())
            await HandlerManager_1.Handlers.componentHandler(interaction).catch((error) => {
                Logger_1.Logger.error(typeof error.code !== 'undefined' ? error.code : '', error.message);
                if (error.stack)
                    Logger_1.Logger.trace(error.stack);
            });
    },
});