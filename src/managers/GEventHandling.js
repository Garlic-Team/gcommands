const { readdirSync } = require('fs');
const Argument = require('../commands/argument');
const Color = require('../structures/Color'), { Events } = require('../util/Constants');
const { inhibit, interactionRefactor, channelTypeRefactor } = require('../util/util');
const ifDjsV13 = require('../util/util').checkDjsVersion('13');

/**
 * The GEventHandling class
*/
class GEventHandling {
    /**
     * Creates new GEventHandling instance
     * @param {GCommandsClient} GCommandsClient
     */
    constructor(GCommandsClient) {
        /**
         * GCommandsClient
         * @type {GCommands}
        */
        this.GCommandsClient = GCommandsClient;

        /**
         * Client
         * @type {Client}
        */
        this.client = GCommandsClient.client;

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
        if (String(this.client.slash) === 'true') return;

        this.client.on(ifDjsV13 ? 'messageCreate' : 'message', message => {
            messageEventUse(message);
        });

        this.client.on('messageUpdate', (oldMessage, newMessage) => {
            if (oldMessage.content === newMessage.content || oldMessage.embeds === newMessage.embeds) return;
            messageEventUse(newMessage);
        });

        let messageEventUse = async message => {
            if (!message || !message.author || message.author.bot || !message.guild) return;

            let mentionRegex = new RegExp(`^<@!?(${this.client.user.id})> `);

            let prefix = message.content.match(mentionRegex) ? message.content.match(mentionRegex) : (await message.guild.getCommandPrefix()).filter(p => this.GCommandsClient.caseSensitivePrefixes ? message.content.toLowerCase().slice(0, p.length) === p.toLowerCase() : message.content.slice(0, p.length) === p);
            if (prefix.length === 0) return;

            const [cmd, ...args] = message.content.slice(prefix[0].length).trim().split(/ +/g);
            if (cmd.length === 0) return;

            let commandos;
            try {
                commandos = this.client.gcommands.get(this.GCommandsClient.caseSensitiveCommands ? cmd.toLowerCase() : cmd);
                if (!commandos) commandos = this.client.gcommands.get(this.client.galiases.get(this.GCommandsClient.caseSensitiveCommands ? cmd.toLowerCase() : cmd));

                if (!commandos || String(commandos.slash) === 'true') return;

                let member = message.member, guild = message.guild, channel = message.channel;
                let botMessageInhibit;
                let inhibitReturn = await inhibit(this.client, interactionRefactor(message, commandos), {
                    message, member, guild, channel,
                     respond: async (options = undefined) => {
                        if (this.client.autoTyping) channel.startTyping(this.client.autoTyping);

                        let msg = await message.reply(options);
                        botMessageInhibit = msg;

                        if (this.client.autoTyping) channel.stopTyping(true);
                        return msg;
                    },
                    edit: async (options = undefined) => {
                        if (!botMessageInhibit) return console.log(new Color('&d[GCommands Errors] &cFirst you need to send a respond.'));
                        let editedMsg = await botMessageInhibit.edit(options);
                        return editedMsg;
                    },
                }, args, args);
                if (inhibitReturn === false) return;

                let guildLanguage = await this.client.dispatcher.getGuildLanguage(message.guild.id);
                let cooldown = await this.client.dispatcher.getCooldown(message.guild.id, message.author.id, commandos);
                if (cooldown.cooldown) return message.inlineReply(this.client.languageFile.COOLDOWN[guildLanguage].replace(/{COOLDOWN}/g, cooldown.wait).replace(/{CMDNAME}/g, commandos.name));

                if (commandos.guildOnly && message.guild.id !== commandos.guildOnly) return;

                if (commandos.userOnly) {
                    if (typeof commandos.userOnly === 'object') {
                        let users = commandos.userOnly.some(v => message.author.id === v);
                        if (!users) return;
                    } else if (message.author.id !== commandos.userOnly) { return; }
                }

                if (commandos.channelOnly) {
                    if (typeof commandos.channelOnly === 'object') {
                        let channels = commandos.channelOnly.some(v => message.channel.id === v);
                        if (!channels) return;
                    } else if (message.channel.id !== commandos.channelOnly) { return; }
                }

                let channelType = channelTypeRefactor(message.channel);
                if (commandos.nsfw && !message.channel.nsfw) return message.reply(this.client.languageFile.NSFW[guildLanguage]);
                if (commandos.channelTextOnly && channelType !== 'text') return message.reply(this.client.languageFile.CHANNEL_TEXT_ONLY[guildLanguage]);
                if (commandos.channelNewsOnly && channelType !== 'news') return message.reply(this.client.languageFile.CHANNEL_NEWS_ONLY[guildLanguage]);
                if (commandos.channelThreadOnly && channelType !== 'thread') return message.reply({ content: this.client.languageFile.CHANNEL_THREAD_ONLY[guildLanguage], ephemeral: true });

                if (commandos.clientRequiredPermissions) {
                    if (!Array.isArray(commandos.clientRequiredPermissions)) commandos.clientRequiredPermissions = [commandos.clientRequiredPermissions];

                    if (message.channel.permissionsFor(message.guild.me).missing(commandos.clientRequiredPermissions).length > 0) {
                        let permsNeed = this.client.languageFile.MISSING_CLIENT_PERMISSIONS[guildLanguage].replace('{PERMISSION}',commandos.clientRequiredPermissions.map(v => v.split(' ').map(vv => vv[0].toUpperCase() + vv.slice(1).toLowerCase()).join(' ')).join(', '));
                        return message.reply(permsNeed);
                    }
                }

                if (commandos.userRequiredPermissions) {
                    if (!Array.isArray(commandos.userRequiredPermissions)) commandos.userRequiredPermissions = [commandos.userRequiredPermissions];

                    if (!member.permissions.has(commandos.userRequiredPermissions)) {
                        let permsNeed = this.client.languageFile.MISSING_PERMISSIONS[guildLanguage].replace('{PERMISSION}',commandos.userRequiredPermissions.map(v => v.split(' ').map(vv => vv[0].toUpperCase() + vv.slice(1).toLowerCase()).join(' ')).join(', '));
                        return message.reply(permsNeed);
                    }
                }

                if (commandos.userRequiredRoles) {
                    if (!Array.isArray(commandos.userRequiredRoles)) commandos.userRequiredRoles = [commandos.userRequiredRoles];

                    let roles = commandos.userRequiredRoles.some(v => member._roles.includes(v));
                    if (!roles) {
                        let permsNeed = this.client.languageFile.MISSING_ROLES[guildLanguage].replace('{ROLES}', `\`${commandos.userRequiredRoles.map(r => message.guild.roles.cache.get(r).name).join(', ')}\``);
                        return message.reply(permsNeed);
                    }
                }

                let objectArgs = {};
                for (let i in commandos.args) {
                    let arg = new Argument(this.client, commandos.args[i]);
                    if (arg.type === 'invalid') continue;

                    let validArg = async prompt => {
                        let final = await arg.obtain(message, prompt);
                        if (!final.valid) return validArg(message, prompt);

                        return final;
                    };

                    if (args[i]) {
                        let argInvalid = await arg.argument.validate(arg, { content: args[i], guild: message.guild });
                        if (argInvalid) {
                            let argInput = await arg.obtain(message, argInvalid);
                            if (!argInput.valid) argInput = await validArg(argInput.prompt);

                            if (argInput.timeLimit) return message.reply(this.client.languageFile.ARGS_TIME_LIMIT[guildLanguage]);
                            if (argInput.content !== 'skip') {
                                args[i] = argInput.content;
                                objectArgs[arg.name] = argInput.content;
                            }
                        }

                        continue;
                    }

                    let argInput = await arg.obtain(message);
                    if (!argInput.valid) argInput = await validArg(argInput.prompt);

                    if (argInput.timeLimit) return message.reply(this.client.languageFile.ARGS_TIME_LIMIT[guildLanguage]);

                    if (argInput.content !== 'skip') {
                        args[i] = argInput.content;
                        objectArgs[arg.name] = argInput.content;
                    }
                }

                this.client.emit(Events.COMMAND_EXECUTE, commandos, member);

                const client = this.client, bot = this.client;
                let botMessage;
                commandos.run({
                    client, bot, message, member, guild, channel,
                    respond: async (options = undefined) => {
                        if (this.client.autoTyping) ifDjsV13 ? channel.sendTyping() : channel.startTyping();

                        let msg = await message.reply(options);
                        botMessage = msg;

                        if (this.client.autoTyping && !ifDjsV13) channel.stopTyping(true);
                        return msg;
                    },
                    edit: async (options = undefined) => {
                        if (!botMessage) return console.log(new Color('&d[GCommands Errors] &cFirst you need to send a respond.'));
                        let editedMsg = await botMessage.edit(options);
                        return editedMsg;
                    },
                }, args, objectArgs);
            } catch (e) {
                this.client.emit(Events.COMMAND_ERROR, commandos, message.member, e);
                this.GCommandsClient.emit(Events.DEBUG, e);
            }
        };
    }

