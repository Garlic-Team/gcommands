"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = exports.CommandType = void 0;
const GClient_1 = require("../GClient");
const Argument_1 = require("./Argument");
const CommandManager_1 = require("../managers/CommandManager");
const Logger_1 = require("../util/logger/Logger");
const zod_1 = require("zod");
const Container_1 = require("./Container");
var CommandType;
(function (CommandType) {
    CommandType[CommandType["MESSAGE"] = 0] = "MESSAGE";
    CommandType[CommandType["SLASH"] = 1] = "SLASH";
    CommandType[CommandType["CONTEXT_USER"] = 2] = "CONTEXT_USER";
    CommandType[CommandType["CONTEXT_MESSAGE"] = 3] = "CONTEXT_MESSAGE";
})(CommandType = exports.CommandType || (exports.CommandType = {}));
const validationSchema = zod_1.z
    .object({
    name: zod_1.z
        .string()
        .max(32)
        .regex(/^[aA-zZ1-9]/),
    type: zod_1.z
        .union([zod_1.z.string(), zod_1.z.nativeEnum(CommandType)])
        .transform((arg) => (typeof arg === 'string' && Object.keys(CommandType).includes(arg) ? CommandType[arg] : arg))
        .array()
        .nonempty(),
    arguments: zod_1.z.any().array().optional(),
    description: zod_1.z.string().max(100).optional(),
    inhibitors: zod_1.z.any().array().optional(),
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
class Command {
    constructor(options) {
        this.reloading = false;
        if (this.run)
            options.run = this.run;
        if (this.onError)
            options.onError = this.onError;
        validationSchema
            .parseAsync({ ...options, ...this })
            .then((options) => {
            this.name = options.name || Command.defaults?.name;
            this.description = options.description || Command.defaults?.description;
            this.type = options.type || Command.defaults?.type;
            this.arguments = options.arguments?.map((argument) => {
                if (argument instanceof Argument_1.Argument)
                    return argument;
                else
                    return new Argument_1.Argument(argument);
            });
            this.inhibitors = options.inhibitors || Command.defaults?.inhibitors;
            this.guildId = options.guildId || Command.defaults?.guildId;
            this.cooldown = options.cooldown || Command.defaults?.cooldown;
            this.fileName = options.fileName || Command.defaults?.fileName;
            this.run = options.run || Command.defaults?.run;
            this.onError = options.onError || Command.defaults?.onError;
            this.autoDefer = options.autoDefer || Command.defaults?.autoDefer;
            CommandManager_1.Commands.register(this);
        })
            .catch((error) => {
            Logger_1.Logger.warn(typeof error.code !== 'undefined' ? error.code : '', error.message);
            if (error.stack)
                Logger_1.Logger.trace(error.stack);
        });
    }
    unregister() {
        return CommandManager_1.Commands.unregister(this.name);
    }
    load() {
        if (!this.guildId && Container_1.container.client?.options?.devGuildId)
            this.guildId = Container_1.container.client.options.devGuildId;
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
        return CommandManager_1.Commands.get(this.name);
    }
    toJSON() {
        return this.type
            .filter((type) => type !== CommandType.MESSAGE)
            .map((type) => {
            if (type === CommandType.SLASH)
                return {
                    name: this.name,
                    description: this.description,
                    options: this.arguments?.map((argument) => argument.toJSON()),
                    type: type,
                };
            else
                return {
                    name: this.name,
                    type: type,
                };
        });
    }
    static setDefaults(defaults) {
        validationSchema
            .partial()
            .parseAsync(defaults)
            .then((defaults) => {
            Command.defaults = defaults;
        })
            .catch((error) => {
            Logger_1.Logger.warn(typeof error.code !== 'undefined' ? error.code : '', error.message);
            if (error.stack)
                Logger_1.Logger.trace(error.stack);
        });
    }
}
exports.Command = Command;
