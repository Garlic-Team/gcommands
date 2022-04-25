"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plugins = exports.PluginManager = exports.PluginHookType = void 0;
const discord_js_1 = require("discord.js");
const Plugin_1 = require("../structures/Plugin");
const Logger_1 = require("../util/logger/Logger");
const Container_1 = require("../structures/Container");
var PluginHookType;
(function (PluginHookType) {
    PluginHookType["AfterInitialization"] = "afterInitialization";
    PluginHookType["BeforeLogin"] = "beforeLogin";
    PluginHookType["AfterLogin"] = "afterLogin";
})(PluginHookType = exports.PluginHookType || (exports.PluginHookType = {}));
class PluginManager extends discord_js_1.Collection {
    register(plugin) {
        if (plugin instanceof Plugin_1.Plugin) {
            if (this.has(plugin.name))
                Logger_1.Logger.warn('Overwriting plugin', plugin.name);
            this.set(plugin.name, plugin);
            Logger_1.Logger.emit(Logger_1.Events.PLUGIN_REGISTERED, plugin);
            Logger_1.Logger.debug('Registered plugin', plugin.name);
        }
        else
            Logger_1.Logger.warn('Plugin must be a instance of plugin');
        return this;
    }
    async load(hookType) {
        const plugins = this.filter((plugin) => typeof plugin[hookType] === 'function');
        for await (const plugin of plugins.values()) {
            await Promise.resolve(plugin[hookType](Container_1.container.client)).catch((error) => {
                Logger_1.Logger.error(typeof error.code !== 'undefined' ? error.code : '', error.message);
                if (error.stack)
                    Logger_1.Logger.trace(error.stack);
            });
        }
    }
}
exports.PluginManager = PluginManager;
exports.Plugins = new PluginManager();
