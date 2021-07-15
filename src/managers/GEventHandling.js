const {Collection} = require('discord.js');
const { readdirSync } = require('fs');
const Argument = require('../commands/argument');
const Color = require('../structures/Color'), { Events } = require('../util/Constants');
const GInteraction = require('../structures/GInteraction');
const ifDjsV13 = require('../util/updater').checkDjsVersion('13'), { inhibit, interactionRefactor } = require('../util/util')

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
         * client
         * @type {Client}
        */
        this.client = GCommandsClient.client;

        this.messageEvent()
        this.slashEvent()
        this.loadMoreEvents()
    }

    /**
     * Internal method to messageEvent
     * @returns {void}
     * @private
    */
    async messageEvent() {
        if((this.client.slash == false) || (this.client.slash == 'both')) {
            this.client.on('message', async(message) => {
                messageEventUse(message)
            })

            this.client.on('messageUpdate', async(oldMessage, newMessage) => {
                if(oldMessage.content == newMessage.content || oldMessage.embeds == newMessage.embeds) return;
                messageEventUse(newMessage)
            })
        }

        let messageEventUse = async(message) => {
            if (!message || !message.author || message.author.bot || !message.guild) return;

            let mentionRegex = new RegExp(`^<@!?(${this.client.user.id})> `)

            let prefix = message.content.match(mentionRegex) ? message.content.match(mentionRegex) : (await message.guild.getCommandPrefix()).filter(p => message.content.startsWith(p))
            if(prefix.length === 0) return;

            if (this.GCommandsClient.caseSensitivePrefixes && !message.content.toLowerCase().startsWith(prefix[0].toLowerCase())) return;
            else if (!message.content.startsWith(prefix[0])) return;
        
            const args = message.content.slice(prefix.length).trim().split(/ +/g);
            const cmd = this.GCommandsClient.caseSensitiveCommands ? args.shift().toLowerCase() : args.shift();
            
            if (cmd.length === 0) return;
    
            try {
                let commandos = this.client.gcommands.get(cmd);
                if(!commandos) commandos = this.client.gcommands.get(this.client.galiases.get(cmd));
                if(!commandos) return;
                if(String(commandos.slash) == 'true') return;

                let member = message.member, guild = message.guild, channel = message.channel
                let botMessageInhibit;
                let inhibitReturn = await inhibit(this.client, interactionRefactor(this.client, commandos), {
                    message, member, guild, channel,
                    /**
                     * Respond
                     * @type {Interface}
                     * @param {RespondOptions} result 
                     * @returns {Object}
                    */
                     respond: async(options = undefined) => {
                        if(this.client.autoTyping) channel.startTyping(this.client.autoTyping);

                        let msg = await message.send(options);
                        botMessageInhibit = msg;

                        if(this.client.autoTyping) channel.stopTyping(true);
                        return msg;
                    },
                    edit: async(options = undefined) => {
                        if(!botMessageInhibit) return console.log(new Color('&d[GCommands Errors] &cFirst you need to send a respond.'))
                        return await botMessageInhibit.edit(options);
                    }
                }, args, args)
                if(inhibitReturn == false) return;

                let guildLanguage = await this.client.dispatcher.getGuildLanguage(message.guild.id);
                let cooldown = await this.client.dispatcher.getCooldown(message.guild.id, message.author.id, commandos)
                if(cooldown.cooldown) return message.inlineReply(this.client.languageFile.COOLDOWN[guildLanguage].replace(/{COOLDOWN}/g, cooldown.wait).replace(/{CMDNAME}/g, commandos.name))

                if(commandos.nsfw) {
                    if(!message.channel.nsfw) {
                        return ifDjsV13 ? message.inlineReply(this.client.languageFile.NSFW[guildLanguage]) : message.reply(this.client.languageFile.NSFW[guildLanguage]);
                    }
                }

                if(commandos.guildOnly) {
                    if(message.guild.id !== commandos.guildOnly) return;
                } 

                if(commandos.userOnly) {
                    if(typeof commandos.userOnly == 'object') {
                        let users = commandos.userOnly.some(v => message.author.id == v)
                        if(!users) return;
                    } else {
                        if(message.author.id !== commandos.userOnly) return;
                    }
                }

                if(commandos.channelOnly) {
                    if(typeof commandos.channelOnly == 'object') {
                        let channels = commandos.channelOnly.some(v => message.channel.id == v)
                        if(!channels) return;
                    } else {
                        if(message.channel.id !== commandos.channelOnly) return;
                    }
                }

                if(commandos.channelTextOnly && message.channel.type != 'text') return message.send(this.client.languageFile.CHANNEL_TEXT_ONLY[guildLanguage])
                if(commandos.channelNewsOnly && message.channel.type != 'news') return message.send(this.client.languageFile.CHANNEL_NEWS_ONLY[guildLanguage])

                if(commandos.clientRequiredPermissions) {
                    if(!Array.isArray(commandos.clientRequiredPermissions)) commandos.clientRequiredPermissions = [commandos.clientRequiredPermissions];

                    if(message.channel.permissionsFor(message.guild.me).missing(commandos.clientRequiredPermissions).length > 0) {
                        let permsNeed = this.client.languageFile.MISSING_CLIENT_PERMISSIONS[guildLanguage].replace('{PERMISSION}',commandos.clientRequiredPermissions.map(v => v.split(' ').map(vv => vv[0].toUpperCase() + vv.slice(1).toLowerCase()).join(' ')).join(', '));
                        return ifDjsV13 ? message.inlineReply(permsNeed) : message.reply(permsNeed);
                    }
                }

                if(commandos.userRequiredPermissions) {
                    if(!Array.isArray(commandos.userRequiredPermissions)) commandos.userRequiredPermissions = [commandos.userRequiredPermissions];

                    if(!message.member.permissions.has(commandos.userRequiredPermissions)) {
                        let permsNeed = this.client.languageFile.MISSING_PERMISSIONS[guildLanguage].replace('{PERMISSION}',commandos.userRequiredPermissions.map(v => v.split(' ').map(vv => vv[0].toUpperCase() + vv.slice(1).toLowerCase()).join(' ')).join(', '));
                        return ifDjsV13 ? message.inlineReply(permsNeed) : message.reply(permsNeed);
                    }
                }

                if(commandos.userRequiredRoles) {
                    if(!Array.isArray(commandos.userRequiredRoles)) commandos.userRequiredRoles = [commandos.userRequiredRoles];

                    let roles = commandos.userRequiredRoles.some(v => message.member._roles.includes(v))
                    if(!roles) {
                        let permsNeed = this.client.languageFile.MISSING_ROLES[guildLanguage].replace('{ROLES}', `\`${commandos.userRequiredRoles.map(r => message.guild.roles.cache.get(r).name).join(', ')}\``);
                        return ifDjsV13 ? message.inlineReply(permsNeed) : message.reply(permsNeed);
                    }
                }

                if(commandos.userRequiredRole) {
                    if(!Array.isArray(commandos.userRequiredRole)) commandos.userRequiredRole = [commandos.userRequiredRole];

                    let roles = commandos.userRequiredRole.some(v => message.member._roles.includes(v))
                    if(!roles) {
                        let permsNeed = this.client.languageFile.MISSING_ROLES[guildLanguage].replace('{ROLES}', `\`${commandos.userRequiredRoles.map(r => message.guild.roles.cache.get(r).name).join(', ')}\``);
                        return ifDjsV13 ? message.inlineReply(permsNeed) : message.reply(permsNeed);
                    }
                }

                for(let i in commandos.args) {
                    let arg = new Argument(this.client, commandos.args[i]);

                    if(args[i]) {
                        let argInvalid = await arg.argument.validate(arg, {content: args[i], guild: message.guild})
                        if(argInvalid) {
                            let argInput = await arg.obtain(message, argInvalid)
                            if(!argInput.valid) argInput = await arg.obtain(message, argInput.prompt);
        
                            if(argInput.timeLimit) return message.reply(this.client.languageFile.ARGS_TIME_LIMIT[guildLanguage]);
                            args[i] = argInput.content;
                        }
    
                        continue;
                    }

                    let argInput = await arg.obtain(message)
                    if(!argInput.valid) argInput = await arg.obtain(message, argInput.prompt);

                    if(argInput.timeLimit) return message.reply(this.client.languageFile.ARGS_TIME_LIMIT[guildLanguage]);
                    args[i] = argInput.content;
                }

                this.GCommandsClient.emit(Events.DEBUG, new Color('&d[GCommands Debug] &3User &a' + message.author.id + '&3 used &a' + cmd).getText())

                const client = this.client, bot = this.client
                let botMessage;
                commandos.run({
                    client, bot, message, member, guild, channel,
                    /**
                     * Respond
                     * @type {Interface}
                     * @param {RespondOptions} result 
                     * @returns {Object}
                    */
                    respond: async(options = undefined) => {
                        if(this.client.autoTyping) channel.startTyping(this.client.autoTyping);

                        let msg = await message.send(options);
                        botMessage = msg;

                        if(this.client.autoTyping) channel.stopTyping(true);
                        return msg;
                    },
                    edit: async(options = undefined) => {
                        if(!botMessage) return console.log(new Color('&d[GCommands Errors] &cFirst you need to send a respond.'))
                        return await botMessage.edit(options);
                    }
                }, args, args)
            } catch(e) {
                this.GCommandsClient.emit(Events.DEBUG, e);

                if(!this.GCommandsClient.unkownCommandMessage) return;
                if(this.client.languageFile.UNKNOWN_COMMAND[this.client.language]) {
                    message.channel.send(this.client.languageFile.UNKNOWN_COMMAND[guildLanguage].replace('{COMMAND}',cmd));
                }
            }
        }
    }

    /**
     * Internal method to slashEvent
     * @returns {void}
     * @private
    */
    async slashEvent() {
        if((this.client.slash) || (this.client.slash == 'both')) {
            this.client.ws.on('INTERACTION_CREATE', async (int) => {
                let interaction = new GInteraction(this.client, int)

                if(interaction.type !== 2) return;
                try {
                    let commandos = this.client.gcommands.get(interaction.interaction.name);
                    if(!commandos) return;
                    if(commandos.slash == false || commandos.slash == 'false') return;
                    if (!this.client.cooldowns.has(commandos.name)) {
                        this.client.cooldowns.set(commandos.name, new Collection());
                    }

                    let inhibitReturn = await inhibit(this.client, interactionRefactor(this.client, commandos), {
                        interaction, 
                        member: interaction.member,
                        author: interaction.user,
                        guild: interaction.guild, 
                        channel: interaction.channel,
                        respond: async(result) => {
                            return interaction.reply.send(result);
                        },
                        edit: async(result) => {
                            return interaction.reply.edit(result);
                        }
                    }, await this.getSlashArgs(interaction.interaction.options || []), await this.getSlashArgsObject(interaction.interaction.options || []))
                    if(inhibitReturn == false) return;

                    let guildLanguage = await this.client.dispatcher.getGuildLanguage(interaction.member.guild.id);
                    let cooldown = await this.client.dispatcher.getCooldown(interaction.member.guild.id, interaction.member.user.id, commandos)
                    if(cooldown.cooldown) return interaction.reply.send(this.client.languageFile.COOLDOWN[guildLanguage].replace(/{COOLDOWN}/g, cooldown.wait).replace(/{CMDNAME}/g, commandos.name))

                    if(commandos.nsfw && !interaction.channel.nsfw) return interaction.reply.send(this.client.languageFile.NSFW[guildLanguage])

                    if(commandos.userOnly) {
                        if(typeof commandos.userOnly == 'object') {
                            let users = commandos.userOnly.some(v => interaction.member.user.id == v)
                            if(!users) return;
                        } else {
                            if(interaction.member.user.id !== commandos.userOnly) return;
                        }
                    }

                    if(commandos.channelOnly) {
                        if(typeof commandos.channelOnly == 'object') {
                            let channels = commandos.channelOnly.some(v => interaction.channel.id == v);
                            if(!channels) return;
                        } else {
                            if(interaction.channel.id !== commandos.channelOnly) return;
                        }
                    }

                    if(commandos.channelTextOnly && interaction.channel.type != 'text') return interaction.reply.send({content: this.client.languageFile.CHANNEL_TEXT_ONLY[guildLanguage], ephemeral: true})
                    if(commandos.channelNewsOnly && interaction.channel.type != 'news') return interaction.reply.send({content: this.client.languageFile.CHANNEL_NEWS_ONLY[guildLanguage], ephemeral: true})

                    if(commandos.clientRequiredPermissions) {
                        if(!Array.isArray(commandos.clientRequiredPermissions)) commandos.clientRequiredPermissions = [commandos.clientRequiredPermissions];

                        if(member.guild.channels.cache.get(interaction.channel.id).permissionsFor(member.guild.me).missing(commandos.clientRequiredPermissions).length > 0) return interaction.reply.send({content: this.client.languageFile.MISSING_CLIENT_PERMISSIONS[guildLanguage].replace('{PERMISSION}',commandos.clientRequiredPermissions.map(v => v.split(' ').map(vv => vv[0].toUpperCase() + vv.slice(1).toLowerCase()).join(' ')).join(', ')), ephemeral: true})
                    }

                    if(commandos.userRequiredPermissions) {
                        if(!Array.isArray(commandos.userRequiredPermissions)) commandos.userRequiredPermissions = [commandos.userRequiredPermissions];

                        if(!this.client.guilds.cache.get(interaction.guild.id).members.cache.get(interaction.member.user.id).permissions.has(commandos.userRequiredPermissions)) return interaction.reply.send({content:this.client.languageFile.MISSING_PERMISSIONS[guildLanguage].replace('{PERMISSION}',commandos.userRequiredPermissions.map(v => v.split(' ').map(vv => vv[0].toUpperCase() + vv.slice(1).toLowerCase()).join(' ')).join(', ')), ephemeral: true})
                    }

                    if((commandos.userRequiredRoles) || (commandos.userRequiredRole)) {
                        if(commandos.userRequiredRole) commandos.userRequiredRoles = commandos.userRequiredRole;
                        if(!Array.isArray(commandos.userRequiredRoles)) commandos.userRequiredRoles = [commandos.userRequiredRoles];
    
                        let roles = commandos.userRequiredRoles.some(v => interaction.member.roles.includes(v))
                        if(!roles) return interaction.reply.send({content: this.client.languageFile.MISSING_ROLES[guildLanguage].replace('{ROLES}', `\`${commandos.userRequiredRoles.map(r => member.guild.roles.cache.get(r).name).join(', ')}\``), ephemeral: true})
                    }

                    try {
                        /**
                         * Return system for slash
                         * @name ReturnSystem
                         * @param {DiscordClient} client
                         * @param {Object} interaction
                         * @example 
                         *  return {
                         *      content: 'hi',
                         *      ephemeral: true,
                         *      allowedMentions: { parse: [], repliedUser: true }
                         *  }
                         */

                        const client = this.client, bot = this.client
                        commandos.run({
                            client, bot, interaction,
                            member: interaction.member,
                            author: interaction.user,
                            guild: interaction.guild, 
                            channel: interaction.channel,                          
                            /**
                             * Respond
                             * @type {Interface}
                             * @param {RespondOptions} result 
                             * @returns {Object}
                            */
                            respond: async(result) => {
                                return interaction.reply.send(result);
                            },
                            edit: async(result) => {
                                return interaction.reply.edit(result);
                            }
                        }, await this.getSlashArgs(interaction.interaction.options || []), await this.getSlashArgsObject(interaction.interaction.options || []))
                    } catch(e) {
                        this.GCommandsClient.emit(Events.DEBUG, new Color('&d[GCommands Debug] &3' + e).getText())
                    }
                    
                    this.GCommandsClient.emit(Events.DEBUG, new Color('&d[GCommands Debug] &3User &a' + interaction.member.user.id + '&3 used &a' + interaction.interaction.name).getText())
                }catch(e) {
                    this.GCommandsClient.emit(Events.DEBUG, e);

                    if(!this.unkownCommandMessage) return;
                    if(this.client.languageFile.UNKNOWN_COMMAND[guildLanguage]) {
                        this.client.api.interactions(interaction.id, interaction.token).callback.post({
                            data: {
                                type: 4,
                                data: {
                                    content: this.client.languageFile.UNKNOWN_COMMAND[guildLanguage].replace('{COMMAND}',interaction.data.name)
                                }
                            }
                        });
                    }
                }
            })
        }
    }

    /**
     * Internal method to loadMoreEvents
     * @returns {void}
     * @private
    */
    async loadMoreEvents() {
        await readdirSync(`${__dirname}/../base/actions/`).forEach(file => {
            require(`../base/actions/${file}`)(this.client)
        })
    }

    /**
     * Internal method to getSlashArgs
     * @returns {Array}
     * @private
    */
    getSlashArgs(options) {
        let args = [];
  
        let check = (option) => {
          if (!option) return;
          if (option.value) args.push(option.value);
          else args.push(option.name);
      
          if (option.options) {
            for (let o = 0; o < option.options.length; o++) {
              check(option.options[o]);
            }
          }
        }
      
        if (Array.isArray(options)) {
          for (let o = 0; o < options.length; o++) {
            check(options[o]);
          }
        } else {
          check(options);
        }
      
        return args;
    }

    /**
     * Internal method to getSlashArgsObject
     * @returns {object}
     * @private
    */
    getSlashArgsObject(options) {
        let args = {};
        for (let o of options) {
          if (o.type == 1) args[o.name] = this.getSlashArgsObject(o.options || []);
          else if (o.type == 2) args[o.name] = this.getSlashArgsObject(o.options || []); 
          else {
              args[o.name] = o.value;
          }
        }
        return args;
    }
}

module.exports = GEventHandling;