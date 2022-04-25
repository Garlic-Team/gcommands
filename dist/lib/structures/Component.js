"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = exports.ComponentType = void 0;
const GClient_1 = require("../GClient");
const ComponentManager_1 = require("../managers/ComponentManager");
const Logger_1 = require("../util/logger/Logger");
const zod_1 = require("zod");
const Container_1 = require("./Container");
var ComponentType;
(function (ComponentType) {
    ComponentType[ComponentType["BUTTON"] = 1] = "BUTTON";
    ComponentType[ComponentType["SELECT_MENU"] = 2] = "SELECT_MENU";
})(ComponentType = exports.ComponentType || (exports.ComponentType = {}));
const validationSchema = zod_1.z
    .object({
    name: zod_1.z
        .string()
        .max(32)
        .regex(/^[a-z1-9]/),
    type: zod_1.z
        .union([zod_1.z.string(), zod_1.z.nativeEnum(ComponentType)])
        .transform((arg) => typeof arg === 'string' && Object.keys(ComponentType).includes(arg) ? ComponentType[arg] : arg)
        .array()
        .nonempty(),
    inhibitors: zod_1.z.any().optional(),
    guildId: zod_1.z.string().optional(),
    cooldown: zod_1.z.string().optional(),
    autoDefer: zod_1.z
        .union([zod_1.z.string(), zod_1.z.nativeEnum(GClient_1.AutoDeferType)])
        .transform((arg) => typeof arg === 'string' && Object.keys(GClient_1.AutoDeferType).includes(arg) ? GClient_1.AutoDeferType[arg] : arg)
        .optional(),
    fileName: zod_1.z.string().optional(),
    run: zod_1.z.function(),
    onError: zod_1.z.function().optional(),
})
    .passthrough();
class Component {
    constructor(options) {
        this.inhibitors = [];
        this.reloading = false;
        if (this.run)
            options.run = this.run;
        if (this.onError)
            options.onError = this.onError;
        validationSchema
            .parseAsync({ ...options, ...this })
            .then((options) => {
            this.name = options.name || Component.defaults?.name;
            this.type = options.type || Component.defaults?.type;
            this.inhibitors = options.inhibitors || Component.defaults?.inhibitors;
            this.guildId = options.guildId || Component.defaults?.guildId;
            this.cooldown = options.cooldown || Component.defaults?.cooldown;
            this.fileName = options.fileName || Component.defaults?.fileName;
            this.run = options.run || Component.defaults?.run;
            this.onError = options.onError || Component.defaults?.onError;
            this.autoDefer = options.autoDefer || Component.defaults?.autoDefer;
            ComponentManager_1.Components.register(this);
        })
            .catch((error) => {
            Logger_1.Logger.warn(typeof error.code !== 'undefined' ? error.code : '', error.message);
            if (error.stack)
                Logger_1.Logger.trace(error.stack);
        });
    }
    load() {
        if (!this.guildId && Container_1.container.client?.options?.devGuildId)
            this.guildId = Container_1.container.client.options.devGuildId;
    }
    unregister() {
        ComponentManager_1.Components.unregister(this.name);
    }
    async inhibit(ctx) {
        if (!this.inhibitors)
            return true;
        for await (const inhibitor of this.inhibitors) {
            let result;
            if (typeof inhibitor === 'function') {
                result = await Promise.resolve(inhibitor(ctx)).catch((error) => {
                    Logger_1.Logger.error(typeof error.code !== 'undefined' ? error.code : '', error.message);
                    if (error.stack)
                        Logger_1.Logger.trace(error.stack);
                });
            }
            else if (typeof inhibitor.run === 'function') {
                result = await Promise.resolve(inhibitor.run(ctx)).catch((error) => {
                    Logger_1.Logger.error(typeof error.code !== 'undefined' ? error.code : '', error.message);
                    if (error.stack)
                        Logger_1.Logger.trace(error.stack);
                });
            }
            if (result !== true)
                return false;
        }
        return true;
    }
    async reload() {
        if (!this.fileName)
            return;
        this.reloading = true;
        delete require.cache[require.resolve(this.fileName)];
        await Promise.resolve().then(() => __importStar(require(this.fileName)));
        return ComponentManager_1.Components.get(this.name);
    }
    static setDefaults(defaults) {
        validationSchema
            .partial()
            .parseAsync(defaults)
            .then((defaults) => {
            Component.defaults = defaults;
        })
            .catch((error) => {
            Logger_1.Logger.warn(typeof error.code !== 'undefined' ? error.code : '', error.message);
            if (error.stack)
                Logger_1.Logger.trace(error.stack);
        });
    }
}
exports.Component = Component;
