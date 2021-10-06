const { readdirSync } = require('fs');
const Argument = require('../commands/argument');
const ArgumentType = require('../util/Constants').ArgumentType;
const GError = require('../structures/GError'), { Events } = require('../util/Constants'), Color = require('../structures/Color');
const { inhibit, interactionRefactor, channelTypeRefactor, unescape } = require('../util/util');
const ifDjsV13 = require('../util/util').checkDjsVersion('13');

/**
 * The GEventHandling class
*/
class GEventHandling {
    /**
     * Creates new GEventHandling instance
     * @param {GCommandsClient} client
     */
    constructor(client) {
        /**
         * Client
         * @type {GCommandsClient}
        */
        this.client = client;

        this.messageEvent();
        this.slashEvent();
        this.loadMoreEvents();
    }

    /**
     * Internal method to messageEvent
     * @returns {void}
     * @private
    */
    messageEvent() {
        this.client.on(ifDjsV13 ? 'messageCreate' : 'message', message => {
            messageEventUse(message);
        });

        this.client.on('messageUpdate', (oldMessage, newMessage) => {
            if (oldMessage.content === newMessage.content || oldMessage.embeds === newMessage.embeds) return;
            messageEventUse(newMessage);
        });

        const messageEventUse = async message => {
            if (!message || !message.author || message.author.bot || (!this.client.allowDm && message.channel.type === 'dm')) return;

            const mention = message.content.match(new RegExp(`^<@!?(${this.client.user.id})> `));
            const prefix = mention ? mention[0] : (message.guild ? (await message.guild.getCommandPrefix())[0] : this.client.prefix);

            const messageContainsPrefix = this.client.caseSensitivePrefixes ? message.content.startsWith(prefix) : message.content.toLowerCase().startsWith(prefix.toLowerCase());
            if (!messageContainsPrefix) return;

            const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);
            if (cmd.length === 0) return;

            let commandos;
            try {
                commandos = this.client.gcommands.get(
                    !this.client.caseSensitiveCommands ?
                        String(cmd).toLowerCase() :
                        String(cmd.name),
                ) || this.client.galiases.get(
                    !this.client.caseSensitiveCommands ?
                        String(cmd).toLowerCase() :
                        String(cmd.name),
                );

                const isMessageEnabled = ['false', 'slash'].includes(String(commandos.slash));
                const isClientMessageEnabled = !commandos.slash && ['false', 'slash'].includes(String(this.client.slash));

                if (!commandos) return this.client.emit(Events.COMMAND_NOT_FOUND, new Color(`&d[GCommands] &cCommand not found (message): &e➜   &3${cmd ? cmd.name ? String(cmd.name) : String(cmd) : null}`, { json: false }).getText());
                if (isMessageEnabled) return;
                if (isClientMessageEnabled) return;

                const language = message.guild ? await this.client.dispatcher.getGuildLanguage(message.guild.id) : this.client.language;

                const runOptions = {
                    member: message.member,
                    author: message.author,
                    guild: message.guild,
                    channel: message.channel,
                    message: message,
                    client: this.client,
                    bot: this.client,
                    language: language,
                };

                let botMessageInhibit;
                const inhibitRunOptions = {
                    respond: async (options = undefined) => {
                        if (this.client.autoTyping) ifDjsV13 ? message.sendTyping() : message.startTyping();

                        const msg = await message.reply(options);
                        botMessageInhibit = msg;

                        if (this.client.autoTyping) message.channel.stopTyping(true);
                        return msg;
                    },
                    edit: async (options = undefined) => {
                        if (!botMessageInhibit) throw new GError('[NEED RESPOND]', `First you need to send a respond.`);
                        const editedMsg = await botMessageInhibit.edit(options);
                        return editedMsg;
                    },
                    followUp: async (options = undefined) => {
                        if (this.client.autoTyping) ifDjsV13 ? message.sendTyping() : message.startTyping();

                        const msg = await message.reply(options);

                        if (this.client.autoTyping && !ifDjsV13) message.stopTyping(true);
                        return msg;
                    },
                    args: args,
                };

                const inhibitReturn = await inhibit(this.client, interactionRefactor(message, commandos), {
                    ...runOptions,
                    ...inhibitRunOptions,
                });

                if (inhibitReturn === false) return;

                const cooldown = message.guild ? await this.client.dispatcher.getCooldown(message.guild.id, message.author.id, commandos) : null;
                const channelType = channelTypeRefactor(message.channel);
                const NSFW = message.guild ? commandos.nsfw && !message.channel.nsfw : null;
                const isNotChannelType = type => channelType !== type;
                const isNotDm = channelType !== 'dm';
                const isNotGuild = guild => !commandos.guildOnly.includes(guild);

                const getCooldownMessage = () => this.client.languageFile.COOLDOWN[language].replace(/{COOLDOWN}/g, cooldown.wait).replace(/{CMDNAME}/g, commandos.name);
                const getChannelTextOnlyMessage = () => this.client.languageFile.CHANNEL_TEXT_ONLY[language];
                const getChannelNewsOnlyMessage = () => this.client.languageFile.CHANNEL_NEWS_ONLY[language];
                const getChannelThreadOnlyMessage = () => this.client.languageFile.CHANNEL_THREAD_ONLY[language];
                const getNsfwMessage = () => this.client.languageFile.NSFW[language];
                const getMissingClientPermissionsMessage = () => this.client.languageFile.MISSING_CLIENT_PERMISSIONS[language].replace('{PERMISSION}', commandos.clientRequiredPermissions.map(v => unescape(v, '_')).join(', '));
                const getMissingPermissionsMessage = () => this.client.languageFile.MISSING_PERMISSIONS[language].replace('{PERMISSION}', commandos.userRequiredPermissions.map(v => unescape(v, '_')).join(', '));
                const getMissingRolesMessage = () => this.client.languageFile.MISSING_ROLES[language].replace('{ROLES}', `\`${commandos.userRequiredRoles.map(r => message.guild.roles.cache.get(r).name).join(', ')}\``);
                const getArgsTimeLimitMessage = () => this.client.languageFile.ARGS_TIME_LIMIT[language];

                if (cooldown?.cooldown) return message.reply(getCooldownMessage());

                if (isNotDm && commandos.guildOnly && isNotGuild(message.guild.id)) return;

                if (commandos.userOnly) {
                    if (typeof commandos.userOnly === 'object') {
                        const users = commandos.userOnly.some(v => message.author.id === v);
                        if (!users) return;
                    } else if (message.author.id !== commandos.userOnly) { return; }
                }

                if (isNotDm && commandos.channelOnly) {
                    if (typeof commandos.channelOnly === 'object') {
                        const channels = commandos.channelOnly.some(v => message.channel.id === v);
                        if (!channels) return;
                    } else if (message.channel.id !== commandos.channelOnly) { return; }
                }

                if (isNotDm && commandos.channelTextOnly && isNotChannelType('text')) return message.reply(getChannelTextOnlyMessage());
                if (isNotDm && commandos.channelNewsOnly && isNotChannelType('news')) return message.reply(getChannelNewsOnlyMessage());
                if (isNotDm && commandos.channelThreadOnly && isNotChannelType('thread')) return message.reply({ content: getChannelThreadOnlyMessage(), ephemeral: true });

                if (NSFW) return message.reply(getNsfwMessage());

                if (isNotDm && commandos.clientRequiredPermissions) {
                    if (!Array.isArray(commandos.clientRequiredPermissions)) commandos.clientRequiredPermissions = [commandos.clientRequiredPermissions];

                    if (message.channel.permissionsFor(message.guild.me).missing(commandos.clientRequiredPermissions).length > 0) return message.reply(getMissingClientPermissionsMessage());
                }

                if (isNotDm && commandos.userRequiredPermissions) {
                    if (!Array.isArray(commandos.userRequiredPermissions)) commandos.userRequiredPermissions = [commandos.userRequiredPermissions];

                    if (!message.member.permissions.has(commandos.userRequiredPermissions)) return message.reply(getMissingPermissionsMessage());
                }

                if (isNotDm && commandos.userRequiredRoles) {
                    if (!Array.isArray(commandos.userRequiredRoles)) commandos.userRequiredRoles = [commandos.userRequiredRoles];

                    const roles = commandos.userRequiredRoles.some(v => message.member._roles.includes(v));
                    if (!roles) return message.reply(getMissingRolesMessage());
                }

                let cmdArgs = commandos.args ? JSON.parse(JSON.stringify(commandos.args)) : [];
                const objectArgs = [];
                const finalArgs = [];
                const missingInput = [];

                const getArgsObject = options => {
                    if (!Array.isArray(options)) return {};
                    const oargs = {};

                    for (const o of options) {
                        if ([1, 2].includes(o.type)) {
                            oargs[o.name] = getArgsObject(o.options);
                        } else {
                            oargs[o.name] = o.value;
                        }
                    }

                    return oargs;
                };

                const validArg = async (arg, prompt) => {
                    const final = await arg.obtain(message, language, prompt);
                    if (!final.valid) return validArg(arg, prompt);

                    return final;
                };

                const getSubCommand = async (type, cmdSubcommands) => {
                    const options = {
                        type: type,
                        subcommands: cmdSubcommands,
                        required: true,
                    };
                    const arg = new Argument(this.client, options);
                    let subcommandInput;

                    if (args[0]) {
                        const subcommandInvalid = await arg.argument.validate(arg, { content: args[0].toLowerCase(), guild: message.guild }, language);
                        if (subcommandInvalid) {
                            subcommandInput = await arg.obtain(message, language, subcommandInvalid);
                            if (!subcommandInput.valid) subcommandInput = await validArg(arg, subcommandInput.prompt);

                            if (subcommandInput.timeLimit) return message.reply(getArgsTimeLimitMessage());
                        } else {
                            subcommandInput = { content: arg.get(args[0]) };
                        }
                    } else {
                        subcommandInput = await arg.obtain(message, language);
                        if (!subcommandInput.valid) subcommandInput = await validArg(arg, subcommandInput.prompt);

                        if (subcommandInput.timeLimit) return message.reply(getArgsTimeLimitMessage());
                    }
                    if (subcommandInput && typeof subcommandInput.content === 'object') {
                        cmdArgs = subcommandInput.content.options;

                        finalArgs.push(subcommandInput.content.name);

                        if (commandos.args.filter(a => a.type === ArgumentType.SUB_COMMAND_GROUP).length === 0 && subcommandInput.content.options.filter(o => o.type === 1).length === 0) objectArgs.push(subcommandInput.content);
                        for (const option of subcommandInput.content.options) {
                            if (option.type === 1) {
                                objectArgs.push(subcommandInput.content);
                            } else {
                                for (const missingOption of subcommandInput.content.options) {
                                    missingInput.push(missingOption);
                                }
                            }
                        }

                        if (args[0]) args.shift();

                        return subcommandInput.content.options;
                    }
                };

                const ifNotSubOrGroup = cmdArgs.filter(a => [ArgumentType.SUB_COMMAND, ArgumentType.SUB_COMMAND_GROUP].includes(a.type)).length === 0;

                const cmdsubcommandgroups = cmdArgs.filter(a => a.type === ArgumentType.SUB_COMMAND_GROUP);
                if (isNotDm && Array.isArray(cmdsubcommandgroups) && cmdsubcommandgroups[0]) {
                    await getSubCommand(ArgumentType.SUB_COMMAND_GROUP, cmdsubcommandgroups);
                }

                const cmdsubcommands = cmdArgs.filter(a => a.type === ArgumentType.SUB_COMMAND);
                if (isNotDm && Array.isArray(cmdsubcommands) && cmdsubcommands[0]) {
                    await getSubCommand(ArgumentType.SUB_COMMAND, cmdsubcommands);
                }

                for (const i in cmdArgs) {
                    if (!isNotDm) continue;
                    const arg = new Argument(this.client, cmdArgs[i]);
                    if (arg.type === 'invalid') continue;
                    const rawArg = cmdArgs[1] ? args[i] : args.join(' ');

                    if (rawArg && !commandos.alwaysObtain) {
                        const argInvalid = await arg.argument.validate(arg, { content: args[0].toLowerCase(), guild: message.guild }, language);
                        if (argInvalid) {
                            let argInput = await arg.obtain(message, language, argInvalid);
                            if (!argInput.valid) {
                                if (argInput.reason === 'skip') continue;
                                if (argInput.reason === 'cancel') return;
                                argInput = await validArg(arg, argInput.prompt);
                            }

                            if (argInput.timeLimit) return message.reply(getArgsTimeLimitMessage);
                            finalArgs.push(argInput.content);

                            args[i] = argInput.content;

                            if (ifNotSubOrGroup) objectArgs.push({ name: arg.name, value: argInput.content, type: arg.type });

                            for (const input of missingInput) {
                                if (input.name === arg.name) {
                                    input.value = argInput.content;
                                }
                            }
                        } else {
                            finalArgs.push(arg.get(rawArg));

                            if (ifNotSubOrGroup) objectArgs.push({ name: arg.name, value: arg.get(rawArg), type: arg.type });

                            for (const input of missingInput) {
                                if (input.name === arg.name) {
                                    input.value = arg.get(rawArg);
                                }
                            }
                        }

                        continue;
                    }

                    let argInput = await arg.obtain(message, language);
                    if (!argInput.valid) {
                        if (argInput.reason === 'skip') continue;
                        if (argInput.reason === 'cancel') return;
                        argInput = await validArg(arg, argInput.prompt);
                    }

                    if (argInput.timeLimit) return message.reply(getArgsTimeLimitMessage());

                    finalArgs.push(argInput.content);

                    args[i] = argInput.content;

                    if (ifNotSubOrGroup) objectArgs.push({ name: arg.name, value: argInput.content, type: arg.type });

                    for (const input of missingInput) {
                        if (input.name === arg.name) {
                            input.value = argInput.content;
                        }
                    }
                }

                let botMessage;
                const commandRunOptions = {
                    respond: async (options = undefined) => {
                        if (this.client.autoTyping) ifDjsV13 ? message.channel.sendTyping() : message.channel.startTyping();

                        const msg = await message.reply(options);
                        botMessage = msg;

                        if (this.client.autoTyping && !ifDjsV13) message.channel.stopTyping(true);
                        return msg;
                    },
                    edit: async (options = undefined) => {
                        if (!botMessage) throw new GError('[NEED RESPOND]', `First you need to send a respond.`);
                        const editedMsg = await botMessage.edit(options);
                        return editedMsg;
                    },
                    followUp: async (options = undefined) => {
                        if (this.client.autoTyping) ifDjsV13 ? message.channel.sendTyping() : message.channel.startTyping();

                        const msg = await message.reply(options);

                        if (this.client.autoTyping && !ifDjsV13) message.channel.stopTyping(true);
                        return msg;
                    },
                    args: !isNotDm ? finalArgs : args,
                    objectArgs: getArgsObject(objectArgs),
                };

                this.client.emit(Events.COMMAND_EXECUTE, { command: commandos, member: message.member, channel: message.channel, guild: message.guild });

                commandos.run({
                    ...runOptions,
                    ...commandRunOptions,
                });
            } catch (e) {
                this.client.emit(Events.COMMAND_ERROR, { command: commandos, member: message.member, channel: message.channel, guild: message.guild, error: e });
                this.client.emit(Events.DEBUG, e);
            }
        };
    }

    /**
     * Internal method to slashEvent
     * @returns {void}
     * @private
    */
    slashEvent() {
        this.client.on('GInteraction', async interaction => {
            if (!interaction.isApplication()) return;

            if (!interaction.guild) return;

            let commandos;
            try {
                commandos = this.client.gcommands.find(cmd =>
                    !this.client.caseSensitiveCommands ?
                        (String(interaction.commandName).toLowerCase() === String(cmd.name).toLowerCase() || String(interaction.commandName).toLowerCase() === String(cmd.contextMenuName).toLowerCase()) :
                        (String(interaction.commandName) === String(cmd.name) || String(interaction.commandName) === String(cmd.contextMenuName)),
                );
                if (!commandos) return this.client.emit(Events.COMMAND_NOT_FOUND, new Color(`&d[GCommands] &cCommand not found (slash): &e➜   &3${interaction.commandName ? String(interaction.commandName) : null}`, { json: false }).getText());
                if (interaction.isCommand() && ['false', 'message'].includes(String(commandos.slash))) return;
                if (interaction.isCommand() && !commandos.slash && ['false', 'message'].includes(String(this.client.slash))) return;
                if (interaction.isContextMenu() && String(commandos.context) === 'false') return;
                if (interaction.isContextMenu() && !commandos.context && String(this.client.context) === 'false') return;

                const inhibitReturn = await inhibit(this.client, interactionRefactor(interaction, commandos), {
                    interaction,
                    member: interaction.member,
                    author: interaction.author,
                    guild: interaction.guild,
                    channel: interaction.channel,
                    respond: result => interaction.reply.send(result),
                    edit: result => interaction.reply.edit(result),
                    followUp: result => interaction.reply.followUp(result),
                    args: interaction.arrayArguments,
                    objectArgs: interaction.objectArguments,
                });
                if (inhibitReturn === false) return;

                const guildLanguage = await this.client.dispatcher.getGuildLanguage(interaction.guild.id);
                const cooldown = await this.client.dispatcher.getCooldown(interaction.guild.id, interaction.author.id, commandos);
                if (cooldown.cooldown) return interaction.reply.send(this.client.languageFile.COOLDOWN[guildLanguage].replace(/{COOLDOWN}/g, cooldown.wait).replace(/{CMDNAME}/g, commandos.name));

                if (commandos.nsfw && !interaction.channel.nsfw) return interaction.reply.send(this.client.languageFile.NSFW[guildLanguage]);

                if (commandos.userOnly) {
                    if (typeof commandos.userOnly === 'object') {
                        const users = commandos.userOnly.some(v => interaction.author.id === v);
                        if (!users) return;
                    } else if (interaction.author.id !== commandos.userOnly) { return; }
                }

                if (commandos.channelOnly) {
                    if (typeof commandos.channelOnly === 'object') {
                        const channels = commandos.channelOnly.some(v => interaction.channel.id === v);
                        if (!channels) return;
                    } else if (interaction.channel.id !== commandos.channelOnly) { return; }
                }

                const channelType = channelTypeRefactor(interaction.channel);

                if (commandos.nsfw && !interaction.channel.nsfw) { return interaction.reply.send({ content: this.client.languageFile.NSFW[guildLanguage], ephemeral: true }); }
                if (commandos.channelTextOnly && channelType !== 'text') { return interaction.reply.send({ content: this.client.languageFile.CHANNEL_TEXT_ONLY[guildLanguage], ephemeral: true }); }
                if (commandos.channelNewsOnly && channelType !== 'news') { return interaction.reply.send({ content: this.client.languageFile.CHANNEL_NEWS_ONLY[guildLanguage], ephemeral: true }); }
                if (commandos.channelThreadOnly && channelType !== 'thread') { return interaction.reply.send({ content: this.client.languageFile.CHANNEL_THREAD_ONLY[guildLanguage], ephemeral: true }); }

                if (commandos.clientRequiredPermissions) {
                    if (!Array.isArray(commandos.clientRequiredPermissions)) commandos.clientRequiredPermissions = [commandos.clientRequiredPermissions];

                    if (interaction.guild.channels.cache.get(interaction.channel.id).permissionsFor(interaction.guild.me).missing(commandos.clientRequiredPermissions).length > 0) {
                        return interaction.reply.send({
                            content:
                                this.client.languageFile.MISSING_CLIENT_PERMISSIONS[guildLanguage].replace('{PERMISSION}', commandos.clientRequiredPermissions.map(v => unescape(v, '_')).join(', ')), ephemeral: true,
                        });
                    }
                }

                if (commandos.userRequiredPermissions) {
                    if (!Array.isArray(commandos.userRequiredPermissions)) commandos.userRequiredPermissions = [commandos.userRequiredPermissions];

                    if (!interaction.member.permissions.has(commandos.userRequiredPermissions)) {
                        return interaction.reply.send({
                            content:
                                this.client.languageFile.MISSING_PERMISSIONS[guildLanguage].replace('{PERMISSION}', commandos.userRequiredPermissions.map(v => unescape(v, '_')).join(', ')), ephemeral: true,
                        });
                    }
                }

                if ((commandos.userRequiredRoles) || (commandos.userRequiredRole)) {
                    if (commandos.userRequiredRole) commandos.userRequiredRoles = commandos.userRequiredRole;
                    if (!Array.isArray(commandos.userRequiredRoles)) commandos.userRequiredRoles = [commandos.userRequiredRoles];

                    const roles = commandos.userRequiredRoles.some(v => interaction.member._roles.includes(v));
                    if (!roles) return interaction.reply.send({ content: this.client.languageFile.MISSING_ROLES[guildLanguage].replace('{ROLES}', `\`${commandos.userRequiredRoles.map(r => interaction.guild.roles.cache.get(r).name).join(', ')}\``), ephemeral: true });
                }

                try {
                    const client = this.client, bot = this.client;
                    commandos.run({
                        client, bot, interaction,
                        member: interaction.member,
                        author: interaction.author,
                        guild: interaction.guild,
                        channel: interaction.channel,

                        /**
                         * Respond
                         * @param {string|GPayloadOptions} result
                         * @returns {Message}
                         * @memberof GEventHandling
                         */
                        respond: result => interaction.reply.send(result),
                        edit: result => interaction.reply.edit(result),
                        followUp: result => interaction.reply.followUp(result),
                        args: interaction.arrayArguments,
                        objectArgs: interaction.objectArguments,
                    });
                } catch (e) {
                    this.client.emit(Events.COMMAND_ERROR, { command: commandos, member: interaction.member, channel: interaction.channel, guild: interaction.guild, error: e });
                    this.client.emit(Events.DEBUG, e);
                }

                this.client.emit(Events.COMMAND_EXECUTE, { command: commandos, member: interaction.member, channel: interaction.channel, guild: interaction.guild });
            } catch (e) {
                this.client.emit(Events.COMMAND_ERROR, { command: commandos, member: interaction.member, channel: interaction.channel, guild: interaction.guild, error: e });
                this.client.emit(Events.DEBUG, e);
            }
        });
    }

    /**
     * Internal method to loadMoreEvents
     * @returns {void}
     * @private
    */
    async loadMoreEvents() {
        await readdirSync(`${__dirname}/../base/actions/`).forEach(file => {
            require(`../base/actions/${file}`)(this.client);
        });
    }
}

module.exports = GEventHandling;
