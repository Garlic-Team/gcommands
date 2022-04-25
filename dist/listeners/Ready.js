"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Listener_1 = require("../lib/structures/Listener");
const sync_1 = require("../lib/util/sync");
const Logger_1 = require("../lib/util/logger/Logger");
new Listener_1.Listener({
    event: 'ready',
    name: 'gcommands-ready',
    run: async (client) => {
        Logger_1.Logger.info('Client is ready with %s guild(s)', client.guilds.cache.size);
        await (0, sync_1.sync)(client);
    },
});
