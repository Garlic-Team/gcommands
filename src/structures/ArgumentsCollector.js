const Argument = require('./Argument');
const { CommandInteractionOptionResolver } = require('discord.js');
const { Collection } = require('discord.js');

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

        this.options = [];

        this.resolved = {};
    }
    async get() {
        for (const arg of this.cmdArgs) {
            if ([1, 2].includes(arg.type)) arg.subcommands = this.cmdArgs.filter(sc => [1, 2].includes(sc.type));
            const argument = new Argument(this.client, arg, this.isNotDm);
            let result;
            if (this.args[0]) {
                const invalid = argument.argument.validate(argument, { content: this.args[0], guild: this.message.guild });
                if (invalid) {
                    result = await argument.obtain(this.message, this.language, invalid);
                } else {
                    result = argument.argument.get(this.args[0]);
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
                    type: argument.type,
                });
                this.cmdArgs = result.options ?? [];
                return this.get();
            } else {
                this.addArgument(argument.argument.resolve({
                    name: argument.name,
                    type: argument.type,
                    value: result,
                }));
            }
        }
    }
    addArgument(argument) {
        this.addResolved(argument);
        if (['SUB_COMMAND', 'SUB_COMMAND_GROUP'].includes(this.options[0]?.type)) {
            if (!Array.isArray(this.options[0].options)) this.options[0].options = [];
            if (['SUB_COMMAND', 'SUB_COMMAND_GROUP'].includes(this.options[0].options[0]?.type)) {
                if (!Array.isArray(this.options[0].options[0].options)) this.options[0].options[0].options = [];
                return this.options[0].options[0].options.push(argument);
            }
            return this.options[0].options.push(argument);
        }
        return this.options.push(argument);
    }
    resolve() {
        return new CommandInteractionOptionResolver(this.client, this.options, this.resolved);
    }
    addResolved(argument) {
        if (argument.user) {
            if (!this.resolved.users) this.resolved.users = new Collection();
            this.resolved.users.set(argument.user.id, argument.user);
        }
        if (argument.member) {
            if (!this.resolved.members) this.resolved.members = new Collection();
            this.resolved.members.set(argument.member.id, argument.member);
        }
        if (argument.role) {
            if (!this.resolved.roles) this.resolved.roles = new Collection();
            this.resolved.roles.set(argument.role.id, argument.role);
        }
        if (argument.channel) {
            if (!this.resolved.channels) this.resolved.channels = new Collection();
            this.resolved.channels.set(argument.channel.id, argument.channel);
        }
    }
}

module.exports = ArgumentsCollector;
