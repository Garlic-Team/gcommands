const { readdirSync } = require('fs');
const ArgumentsCollector = require('../structures/ArgumentsCollector');
const { Events } = require('../util/Constants'), Color = require('../structures/Color');
const { inhibit, unescape, resolveMessageOptions } = require('../util/util');

/**
 * The handler for message and slash commands
 * @private
*/
class GEventHandling {
    /**
     * @param {GCommandsClient} client
     * @constructor
     */
    constructor(client) {
        /**
         * The client
         * @type {GCommandsClient}
        */
        this.client = client;

        this.messageEvent();
        this.slashEvent();
        this.loadMoreEvents();
    }

    /**
     * Internal method to handle message event
     * @returns {void}
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
            if (!message || !message.author || message.author.bot) return;

            const isNotDm = message.inGuild();
            const language = isNotDm ? await message.guild.getLanguage() : this.client.language;

            if (message.guild && !message.guild.available) {
                return message.reply({
                    content: this.client.languageFile.GUILD_UNAVAILABLE[language],
                });
            }

            const mention = message.content.split(' ')[0].match(new RegExp(`^<@!?(${this.client.user.id})>`));
            const prefix = mention ? mention[0] : (message.guild ? await message.guild.getCommandPrefix() : this.client.prefix);

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

                if (!commandos) return this.client.emit(Events.COMMAND_NOT_FOUND, new Color(`&d[GCommands] &cCommand not found (message): &e➜   &3${cmd ? cmd.name ? String(cmd.name) : String(cmd) : null}`, { json: false }).getText());

                const isDmEnabled = ['false'].includes(String(commandos.allowDm));
                const isClientDmEnabled = !commandos.allowDm && ['false'].includes(String(this.client.allowDm));
                const isMessageEnabled = ['false', 'slash'].includes(String(commandos.slash));
                const isClientMessageEnabled = !commandos.slash && ['false', 'slash'].includes(String(this.client.slash));

                if (!isNotDm && isDmEnabled) return;
                if (!isNotDm && isClientDmEnabled) return;
                if (isMessageEnabled) return;
                if (isClientMessageEnabled) return;

                const runOptions = {
                    member: message.member,
                    author: message.author,
                    guild: message.guild,
                    channel: message.channel,
                    message: message,
                    client: this.client,
                    bot: this.client,
                    language: language,
                    command: commandos,

                    respond: (options = undefined) => message.reply(resolveMessageOptions(options)),
                    followUp: (options = undefined) => message.reply(resolveMessageOptions(options)),
                };

                const inhibitReturn = await inhibit(this.client, {
                    ...runOptions,
                    args: args,
                });

                if (inhibitReturn === false) return;

                const cooldown = await this.client.dispatcher.getCooldown(message.author.id, message.guild, commandos);
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

                const isNotChannelType = type => message.channel.type !== type;
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

                let finalArgs;
                if (commandos.args && commandos.args[0]) {
                    const collector = new ArgumentsCollector(this.client, { message, args, language, isNotDm, commandos });
                    if (await collector.get() === false) return;

                    finalArgs = collector.resolve(collector.finalArgs);
                }

                this.client.emit(Events.COMMAND_EXECUTE, { command: commandos, member: message.member, channel: message.channel, guild: message.guild });

                commandos.run({
                    ...runOptions,
                    args: finalArgs,
                    objectArgs: finalArgs?._hoistedOptions ? this.argsToObject(finalArgs._hoistedOptions) : {},
                    arrayArgs: finalArgs?._hoistedOptions ? this.argsToArray(finalArgs._hoistedOptions) : [],
                });
            } catch (e) {
                this.client.emit(Events.COMMAND_ERROR, { command: commandos, member: message.member, channel: message.channel, guild: message.guild, error: e });
                this.client.emit(Events.DEBUG, e);
            }
        };
    }

    /**
     * Internal method to handle interaction event
     * @returns {void}
    */
    slashEvent() {
        this.client.on('interactionCreate', async interaction => {
            if (!(interaction.isCommand() || interaction.isContextMenu())) return;

            const isNotDm = interaction.channel.type !== 'dm';
            const language = isNotDm ? await interaction.guild.getLanguage() : this.client.language;

            if (interaction.guild && !interaction.guild.available) {
                return interaction.reply({
                    content: this.client.languageFile.GUILD_UNAVAILABLE[language],
                    ephemeral: true,
                });
            }

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

                if (!isNotDm && isDmEnabled) return;
                if (!isNotDm && isClientDmEnabled) return;
                if (interaction.isCommand() && isSlashEnabled) return;
                if (interaction.isCommand() && !commandos.slash && isClientSlashEnabled) return;
                if (interaction.isContextMenu() && isContextEnabled) return;
                if (interaction.isContextMenu() && !commandos.context && isClientContextEnabled) return;

                const runOptions = {
                    member: interaction.member,
                    author: interaction.user,
                    guild: interaction.guild,
                    channel: interaction.channel,
                    interaction: interaction,
                    client: this.client,
                    bot: this.client,
                    language: language,
                    args: interaction.options,
                    objectArgs: this.argsToObject(interaction.options.data) || {},
                    arrayArgs: this.argsToArray(interaction.options.data) || [],
                    command: commandos,

                    respond: (options = undefined) => interaction.reply(resolveMessageOptions(options)),
                    edit: (options = undefined) => interaction.editReply(resolveMessageOptions(options)),
                    followUp: (options = undefined) => interaction.followUp(resolveMessageOptions(options)),
                };

                const inhibitReturn = await inhibit(this.client, runOptions);

                if (inhibitReturn === false) return;

                const cooldown = interaction.guild ? this.client.dispatcher.getCooldown(interaction.member.id, interaction.guild, commandos) : null;
                const getCooldownMessage = () => this.client.languageFile.COOLDOWN[language].replace(/{COOLDOWN}/g, cooldown.wait).replace(/{CMDNAME}/g, commandos.name);

                if (cooldown?.cooldown) return interaction.reply(getCooldownMessage());

                if (commandos.userOnly) {
                    if (typeof commandos.userOnly === 'object') {
                        const users = commandos.userOnly.some(v => interaction.user.id === v);
                        if (!users) return;
                    } else if (interaction.user.id !== commandos.userOnly) { return; }
                }

                if (isNotDm && commandos.channelOnly) {
                    if (typeof commandos.channelOnly === 'object') {
                        const channels = commandos.channelOnly.some(v => interaction.channel.id === v);
                        if (!channels) return;
                    } else if (interaction.channel.id !== commandos.channelOnly) { return; }
                }

                const NSFW = interaction.guild ? commandos.nsfw && !interaction.channel.nsfw : null;
                const getNsfwMessage = () => this.client.languageFile.NSFW[language];

                if (isNotDm && NSFW) { return interaction.reply({ content: getNsfwMessage(), ephemeral: true }); }

                const isNotChannelType = type => interaction.channel.type !== type;
                const getChannelTextOnlyMessage = () => this.client.languageFile.CHANNEL_TEXT_ONLY[language];
                const getChannelNewsOnlyMessage = () => this.client.languageFile.CHANNEL_NEWS_ONLY[language];
                const getChannelThreadOnlyMessage = () => this.client.languageFile.CHANNEL_THREAD_ONLY[language];

                if (isNotDm && commandos.channelTextOnly && isNotChannelType('text')) { return interaction.reply({ content: getChannelTextOnlyMessage(), ephemeral: true }); }
                if (isNotDm && commandos.channelNewsOnly && isNotChannelType('news')) { return interaction.reply({ content: getChannelNewsOnlyMessage(), ephemeral: true }); }
                if (isNotDm && commandos.channelThreadOnly && isNotChannelType('thread')) { return interaction.reply({ content: getChannelThreadOnlyMessage(), ephemeral: true }); }

                const getMissingClientPermissionsMessage = () => this.client.languageFile.MISSING_CLIENT_PERMISSIONS[language].replace('{PERMISSION}', commandos.clientRequiredPermissions.map(v => unescape(v, '_')).join(', '));

                if (isNotDm && commandos.clientRequiredPermissions) {
                    if (!Array.isArray(commandos.clientRequiredPermissions)) commandos.clientRequiredPermissions = [commandos.clientRequiredPermissions];

                    if (interaction.guild.channels.cache.get(interaction.channel.id).permissionsFor(interaction.guild.me).missing(commandos.clientRequiredPermissions).length > 0) {
                        return interaction.reply({
                            content: getMissingClientPermissionsMessage(),
                            ephemeral: true,
                        });
                    }
                }

                const getMissingPermissionsMessage = () => this.client.languageFile.MISSING_PERMISSIONS[language].replace('{PERMISSION}', commandos.userRequiredPermissions.map(v => unescape(v, '_')).join(', '));

                if (isNotDm && commandos.userRequiredPermissions) {
                    if (!Array.isArray(commandos.userRequiredPermissions)) commandos.userRequiredPermissions = [commandos.userRequiredPermissions];

                    if (!interaction.member.permissions.has(commandos.userRequiredPermissions)) {
                        return interaction.reply({
                            content: getMissingPermissionsMessage(),
                            ephemeral: true,
                        });
                    }
                }

                const getMissingRolesMessage = () => this.client.languageFile.MISSING_ROLES[language].replace('{ROLES}', `\`${commandos.userRequiredRoles.map(r => interaction.guild.roles.cache.get(r).name).join(', ')}\``);

                if (isNotDm && commandos.userRequiredRoles) {
                    if (!Array.isArray(commandos.userRequiredRoles)) commandos.userRequiredRoles = [commandos.userRequiredRoles];

                    const roles = commandos.userRequiredRoles.some(v => interaction.member._roles.includes(v));
                    if (!roles) return interaction.reply({ content: getMissingRolesMessage(), ephemeral: true });
                }

                this.client.emit(Events.COMMAND_EXECUTE, { command: commandos, user: interaction.user, channel: interaction.channel, guild: interaction.guild });

                commandos.run(runOptions);
            } catch (e) {
                this.client.emit(Events.COMMAND_ERROR, { command: commandos, user: interaction.user, channel: interaction.channel, guild: interaction.guild, error: e });
                this.client.emit(Events.DEBUG, e);
            }
        });
    }

    /**
     * Internal method to load more events
     * @returns {void}
    */
    async loadMoreEvents() {
        await readdirSync(`${__dirname}/../base/actions/`).forEach(file => {
            require(`../base/actions/${file}`)(this.client);
        });
    }

    /**
     * Change arguments to object
     */
    argsToObject(options) {
        if (!Array.isArray(options)) return {};
        const args = {};

        for (const o of options) {
          if (['SUB_COMMAND', 'SUB_COMMAND_GROUP'].includes(o.type)) {
            args[o.name] = this.argsToObject(o.options);
          } else {
            args[o.name] = o.value;
          }
        }

        return args;
    }

    /**
     * Change arguments to array
     */
    argsToArray(options) {
        const args = [];

        const check = option => {
          if (!option) return;
          if (option.value) args.push(option.value);
          else args.push(option.name);

          if (option.options) {
            for (let o = 0; o < option.options.length; o++) {
              check(option.options[o]);
            }
          }
        };

        if (Array.isArray(options)) {
          for (let o = 0; o < options.length; o++) {
            check(options[o]);
          }
        } else {
          check(options);
        }

        return args;
    }
}

module.exports = GEventHandling;
