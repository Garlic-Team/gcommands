"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = void 0;
const Logger_1 = require("./logger/Logger");
const PluginManager_1 = require("../managers/PluginManager");
class Util {
    /**
     * @deprecated We don't support arguments in object/array
     * @link https://discord.js.org/#/docs/main/stable/class/CommandInteractionOptionResolver
     */
    static argumentsToArray(options) {
        const args = [];
        const check = options => {
            for (const option of options) {
                if (Util.checkIfSubOrGroup(option.type))
                    args.push(option.name);
                else
                    args.push(option.value);
                if (option.options)
                    check(option.options);
            }
        };
        check(options);
        return args;
    }
    /**
     * @deprecated We don't support arguments in object/array
     * @link https://discord.js.org/#/docs/main/stable/class/CommandInteractionOptionResolver
     */
    static argumentsToObject(options) {
        const args = {};
        const check = (options, object) => {
            for (const option of options) {
                if (Util.checkIfSubOrGroup(option.type))
                    object[option.name] = {};
                else
                    object[option.name] = option.value;
                if (option.options)
                    check(option.options, object[option.name]);
            }
        };
        check(options, args);
        return args;
    }
    /**
     * @deprecated We don't support arguments in object/array
     * @link https://discord.js.org/#/docs/main/stable/class/CommandInteractionOptionResolver
    */
    static checkIfSubOrGroup(type) {
        // Why? Because discord.js v14 (:
        return !!['SUB_COMMAND', 'SUB_COMMAND_GROUP', 'Subcommand', 'SubcommandGroup'].includes(type);
    }
    static isClass(input) {
        return (typeof input === 'function' && typeof input.prototype === 'object' && input.toString().substring(0, 5) === 'class');
    }
    static resolveArgumentOptions(options) {
        for (const [key, value] of Object.entries(options)) {
            const option = key.match(/[A-Z]/g)?.[0]
                ? key.replace(key?.match(/[A-Z]/g)?.[0], `_${key?.match(/[A-Z]/g)?.[0]?.toLowerCase()}`)
                : key;
            if (option !== key) {
                delete options[key];
                options[option] = value;
            }
        }
        return options;
    }
    static resolveFile(file, fileType) {
        if (fileType === '.ts')
            return file.default || Object.values(file)[0];
        if (fileType === '.js') {
            if (this.isClass(file))
                return file;
            else
                return Object.values(file)[0];
        }
        return file;
    }
    static stringToBoolean(string) {
        const regex = /^\s*(true|1|on)\s*$/i;
        return regex.test(string);
    }
    static resolveValidationErrorTrace(array) {
        array = array.filter(item => typeof item === 'string');
        return `(${array.join(' -> ') || 'unknown'})`;
    }
    static pad(number) {
        return (number < 10 ? '0' : '') + number;
    }
    static throwError(error, name) {
        const trace = Util.resolveValidationErrorTrace([name]);
        Logger_1.Logger.error(error, trace);
    }
    static toPascalCase(input) {
        return input
            .replace(new RegExp(/[-_]+/, 'g'), ' ')
            .replace(new RegExp(/[^\w\s]/, 'g'), '')
            .replace(new RegExp(/\s+(.)(\w*)/, 'g'), ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`)
            .replace(new RegExp(/\w/), s => s.toUpperCase());
    }
    static async getResponse(value, interaction) {
        const languagePlugin = PluginManager_1.Plugins.get('@gcommands/plugin-language');
        if (languagePlugin) {
            const { LanguageManager } = await Promise.resolve().then(() => __importStar(require('@gcommands/plugin-language')));
            const text = LanguageManager.__(interaction, value);
            if (text)
                return text;
        }
        return interaction.client.responses[value];
    }
}
exports.Util = Util;
