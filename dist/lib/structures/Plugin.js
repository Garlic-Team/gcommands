"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plugin = void 0;
const PluginManager_1 = require("../managers/PluginManager");
const Logger_1 = require("../util/logger/Logger");
const zod_1 = require("zod");
const validationSchema = zod_1.z
    .object({
    name: zod_1.z.string(),
    afterInitialization: zod_1.z.function().optional(),
    beforeLogin: zod_1.z.function().optional(),
    afterLogin: zod_1.z.function().optional(),
})
    .passthrough();
class Plugin {
    constructor(options) {
        validationSchema
            .parseAsync({ ...options, ...this })
            .then((options) => {
            this.name = options.name;
            this.afterInitialization = options.afterInitialization;
            this.beforeLogin = options.beforeLogin;
            this.afterLogin = options.afterLogin;
            PluginManager_1.Plugins.register(this);
        })
            .catch((error) => {
            Logger_1.Logger.warn(typeof error.code !== 'undefined' ? error.code : '', error.message);
            if (error.stack)
                Logger_1.Logger.trace(error.stack);
        });
    }
}
exports.Plugin = Plugin;
