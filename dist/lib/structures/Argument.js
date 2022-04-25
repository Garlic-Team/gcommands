"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Argument = exports.ChannelType = exports.ArgumentType = void 0;
const Logger_1 = require("../util/logger/Logger");
const zod_1 = require("zod");
var ArgumentType;
(function (ArgumentType) {
    ArgumentType[ArgumentType["SUB_COMMAND"] = 1] = "SUB_COMMAND";
    ArgumentType[ArgumentType["SUB_COMMAND_GROUP"] = 2] = "SUB_COMMAND_GROUP";
    ArgumentType[ArgumentType["STRING"] = 3] = "STRING";
    ArgumentType[ArgumentType["INTEGER"] = 4] = "INTEGER";
    ArgumentType[ArgumentType["BOOLEAN"] = 5] = "BOOLEAN";
    ArgumentType[ArgumentType["USER"] = 6] = "USER";
    ArgumentType[ArgumentType["CHANNEL"] = 7] = "CHANNEL";
    ArgumentType[ArgumentType["ROLE"] = 8] = "ROLE";
    ArgumentType[ArgumentType["MENTIONABLE"] = 9] = "MENTIONABLE";
    ArgumentType[ArgumentType["NUMBER"] = 10] = "NUMBER";
    ArgumentType[ArgumentType["ATTACHMENT"] = 11] = "ATTACHMENT";
})(ArgumentType = exports.ArgumentType || (exports.ArgumentType = {}));
var ChannelType;
(function (ChannelType) {
    ChannelType[ChannelType["GUILD_TEXT"] = 0] = "GUILD_TEXT";
    ChannelType[ChannelType["GUILD_VOICE"] = 2] = "GUILD_VOICE";
    ChannelType[ChannelType["GUILD_CATEGORY"] = 4] = "GUILD_CATEGORY";
    ChannelType[ChannelType["GUILD_NEWS"] = 5] = "GUILD_NEWS";
    ChannelType[ChannelType["GUILD_STORE"] = 6] = "GUILD_STORE";
    ChannelType[ChannelType["GUILD_NEWS_THREAD"] = 10] = "GUILD_NEWS_THREAD";
    ChannelType[ChannelType["GUILD_PUBLIC_THREAD"] = 11] = "GUILD_PUBLIC_THREAD";
    ChannelType[ChannelType["GUILD_PRIVATE_THREAD"] = 12] = "GUILD_PRIVATE_THREAD";
    ChannelType[ChannelType["GUILD_STAGE_VOICE"] = 13] = "GUILD_STAGE_VOICE";
})(ChannelType = exports.ChannelType || (exports.ChannelType = {}));
const validationSchema = zod_1.z
    .object({
    name: zod_1.z
        .string()
        .max(32)
        .regex(/^[a-zA-Z1-9]/),
    description: zod_1.z.string().max(100),
    type: zod_1.z
        .union([zod_1.z.string(), zod_1.z.nativeEnum(ArgumentType)])
        .transform((arg) => typeof arg === 'string' && Object.keys(ArgumentType).includes(arg) ? ArgumentType[arg] : arg),
    required: zod_1.z.boolean().optional(),
    choices: zod_1.z
        .object({
        name: zod_1.z.string(),
        value: zod_1.z.string(),
    })
        .array()
        .optional(),
    options: zod_1.z.any().array().optional(),
    arguments: zod_1.z.any().array().optional(),
    channelTypes: zod_1.z
        .union([zod_1.z.string(), zod_1.z.nativeEnum(ChannelType)])
        .transform((arg) => typeof arg === 'string' && Object.keys(ChannelType).includes(arg) ? ChannelType[arg] : arg)
        .array()
        .optional(),
    minValue: zod_1.z.number().optional(),
    maxValue: zod_1.z.number().optional(),
    run: zod_1.z.function().optional(),
})
    .passthrough();
class Argument {
    constructor(options) {
        if (options.options) {
            Logger_1.Logger.warn('The use of ArgumentOptions#options is depracted. Please use ArgumentOptions#arguments instead');
            options.arguments = options.options;
        }
        if (this.run)
            options.run = this.run;
        validationSchema
            .parseAsync({ ...options, ...this })
            .then((options) => {
            this.name = options.name;
            this.description = options.description;
            this.type = options.type;
            this.required = options.required;
            this.choices = options.choices;
            this.arguments = options.arguments?.map((argument) => {
                if (argument instanceof Argument)
                    return argument;
                else
                    return new Argument(argument);
            });
            this.options = this.arguments;
            this.channelTypes = options.channelTypes;
            this.minValue = options.minValue;
            this.maxValue = options.maxValue;
            this.run = options.run;
        })
            .catch((error) => {
            Logger_1.Logger.warn(typeof error.code !== 'undefined' ? error.code : '', error.message);
            if (error.stack)
                Logger_1.Logger.trace(error.stack);
        });
    }
    toJSON() {
        if (this.type === ArgumentType.SUB_COMMAND || this.type === ArgumentType.SUB_COMMAND_GROUP) {
            return {
                name: this.name,
                description: this.description,
                type: this.type,
                options: this.arguments?.map((argument) => argument.toJSON()),
            };
        }
        return {
            name: this.name,
            description: this.description,
            type: this.type,
            required: this.required,
            choices: this.choices,
            channel_types: this.channelTypes,
            min_value: this.minValue,
            max_value: this.maxValue,
            autocomplete: typeof this.run === 'function',
        };
    }
}
exports.Argument = Argument;
