const ArgumentType = require('../util/Constants').ArgumentType;
const Argument = require('./Argument');

class ArgumentsCollector {
    constructor(client, data) {
        this.client = client;

        this.message = data.message;

        this.args = data.args;

        this.language = data.language;

        this.isNotDm = data.isNotDm;

        this.cmdArgs = JSON.parse(JSON.stringify(data.commandos.args));

        this.commandos = data.commandos;

        this.timeLimitMessage = this.client.languageFile.ARGS_TIME_LIMIT[data.language];

        this.finalArgs = [];
    }
    async get() {
        for (const arg of this.cmdArgs) {
            if (arg.type === (ArgumentType.SUB_COMMAND || ArgumentType.SUB_COMMAND_GROUP)) arg.subcommands = this.cmdArgs.filter(sc => sc.type === (ArgumentType.SUB_COMMAND || ArgumentType.SUB_COMMAND_GROUP));
            const argument = new Argument(this.client, arg, this.isNotDm);
            let result;
            if (this.args[0]) {
                const invalid = argument.argument.validate(argument, { content: this.args[0], guild: this.message.guild });
                if (invalid) {
                    result = await argument.obtain(this.message, this.language, invalid);
                } else {
                    result = argument.get(this.args[0]);
                }
            } else {
                result = await argument.obtain(this.message, this.language, arg.prompt);
            }
            if (result === 'cancel') return false;
            if (result === 'timelimit' && argument.required) {
                this.message.reply(this.timeLimitMessage);
                return false;
            } else if (result === 'timelimit') { continue; }
            if (result === 'skip') continue;

            if (this.args[0]) this.args.shift();

            if (typeof result === 'object') {
                this.addArgument({
                    name: result.name,
                    type: result.type,
                });
                this.cmdArgs = result.options ?? [];
                return this.get();
            } else {
                this.addArgument({
                    name: argument.name,
                    type: argument.type,
                    value: result,
                });
            }
        }
    }
    addArgument(argument) {
        if (this.finalArgs[0]?.type === (ArgumentType.SUB_COMMAND || ArgumentType.SUB_COMMAND_GROUP)) {
            if (!Array.isArray(this.finalArgs[0].options)) this.finalArgs[0].options = [];
            return this.finalArgs[0].options.push(argument);
        }
        return this.finalArgs.push(argument);
    }
    resolve(options) {
        if (!Array.isArray(options)) return {};
        const oargs = {};

        for (const o of options) {
            if (['SUB_COMMAND', 'SUB_COMMAND_GROUP', 1, 2].includes(o.type)) {
                oargs[o.name] = o.options ? this.resolve(o.options) : [];
            } else {
                oargs[o.name] = o.value;
            }
        }

        return oargs;
    }
}

module.exports = ArgumentsCollector;
