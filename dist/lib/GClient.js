"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GClient = exports.AutoDeferType = void 0;
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const PluginManager_1 = require("./managers/PluginManager");
const ListenerManager_1 = require("./managers/ListenerManager");
const responses_json_1 = tslib_1.__importDefault(require("../responses.json"));
const timers_1 = require("timers");
const registerDirectories_1 = require("./util/registerDirectories");
const Container_1 = require("./structures/Container");
const CommandManager_1 = require("./managers/CommandManager");
const ComponentManager_1 = require("./managers/ComponentManager");
var AutoDeferType;
(function (AutoDeferType) {
    AutoDeferType[AutoDeferType["EPHEMERAL"] = 1] = "EPHEMERAL";
    AutoDeferType[AutoDeferType["NORMAL"] = 2] = "NORMAL";
    AutoDeferType[AutoDeferType["UPDATE"] = 3] = "UPDATE";
})(AutoDeferType = exports.AutoDeferType || (exports.AutoDeferType = {}));
class GClient extends discord_js_1.Client {
    constructor(options) {
        super(options);
        this.responses = responses_json_1.default;
        if (options.dirs)
            (0, registerDirectories_1.registerDirectories)(options.dirs);
        if (this.options.database) {
            if (typeof this.options.database.init === 'function')
                this.options.database.init();
        }
        Container_1.container.client = this;
        CommandManager_1.Commands.load();
        ComponentManager_1.Components.load();
        ListenerManager_1.Listeners.load();
        (0, timers_1.setImmediate)(async () => {
            await PluginManager_1.Plugins.load(PluginManager_1.PluginHookType.AfterInitialization);
        });
    }
    async login(token) {
        await PluginManager_1.Plugins.load(PluginManager_1.PluginHookType.BeforeLogin);
        const login = await super.login(token);
        await PluginManager_1.Plugins.load(PluginManager_1.PluginHookType.AfterLogin);
        return login;
    }
}
exports.GClient = GClient;