    /**
     * Internal method to slashEvent
     * @returns {void}
     * @private
    */
    slashEvent() {
        if (String(this.client.slash) === 'false') return;

        this.client.on('GInteraction', async interaction => {
            if (!interaction.isApplication()) return;

            let commandos;
            try {
                commandos = this.client.gcommands.get(this.GCommandsClient.caseSensitiveCommands ? interaction.commandName.toLowerCase() : interaction.commandName);
                if (!commandos || String(commandos.slash) === 'false') return;

                let inhibitReturn = await inhibit(this.client, interactionRefactor(interaction, commandos), {
                    interaction,
                    member: interaction.member,
                    author: interaction.author,
                    guild: interaction.guild,
                    channel: interaction.channel,
                    respond: result => interaction.reply.send(result),
                    edit: result => interaction.reply.edit(result),
                }, interaction.arrayArguments, interaction.objectArguments);
                if (inhibitReturn === false) return;

                let guildLanguage = await this.client.dispatcher.getGuildLanguage(interaction.guild.id);
                let cooldown = await this.client.dispatcher.getCooldown(interaction.guild.id, interaction.author.id, commandos);
                if (cooldown.cooldown) return interaction.reply.send(this.client.languageFile.COOLDOWN[guildLanguage].replace(/{COOLDOWN}/g, cooldown.wait).replace(/{CMDNAME}/g, commandos.name));

                if (commandos.nsfw && !interaction.channel.nsfw) return interaction.reply.send(this.client.languageFile.NSFW[guildLanguage]);

                if (commandos.userOnly) {
                    if (typeof commandos.userOnly === 'object') {
                        let users = commandos.userOnly.some(v => interaction.author.id === v);
                        if (!users) return;
                    } else if (interaction.author.id !== commandos.userOnly) { return; }
                }

                if (commandos.channelOnly) {
                    if (typeof commandos.channelOnly === 'object') {
                        let channels = commandos.channelOnly.some(v => interaction.channel.id === v);
                        if (!channels) return;
                    } else if (interaction.channel.id !== commandos.channelOnly) { return; }
                }

                let channelType = channelTypeRefactor(interaction.channel);

                if (commandos.nsfw && !interaction.channel.nsfw) { return interaction.reply.send({ content: this.client.languageFile.NSFW[guildLanguage], ephemeral: true }); }
                if (commandos.channelTextOnly && channelType !== 'text') { return interaction.reply.send({ content: this.client.languageFile.CHANNEL_TEXT_ONLY[guildLanguage], ephemeral: true }); }
                if (commandos.channelNewsOnly && channelType !== 'news') { return interaction.reply.send({ content: this.client.languageFile.CHANNEL_NEWS_ONLY[guildLanguage], ephemeral: true }); }
                if (commandos.channelThreadOnly && channelType !== 'thread') { return interaction.reply.send({ content: this.client.languageFile.CHANNEL_THREAD_ONLY[guildLanguage], ephemeral: true }); }

                if (commandos.clientRequiredPermissions) {
                    if (!Array.isArray(commandos.clientRequiredPermissions)) commandos.clientRequiredPermissions = [commandos.clientRequiredPermissions];

                    if (interaction.guild.channels.cache.get(interaction.channel.id).permissionsFor(interaction.guild.me).missing(commandos.clientRequiredPermissions).length > 0) {
                        return interaction.reply.send({ content:
                            this.client.languageFile.MISSING_CLIENT_PERMISSIONS[guildLanguage].replace('{PERMISSION}',commandos.clientRequiredPermissions.map(v => v.split(' ').map(vv => vv[0].toUpperCase() + vv.slice(1).toLowerCase()).join(' ')).join(', ')), ephemeral: true,
                        });
                    }
                }

                if (commandos.userRequiredPermissions) {
                    if (!Array.isArray(commandos.userRequiredPermissions)) commandos.userRequiredPermissions = [commandos.userRequiredPermissions];

                    if (!interaction.member.permissions.has(commandos.userRequiredPermissions)) {
                        return interaction.reply.send({ content:
                            this.client.languageFile.MISSING_PERMISSIONS[guildLanguage].replace('{PERMISSION}',commandos.userRequiredPermissions.map(v => v.split(' ').map(vv => vv[0].toUpperCase() + vv.slice(1).toLowerCase()).join(' ')).join(', ')), ephemeral: true,
                        });
                    }
                }

                if ((commandos.userRequiredRoles) || (commandos.userRequiredRole)) {
                    if (commandos.userRequiredRole) commandos.userRequiredRoles = commandos.userRequiredRole;
                    if (!Array.isArray(commandos.userRequiredRoles)) commandos.userRequiredRoles = [commandos.userRequiredRoles];

                    let roles = commandos.userRequiredRoles.some(v => interaction.member.roles.includes(v));
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
                    }, interaction.arrayArguments, interaction.objectArguments);
                } catch (e) {
                    this.client.emit(Events.COMMAND_ERROR, commandos, interaction.member, e);
                    this.GCommandsClient.emit(Events.DEBUG, e);
                }

                this.client.emit(Events.COMMAND_EXECUTE, commandos, interaction.member);
            } catch (e) {
                this.client.emit(Events.COMMAND_ERROR, commandos, interaction.member, e);
                this.GCommandsClient.emit(Events.DEBUG, e);
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
