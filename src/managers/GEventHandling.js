const { readdirSync } = require('fs');
const Argument = require('../commands/argument');
const ArgumentType = require('../util/Constants').ArgumentType;
const { Events } = require('../util/Constants'), Color = require('../structures/Color');
const { inhibit, interactionRefactor, channelTypeRefactor, unescape } = require('../util/util');

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
        this.client.on('messageCreate', message => {
            messageEventUse(message);
        });

        this.client.on('messageUpdate', (oldMessage, newMessage) => {
            if (oldMessage.content === newMessage.content || oldMessage.embeds === newMessage.embeds) return;
            messageEventUse(newMessage);
        });

        const messageEventUse = async message => {
            if (!message || !message.author || message.author.bot || (!this.client.allowDm && message.channel.type === 'dm')) return;

            const mention = message.content.match(new RegExp(`^<@!?(${this.client.user.id})> `));
            const prefix = mention ? mention[0] : (message.guild ? (await message.guild.getCommandPrefix())[0] : this.client.prefix[0]);

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

                const isDmEnabled = ['false'].includes(String(commandos.allowDm));
                const isClientDmEnabled = !commandos.allowDm && ['false'].includes(String(this.client.allowDm));
                const isMessageEnabled = ['false', 'slash'].includes(String(commandos.slash));
                const isClientMessageEnabled = !commandos.slash && ['false', 'slash'].includes(String(this.client.slash));

                const channelType = channelTypeRefactor(message.channel);
                const isNotDm = channelType !== 'dm';

                if (!isNotDm && isDmEnabled) return;
                if (!isNotDm && isClientDmEnabled) return;
                if (!commandos) return this.client.emit(Events.COMMAND_NOT_FOUND, new Color(`&d[GCommands] &cCommand not found (message): &e➜   &3${cmd ? cmd.name ? String(cmd.name) : String(cmd) : null}`, { json: false }).getText());
                if (isMessageEnabled) return;
                if (isClientMessageEnabled) return;

                const language = isNotDm ? await this.client.dispatcher.getGuildLanguage(message.guild.id) : this.client.language;

                const runOptions = {
                    member: message.member,
                    author: message.author,
                    guild: message.guild,
                    channel: message.channel,
                    message: message,
                    client: this.client,
                    bot: this.client,
                    language: language,
                    respond: (options = undefined) => message.reply(options),
                    followUp: (options = undefined) => message.reply(options),
                };

                const inhibitReturn = await inhibit(this.client, interactionRefactor(message, commandos), {
                    ...runOptions,
                    args: args,
                });

                if (inhibitReturn === false) return;

                const cooldown = message.guild ? await this.client.dispatcher.getCooldown(message.guild.id, message.author.id, commandos) : null;
                const getCooldownMessage = () => this.client.languageFile.COOLDOWN[language].replace(/{COOLDOWN}/g, cooldown.wait).replace(/{CMDNAME}/g, commandos.name);

                if (cooldown?.cooldown) return message.reply(getCooldownMessage());

                const isNotGuild = guild => !commandos.guildOnly.includes(guild);

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

                const isNotChannelType = type => channelType !== type;
                const getChannelTextOnlyMessage = () => this.client.languageFile.CHANNEL_TEXT_ONLY[language];
                const getChannelNewsOnlyMessage = () => this.client.languageFile.CHANNEL_NEWS_ONLY[language];
                const getChannelThreadOnlyMessage = () => this.client.languageFile.CHANNEL_THREAD_ONLY[language];

                if (isNotDm && commandos.channelTextOnly && isNotChannelType('text')) return message.reply(getChannelTextOnlyMessage());
                if (isNotDm && commandos.channelNewsOnly && isNotChannelType('news')) return message.reply(getChannelNewsOnlyMessage());
                if (isNotDm && commandos.channelThreadOnly && isNotChannelType('thread')) return message.reply({ content: getChannelThreadOnlyMessage(), ephemeral: true });

                const NSFW = message.guild ? commandos.nsfw && !message.channel.nsfw : null;
                const getNsfwMessage = () => this.client.languageFile.NSFW[language];

                if (NSFW) return message.reply(getNsfwMessage());

                const getMissingClientPermissionsMessage = () => this.client.languageFile.MISSING_CLIENT_PERMISSIONS[language].replace('{PERMISSION}', commandos.clientRequiredPermissions.map(v => unescape(v, '_')).join(', '));

                if (isNotDm && commandos.clientRequiredPermissions) {
                    if (!Array.isArray(commandos.clientRequiredPermissions)) commandos.clientRequiredPermissions = [commandos.clientRequiredPermissions];

                    if (message.channel.permissionsFor(message.guild.me).missing(commandos.clientRequiredPermissions).length > 0) return message.reply(getMissingClientPermissionsMessage());
                }

                const getMissingPermissionsMessage = () => this.client.languageFile.MISSING_PERMISSIONS[language].replace('{PERMISSION}', commandos.userRequiredPermissions.map(v => unescape(v, '_')).join(', '));

                if (isNotDm && commandos.userRequiredPermissions) {
                    if (!Array.isArray(commandos.userRequiredPermissions)) commandos.userRequiredPermissions = [commandos.userRequiredPermissions];

                    if (!message.member.permissions.has(commandos.userRequiredPermissions)) return message.reply(getMissingPermissionsMessage());
                }

                const getMissingRolesMessage = () => this.client.languageFile.MISSING_ROLES[language].replace('{ROLES}', `\`${commandos.userRequiredRoles.map(r => message.guild.roles.cache.get(r).name).join(', ')}\``);

                if (isNotDm && commandos.userRequiredRoles) {
                    if (!Array.isArray(commandos.userRequiredRoles)) commandos.userRequiredRoles = [commandos.userRequiredRoles];

                    const roles = commandos.userRequiredRoles.some(v => message.member._roles.includes(v));
                    if (!roles) return message.reply(getMissingRolesMessage());
                }

                const getArgsTimeLimitMessage = () => this.client.languageFile.ARGS_TIME_LIMIT[language];

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
                    const arg = new Argument(this.client, options, isNotDm);
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
                    const arg = new Argument(this.client, cmdArgs[i], isNotDm);
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

                this.client.emit(Events.COMMAND_EXECUTE, { command: commandos, member: message.member, channel: message.channel, guild: message.guild });

                commandos.run({
                    ...runOptions,
                    args: finalArgs,
                    objectArgs: getArgsObject(objectArgs),
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
        this.client.on('interactionCreate', async interaction => {
            if (interaction.isMessageComponent()) return;

            let commandos;
            try {
                commandos = this.client.gcommands.find(cmd =>
                    !this.client.caseSensitiveCommands ?
                        (String(interaction.commandName).toLowerCase() === String(cmd.name).toLowerCase() || String(interaction.commandName).toLowerCase() === String(cmd.contextMenuName).toLowerCase()) :
                        (String(interaction.commandName) === String(cmd.name) || String(interaction.commandName) === String(cmd.contextMenuName)),
                );
                if (!commandos) return this.client.emit(Events.COMMAND_NOT_FOUND, new Color(`&d[GCommands] &cCommand not found (slash): &e➜   &3${interaction.commandName ? String(interaction.commandName) : null}`, { json: false }).getText());

                const isDmEnabled = ['false'].includes(String(commandos.allowDm));
                const isClientDmEnabled = !commandos.allowDm && ['false'].includes(String(this.client.allowDm));
                const isSlashEnabled = ['false', 'message'].includes(String(commandos.slash));
                const isClientSlashEnabled = !commandos.slash && ['false', 'message'].includes(String(this.client.slash));
                const isContextEnabled = String(commandos.context) === 'false';
                const isClientContextEnabled = String(this.client.context) === 'false';

                const channelType = channelTypeRefactor(interaction.channel);
                const isNotDm = channelType !== 'dm';

                if (!isNotDm && isDmEnabled) return;
                if (!isNotDm && isClientDmEnabled) return;
                if (interaction.isCommand() && isSlashEnabled) return;
                if (interaction.isCommand() && !commandos.slash && isClientSlashEnabled) return;
                if (interaction.isContextMenu() && isContextEnabled) return;
                if (interaction.isContextMenu() && !commandos.context && isClientContextEnabled) return;

                const language = interaction.guild ? await this.client.dispatcher.getGuildLanguage(interaction.guild.id) : this.client.language;

                const runOptions = {
                    member: interaction.member,
                    author: interaction.member.user,
                    guild: interaction.guild,
                    channel: interaction.channel,
                    interaction: interaction,
                    client: this.client,
                    bot: this.client,
                    language: language,
                    respond: options => interaction.reply(options),
                    edit: options => interaction.edit(options),
                    followUp: options => interaction.followUp(options),
                };

                const inhibitReturn = await inhibit(this.client, interactionRefactor(interaction, commandos), {
                    ...runOptions,
                    args: interaction.arrayArguments,
                });
                if (inhibitReturn === false) return;

                const cooldown = interaction.guild ? await this.client.dispatcher.getCooldown(interaction.guild.id, interaction.member.id, commandos) : null;
                const getCooldownMessage = () => this.client.languageFile.COOLDOWN[language].replace(/{COOLDOWN}/g, cooldown.wait).replace(/{CMDNAME}/g, commandos.name);

                if (cooldown?.cooldown) return interaction.reply.send(getCooldownMessage());

                if (commandos.userOnly) {
                    if (typeof commandos.userOnly === 'object') {
                        const users = commandos.userOnly.some(v => interaction.member.id === v);
                        if (!users) return;
                    } else if (interaction.member.id !== commandos.userOnly) { return; }
                }

                if (isNotDm && commandos.channelOnly) {
                    if (typeof commandos.channelOnly === 'object') {
                        const channels = commandos.channelOnly.some(v => interaction.channel.id === v);
                        if (!channels) return;
                    } else if (interaction.channel.id !== commandos.channelOnly) { return; }
                }

                const NSFW = interaction.guild ? commandos.nsfw && !interaction.channel.nsfw : null;
                const getNsfwMessage = () => this.client.languageFile.NSFW[language];

                if (isNotDm && NSFW) { return interaction.reply.send({ content: getNsfwMessage(), ephemeral: true }); }

                const isNotChannelType = type => channelType !== type;
                const getChannelTextOnlyMessage = () => this.client.languageFile.CHANNEL_TEXT_ONLY[language];
                const getChannelNewsOnlyMessage = () => this.client.languageFile.CHANNEL_NEWS_ONLY[language];
                const getChannelThreadOnlyMessage = () => this.client.languageFile.CHANNEL_THREAD_ONLY[language];

                if (isNotDm && commandos.channelTextOnly && isNotChannelType('text')) { return interaction.reply.send({ content: getChannelTextOnlyMessage(), ephemeral: true }); }
                if (isNotDm && commandos.channelNewsOnly && isNotChannelType('news')) { return interaction.reply.send({ content: getChannelNewsOnlyMessage(), ephemeral: true }); }
                if (isNotDm && commandos.channelThreadOnly && isNotChannelType('thread')) { return interaction.reply.send({ content: getChannelThreadOnlyMessage(), ephemeral: true }); }

                const getMissingClientPermissionsMessage = () => this.client.languageFile.MISSING_CLIENT_PERMISSIONS[language].replace('{PERMISSION}', commandos.clientRequiredPermissions.map(v => unescape(v, '_')).join(', '));

                if (isNotDm && commandos.clientRequiredPermissions) {
                    if (!Array.isArray(commandos.clientRequiredPermissions)) commandos.clientRequiredPermissions = [commandos.clientRequiredPermissions];

                    if (interaction.guild.channels.cache.get(interaction.channel.id).permissionsFor(interaction.guild.me).missing(commandos.clientRequiredPermissions).length > 0) {
                        return interaction.reply.send({
                            content: getMissingClientPermissionsMessage(),
                            ephemeral: true,
                        });
                    }
                }

                const getMissingPermissionsMessage = () => this.client.languageFile.MISSING_PERMISSIONS[language].replace('{PERMISSION}', commandos.userRequiredPermissions.map(v => unescape(v, '_')).join(', '));

                if (isNotDm && commandos.userRequiredPermissions) {
                    if (!Array.isArray(commandos.userRequiredPermissions)) commandos.userRequiredPermissions = [commandos.userRequiredPermissions];

                    if (!interaction.member.permissions.has(commandos.userRequiredPermissions)) {
                        return interaction.reply.send({
                            content: getMissingPermissionsMessage(),
                            ephemeral: true,
                        });
                    }
                }

                const getMissingRolesMessage = () => this.client.languageFile.MISSING_ROLES[language].replace('{ROLES}', `\`${commandos.userRequiredRoles.map(r => interaction.guild.roles.cache.get(r).name).join(', ')}\``);

                if (isNotDm && commandos.userRequiredRoles) {
                    if (!Array.isArray(commandos.userRequiredRoles)) commandos.userRequiredRoles = [commandos.userRequiredRoles];

                    const roles = commandos.userRequiredRoles.some(v => interaction.member._roles.includes(v));
                    if (!roles) return interaction.reply.send({ content: getMissingRolesMessage(), ephemeral: true });
                }

                this.client.emit(Events.COMMAND_EXECUTE, { command: commandos, member: interaction.member, channel: interaction.channel, guild: interaction.guild });

                commandos.run({
                    ...runOptions,
                    args: interaction.arrayArguments,
                    objectArgs: interaction.objectArguments,
                });
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
