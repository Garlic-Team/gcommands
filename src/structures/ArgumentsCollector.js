const Argument = require('./Argument');
const { CommandInteractionOptionResolver } = require('discord.js');
const { Collection } = require('discord.js');


/**
 * The collector for arguments
 * @private
 */
class ArgumentsCollector {
    /**
     * @param {Client} client
     * @param {Object} data
     * @constructor
     */
    constructor(client, data) {
        /**
         * The client
         * @type {Client}
        */
        this.client = client;

        /**
         * The message
         * @type {Message}
         */
        this.message = data.message;

        /**
         * The args
         * @type {Array}
         */
        this.args = data.args;

        /**
         * The language
         * @type {string}
         */
        this.language = data.language;

        /**
         * If the command was executed inside DM's
         * @type {boolean}
        */
        this.isNotDm = data.isNotDm;

        /**
         * The command arguments
         * @type {Array<CommandArgsOption>}
         */
        this.cmdArgs = JSON.parse(JSON.stringify(data.commandos.args));

        /**
         * The command
         * @type {Command}
         */
        this.commandos = data.commandos;

        /**
         * The timelimit message
         * @type {string}
         */
        this.timeLimitMessage = this.client.languageFile.ARGS_TIME_LIMIT[data.language];

        /**
         * The options
         * @type {Array}
         */
        this.options = [];

        /**
         * The resolved users/channels/roles
         * @type {Object<Collection>}
         */
        this.resolved = {};
    }

    /**
     * Internal method to get arguments
     * @returns {void}
     */
    async get() {
        for (const arg of this.cmdArgs) {
            if ([1, 2].includes(arg.type)) arg.subcommands = this.cmdArgs.filter(sc => [1, 2].includes(sc.type));
            const argument = new Argument(this.client, arg, this.isNotDm, this.language);
            let result;
            if (this.args[0] && !this.commandos.alwaysObtain) {
                const invalid = argument.argument.validate(argument, { content: this.args[0], guild: this.message.guild }, this.language);
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

    /**
     * Internal method to add arguments
     * @param {object} argument
     * @returns {void}
     */
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

    /**
     * Internal method to resolve arguments
     * @returns {CommandInteractionOptionResolver}
     */
    resolve() {
        return new CommandInteractionOptionResolver(this.client, this.options, this.resolved);
    }

    /**
     * Internal method to add resolved user/role/channel
     * @param {object} argument
     * @returns {void}
     */
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
