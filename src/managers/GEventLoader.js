const { default: axios } = require("axios");
const {Collection,MessageEmbed, Message} = require("discord.js");
const { readdirSync } = require("fs");
const Color = require("../structures/Color"), { Events } = require("../util/Constants")
const GMessage = require("../structures/GMessage");
const ifDjsV13 = require("../util/updater").checkDjsVersion("13"), { inhibit, interactionRefactor } = require("../util/util")

/**
 * The GCommandsEventLoader class
*/
class GEventLoader {

    /**
     * Creates new GCommandsEventLoader instance
     * @param {GCommandsClient} GCommandsClient
     */
    constructor(GCommandsClient) {
        /**
         * GCommandsEventLoader options
         * @property {Object} GCommandsClient
        */
        this.GCommandsClient = GCommandsClient;

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
        if((this.client.slash == false) || (this.client.slash == "both")) {
            this.client.on('message', async(message) => {
                messageEventUse(message)
            })

            this.client.on('messageUpdate', async(oldMessage, newMessage) => {
                if(oldMessage.content == newMessage.content || oldMessage.embeds == newMessage.embeds) return;
                messageEventUse(newMessage)
            })
        }

        let messageEventUse = async(message) => {
            if(!message) return;
            if (!message.author || message.author.bot) return;
            if (!message.guild) return;
            
            let mentionRegex = new RegExp(`^<@!?(${this.client.user.id})> `)

            let clientDefaultPrefix;
            if(Array.isArray(this.client.prefix)) {
                this.client.prefix.some(pf => {
                    if(message.content.startsWith(pf)) {
                        clientDefaultPrefix = pf;
                    }
                })
            } else clientDefaultPrefix = this.client.prefix

            let prefix = message.content.match(mentionRegex) ? message.content.match(mentionRegex)[0] : clientDefaultPrefix

            if(this.client.database) {
                let guildDefaultPrefix;
                if(Array.isArray(message.guild.prefix)) {
                    message.guild.prefix.some(pf => {
                        if(message.content.startsWith(pf)) {
                            guildDefaultPrefix = pf;
                        }
                    })
                } else guildDefaultPrefix = message.guild.prefix

                let guildSettings = guildDefaultPrefix || clientDefaultPrefix;
                prefix = message.content.match(mentionRegex) ? message.content.match(mentionRegex)[0] : guildSettings
            }

            if (!message.content.startsWith(prefix)) return;
        
            const args = message.content.slice(prefix.length).trim().split(/ +/g);
            const cmd = args.shift().toLowerCase();
            
            if (cmd.length === 0) return;
    
            try {
                let commandos = this.client.gcommands.get(cmd);
                if(!commandos) commandos = this.client.gcommands.get(this.client.galiases.get(cmd));
                if(!commandos) return;
                if(commandos.slash == true || commandos.slash == "true") return;


                let member = message.member, guild = message.guild, channel = message.channel
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

                        if(ifDjsV13) options.client = this.client, options.channel = message.channel
                        if(typeof options == "object" && options.content) {
                            msg = await ifDjsV13 ? GMessage.buttons(options) : message.buttons(options)
                        } else if(typeof options == "object" && !options.content) {
                            if(ifDjsV13) options.client = this.client, options.channel = message.channel
                            if(options.inlineReply) msg = await ifDjsV13 ? GMessage.inlineReply(options) : message.reply(options)
                            else msg = await message.channel.send(options)
                        } else {
                            if(options.inlineReply) msg = await ifDjsV13 ? GMessage.inlineReply({content:options}) : message.reply({content:options});
                            else msg = await message.channel.send(options)
                        }

                        msg = await msg;
                        msg = msg.toJSON()
                        msg.client = this.client;
                        msg.createButtonCollector = function createButtonCollector(filter, options) {return client.dispatcher.createButtonCollector(msg, filter, options)}
                        msg.awaitButtons = function awaitButtons(filter, options) {return client.dispatcher.awaitButtons(msg, filter, options)}
                        msg.createSelectMenuCollector = function createSelectMenuCollector(filter, options) {return client.dispatcher.createSelectMenuCollector(msg, filter, options)};
                        msg.awaitSelectMenus = function awaitSelectMenus(filter, options) {return client.dispatcher.awaitSelectMenus(msg, filter, options)};

                        if(this.client.autoTyping) channel.stopTyping(true);
                        return msg;
                    },
                    edit: async(options = undefined) => {
                        if(ifDjsV13) options.client = this.client, options.channel = message.channel
                        if(typeof options == "object" && options.content) {
                            msg = await ifDjsV13 ? GMessage.buttonsEdit(msg.id, options.content, options) : message.buttonsEdit(msg.id, options.content, options)
                        } else {
                            msg = ifDjsV13 ? GMessage.buttonsEdit(msg.id, options, []) : message.buttonsEdit(msg.id, options, [])
                        }
                        
                        msg = await msg;
                        msg = msg.toJSON()
                        msg.client = this.client;
                        msg.createButtonCollector = function createButtonCollector(filter, options) {return client.dispatcher.createButtonCollector(msg, filter, options)}
                        msg.awaitButtons = function awaitButtons(filter, options) {return client.dispatcher.awaitButtons(msg, filter, options)}
                        msg.createSelectMenuCollector = function createSelectMenuCollector(filter, options) {return client.dispatcher.createSelectMenuCollector(msg, filter, options)};
                        msg.awaitSelectMenus = function awaitSelectMenus(filter, options) {return client.dispatcher.awaitSelectMenus(msg, filter, options)};

                        return msg;
                    }
                }, args, args)
                if(inhibitReturn == false) return;

                let guildLanguage = await this.client.dispatcher.getGuildLanguage(message.guild.id);
                let cooldown = await this.client.dispatcher.getCooldown(message.guild.id, message.author.id, commandos)
                if(cooldown.cooldown) return message.inlineReply(this.client.languageFile.COOLDOWN[guildLanguage].replace(/{COOLDOWN}/g, cooldown.wait).replace(/{CMDNAME}/g, commandos.name))

                if(commandos.nsfw) {
                    if(!message.channel.nsfw) {
                        return message.inlineReply(this.client.languageFile.NSFW[guildLanguage])
                    }
                }

                if(commandos.guildOnly) {
                    if(message.guild.id != commandos.guildOnly) {
                        return;
                    }
                } 

                if(commandos.userOnly) {
                    if(typeof commandos.userOnly == "object") {
                        let users = commandos.userOnly.some(v => message.author.id == v)
                        if(!users) {
                            return
                        }
                    } else {
                        if(message.author.id != commandos.userOnly) {
                            return;
                        }
                    }
                }

                if(commandos.channelOnly) {
                    if(typeof commandos.channelOnly == "object") {
                        let channels = commandos.channelOnly.some(v => message.channel.id == v)
                        if(!channels) {
                            return
                        }
                    } else {
                        if(message.channel.id != commandos.channelOnly) {
                            return;
                        }
                    }
                }

                if(commandos.clientRequiredPermissions) {
                    if(!Array.isArray(commandos.clientRequiredPermissions)) commandos.clientRequiredPermissions = [commandos.clientRequiredPermissions]
                    if(message.channel.permissionsFor(message.guild.me).missing(commandos.clientRequiredPermissions).length > 0) {
                        message.channel.send(this.client.languageFile.MISSING_CLIENT_PERMISSIONS[guildLanguage].replace("{PERMISSION}",commandos.clientRequiredPermissions.map(v => v.split(" ").map(vv => vv[0].toUpperCase() + vv.slice(1).toLowerCase()).join(" ")).join(", ")))
                        return;
                    }
                }

                if(commandos.userRequiredPermissions) {
                    if(!Array.isArray(commandos.userRequiredPermissions)) commandos.userRequiredPermissions = [commandos.userRequiredPermissions]
                    if(this.client.discordjsversion.includes("12.")) {
                        if(!message.member.hasPermission(commandos.userRequiredPermissions)) {
                            message.channel.send(this.client.languageFile.MISSING_PERMISSIONS[guildLanguage].replace("{PERMISSION}",commandos.userRequiredPermissions.map(v => v.split(" ").map(vv => vv[0].toUpperCase() + vv.slice(1).toLowerCase()).join(" ")).join(", ")))
                            return;
                        }
                    } else {
                        if(!message.member.permissions.has(commandos.userRequiredPermissions)) {
                            message.channel.send(this.client.languageFile.MISSING_PERMISSIONS[guildLanguage].replace("{PERMISSION}",commandos.userRequiredPermissions.map(v => v.split(" ").map(vv => vv[0].toUpperCase() + vv.slice(1).toLowerCase()).join(" ")).join(", ")))
                            return;
                        }
                    } 
                }

                if(commandos.userRequiredRoles) {
                    if(!Array.isArray(commandos.userRequiredRoles)) commandos.userRequiredRoles = [commandos.userRequiredRoles]

                    let roles = commandos.userRequiredRoles.some(v => message.member._roles.includes(v))
                    if(!roles) {
                        message.channel.send(this.client.languageFile.MISSING_ROLES[guildLanguage].replace("{ROLES}", `\`${commandos.userRequiredRoles.map(r => message.guild.roles.cache.get(r).name).join(", ")}\``))
                        return;
                    }
                }

                if(commandos.userRequiredRole) {
                    if(!Array.isArray(commandos.userRequiredRole)) commandos.userRequiredRole = [commandos.userRequiredRole]

                    let roles = commandos.userRequiredRole.some(v => message.member._roles.includes(v))
                    if(!roles) {
                        message.channel.send(this.client.languageFile.MISSING_ROLES[guildLanguage].replace("{ROLES}", `\`${commandos.userRequiredRoles.map(r => message.guild.roles.cache.get(r).name).join(", ")}\``))
                        return;
                    }
                }

                this.GCommandsClient.emit(Events.DEBUG, new Color("&d[GCommands Debug] &3User &a" + message.author.id + "&3 used &a" + cmd).getText())

                const client = this.client, bot = this.client
                var msg = "";
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

                        if(ifDjsV13) options.client = this.client, options.channel = message.channel
                        if(typeof options == "object" && options.content) {
                            msg = await ifDjsV13 ? GMessage.buttons(options) : message.buttons(options)
                        } else if(typeof options == "object" && !options.content) {
                            if(ifDjsV13) options.client = this.client, options.channel = message.channel
                            if(options.inlineReply) msg = await ifDjsV13 ? GMessage.inlineReply(options) : message.reply(options)
                            else msg = await message.channel.send(options)
                        } else {
                            if(options.inlineReply) msg = await ifDjsV13 ? GMessage.inlineReply({content:options}) : message.reply({content:options});
                            else msg = await message.channel.send(options)
                        }

                        msg = await msg;
                        msg = msg.toJSON()
                        msg.client = this.client;
                        msg.createButtonCollector = function createButtonCollector(filter, options) {return client.dispatcher.createButtonCollector(msg, filter, options)}
                        msg.awaitButtons = function awaitButtons(filter, options) {return client.dispatcher.awaitButtons(msg, filter, options)}
                        msg.createSelectMenuCollector = function createSelectMenuCollector(filter, options) {return client.dispatcher.createSelectMenuCollector(msg, filter, options)};
                        msg.awaitSelectMenus = function awaitSelectMenus(filter, options) {return client.dispatcher.awaitSelectMenus(msg, filter, options)};

                        if(this.client.autoTyping) channel.stopTyping(true);
                        return msg;
                    },
                    edit: async(options = undefined) => {
                        if(ifDjsV13) options.client = this.client, options.channel = message.channel
                        if(typeof options == "object" && options.content) {
                            msg = await ifDjsV13 ? GMessage.buttonsEdit(msg.id, options.content, options) : message.buttonsEdit(msg.id, options.content, options)
                        } else {
                            msg = ifDjsV13 ? GMessage.buttonsEdit(msg.id, options, []) : message.buttonsEdit(msg.id, options, [])
                        }

                        msg = await msg;
                        msg = msg.toJSON()
                        msg.client = this.client;
                        msg.createButtonCollector = function createButtonCollector(filter, options) {return client.dispatcher.createButtonCollector(msg, filter, options)}
                        msg.awaitButtons = function awaitButtons(filter, options) {return client.dispatcher.awaitButtons(msg, filter, options)}
                        msg.createSelectMenuCollector = function createSelectMenuCollector(filter, options) {return client.dispatcher.createSelectMenuCollector(msg, filter, options)};
                        msg.awaitSelectMenus = function awaitSelectMenus(filter, options) {return client.dispatcher.awaitSelectMenus(msg, filter, options)};

                        return msg;
                    }
                }, args, args)
            } catch(e) {
                this.GCommandsClient.emit(Events.DEBUG, new Color("&d[GCommands Debug] &3" + e).getText())

                if(!this.GCommandsClient.unkownCommandMessage) return;
                if(this.client.languageFile.UNKNOWN_COMMAND[this.client.language]) {
                    message.channel.send(this.client.languageFile.UNKNOWN_COMMAND[guildLanguage].replace("{COMMAND}",cmd));
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
        if((this.client.slash) || (this.client.slash == "both")) {
            this.client.ws.on('INTERACTION_CREATE', async (interaction) => {
                if(interaction.type != 2) return;
                
                try {
                    let commandos = this.client.gcommands.get(interaction.data.name);
                    if(!commandos) return;
                    if(commandos.slash == false || commandos.slash == "false") return;
                    if (!this.client.cooldowns.has(commandos.name)) {
                        this.client.cooldowns.set(commandos.name, new Collection());
                    }

                    let guild = await this.client.guilds.cache.get(interaction.guild_id)
                    let member = guild.members.cache.get(interaction.member.user.id);

                    let inhibitReturn = await inhibit(this.client, interactionRefactor(this.client, commandos), {
                        interaction, member,
                        guild: guild, 
                        channel: guild.channels.cache.get(interaction.channel_id),
                        respond: async(result) => {
                            return this.slashRespond(guild.channels.cache.get(interaction.channel_id), interaction, result);
                        },
                        edit: async(result) => {
                            return this.slashEdit(interaction, result);
                        }
                    }, await this.getSlashArgs(interaction.data.options || []), await this.getSlashArgsObject(interaction.data.options || []))
                    if(inhibitReturn == false) return;

                    let guildLanguage = await this.client.dispatcher.getGuildLanguage(member.guild.id);
                    let cooldown = await this.client.dispatcher.getCooldown(member.guild.id, member.user.id, commandos)
                    if(cooldown.cooldown) {
                        return this.client.api.interactions(interaction.id, interaction.token).callback.post({
                            data: {
                                type: 4,
                                data: {
                                    flags: 64,
                                    content: this.client.languageFile.COOLDOWN[guildLanguage].replace(/{COOLDOWN}/g, cooldown.wait).replace(/{CMDNAME}/g, commandos.name)
                                }
                            }
                        });
                    }

                    if(commandos.nsfw) {
                        if(!member.guild.channels.cache.get(interaction.channel_id).nsfw) {
                            return this.client.api.interactions(interaction.id, interaction.token).callback.post({
                                data: {
                                    type: 4,
                                    data: {
                                        flags: 64,
                                        content:  this.client.languageFile.NSFW[guildLanguage]
                                    }
                                }
                            });
                        }
                    }

                    if(commandos.userOnly) {
                        if(typeof commandos.userOnly == "object") {
                            let users = commandos.userOnly.some(v => interaction.member.user.id == v)
                            if(!users) {
                                return;
                            }
                        } else {
                            if(interaction.member.user.id != commandos.userOnly) {
                                return;
                            }
                        }
                    }

                    if(commandos.channelOnly) {
                        if(typeof commandos.channelOnly == "object") {
                            let users = commandos.channelOnly.some(v => interaction.channel_id == v)
                            if(!users) {
                                return;
                            }
                        } else {
                            if(interaction.channel_id != commandos.channelOnly) {
                                return;
                            }
                        }
                    }

                    if(commandos.clientRequiredPermissions) {
                        if(!Array.isArray(commandos.clientRequiredPermissions)) commandos.clientRequiredPermissions = [commandos.clientRequiredPermissions]
                        if(member.guild.channels.cache.get(interaction.channel_id).permissionsFor(member.guild.me).missing(commandos.clientRequiredPermissions).length > 0) {
                            this.client.api.interactions(interaction.id, interaction.token).callback.post({
                                data: {
                                    type: 4,
                                    data: {
                                        flags: 64,
                                        content: this.client.languageFile.MISSING_CLIENT_PERMISSIONS[guildLanguage].replace("{PERMISSION}",commandos.clientRequiredPermissions.map(v => v.split(" ").map(vv => vv[0].toUpperCase() + vv.slice(1).toLowerCase()).join(" ")).join(", "))
                                    }
                                }
                            });
                            return;
                        }
                    }

                    if(commandos.userRequiredPermissions) {
                        if(!Array.isArray(commandos.userRequiredPermissions)) commandos.userRequiredPermissions = [commandos.userRequiredPermissions]
                        if(this.client.discordjsversion.includes("12.")) {
                            if(!this.client.guilds.cache.get(interaction.guild_id).members.cache.get(interaction.member.user.id).hasPermission(commandos.userRequiredPermissions)) {
                                this.client.api.interactions(interaction.id, interaction.token).callback.post({
                                    data: {
                                        type: 4,
                                        data: {
                                            flags: 64,
                                            content:  this.client.languageFile.MISSING_PERMISSIONS[guildLanguage].replace("{PERMISSION}",commandos.userRequiredPermissions.map(v => v.split(" ").map(vv => vv[0].toUpperCase() + vv.slice(1).toLowerCase()).join(" ")).join(", "))
                                        }
                                    }
                                });
                                return;
                            }
                        } else {
                            if(!this.client.guilds.cache.get(interaction.guild_id).members.cache.get(interaction.member.user.id).permissions.has(commandos.userRequiredPermissions)) {
                                this.client.api.interactions(interaction.id, interaction.token).callback.post({
                                    data: {
                                        type: 4,
                                        data: {
                                            flags: 64,
                                            content: this.client.languageFile.MISSING_PERMISSIONS[guildLanguage].replace("{PERMISSION}",commandos.userRequiredPermissions.map(v => v.split(" ").map(vv => vv[0].toUpperCase() + vv.slice(1).toLowerCase()).join(" ")).join(", "))
                                        }
                                    }
                                });
                                return;
                            } 
                        }
                    }

                    if(commandos.userRequiredRoles) {
                        if(!Array.isArray(commandos.userRequiredRoles)) commandos.userRequiredRoles = [commandos.userRequiredRoles]
    
                        let roles = commandos.userRequiredRoles.some(v => interaction.member.roles.includes(v))
                        if(!roles) {
                            this.client.api.interactions(interaction.id, interaction.token).callback.post({
                                data: {
                                    type: 4,
                                    data: {
                                        flags: 64,
                                        content: this.client.languageFile.MISSING_ROLES[guildLanguage].replace("{ROLES}", `\`${commandos.userRequiredRoles.map(r => member.guild.roles.cache.get(r).name).join(", ")}\``),
                                    }
                                }
                            }); 
                            return;
                        }
                    }
    
                    if(commandos.userRequiredRole) {
                        if(!Array.isArray(commandos.userRequiredRole)) commandos.userRequiredRole = [commandos.userRequiredRole]
    
                        let roles = commandos.userRequiredRole.some(v => interaction.member.roles.includes(v))
                        if(!roles) {
                            this.client.api.interactions(interaction.id, interaction.token).callback.post({
                                data: {
                                    type: 4,
                                    data: {
                                        flags: 64,
                                        content: this.client.languageFile.MISSING_ROLES[guildLanguage].replace("{ROLES}", `\`${commandos.userRequiredRoles.map(r => member.guild.roles.cache.get(r).name).join(", ")}\``),
                                    }
                                }
                            }); 
                            return;
                        }
                    }

                    try {

                        /**
                         * Return system for slash
                         * @name ReturnSystem
                         * @param {DiscordClient} client
                         * @param {Object} interaction
                         * @example 
                         *  return {
                         *      content: "hi",
                         *      ephemeral: true,
                         *      allowedMentions: { parse: [], repliedUser: true }
                         *  }
                         */

                        const client = this.client, bot = this.client, channel = member.guild.channels.cache.get(interaction.channel_id)
                        commandos.run({
                            client, bot, interaction, member, channel,
                            guild: member.guild,                             
                            /**
                             * Respond
                             * @type {Interface}
                             * @param {RespondOptions} result 
                             * @returns {Object}
                            */
                            respond: async(result) => {
                                return this.slashRespond(channel, interaction, result);
                            },
                            edit: async(result) => {
                                return this.slashEdit(interaction, result);
                            }
                        }, await this.getSlashArgs(interaction.data.options || []), await this.getSlashArgsObject(interaction.data.options || []))
                    } catch(e) {
                        this.GCommandsClient.emit(Events.DEBUG, new Color("&d[GCommands Debug] &3" + e).getText())
                    }
                    
                    this.GCommandsClient.emit(Events.DEBUG, new Color("&d[GCommands Debug] &3User &a" + interaction.member.user.id + "&3 used &a" + interaction.data.name).getText())
                }catch(e) {
                    this.GCommandsClient.emit(Events.DEBUG, new Color("&d[GCommands Debug] &3" + e).getText())

                    if(!this.unkownCommandMessage) return;
                    if(this.client.languageFile.UNKNOWN_COMMAND[guildLanguage]) {
                        this.client.api.interactions(interaction.id, interaction.token).callback.post({
                            data: {
                                type: 4,
                                data: {
                                    content: this.client.languageFile.UNKNOWN_COMMAND[guildLanguage].replace("{COMMAND}",interaction.data.name)
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

    async slashRespond(channel, interaction, result) {
        if(!result.ephemeral && this.client.autoTyping) channel.startTyping(this.client.autoTyping);

        var data = {}

        if(typeof result != "object") data.content = result;
        if(typeof result == "object" && !result.content) data.embeds = [result];
        if(typeof result == "object" && typeof result.content != "object") data.content = result.content;
        if(typeof result == "object" && typeof result.content == "object") data.embeds = [result.content];
        if(typeof result == "object" && result.allowedMentions) { data.allowedMentions = result.allowedMentions } else data.allowedMentions = { parse: [], repliedUser: true }
        if(typeof result == "object" && result.ephemeral) { data.flags = 64 }
        if(typeof result == "object" && result.components) {
            if(!Array.isArray(result.components)) result.components = [result.components];
            data.components = result.components;
        }
        if(typeof result == "object" && result.embeds) {
            if(!Array.isArray(result.embeds)) result.embeds = [result.embeds]
            data.embeds = result.embeds;
        }
        if(result.embeds && !result.content) result.content = "\u200B"

        let finalFiles = [];
        if(typeof result == "object" && (result.attachments || result.files)) {
            let attachments = result.attachments || result.files

            if(!Array.isArray(attachments)) attachments = [attachments]
            attachments.forEach(file => {
                finalFiles.push({
                    attachment: file.attachment,
                    name: file.name,
                    file: file.attachment
                })
            })
        }

        let apiMessage = (await this.client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: result.thinking ? 5 : 4,
                data
            },
            files: finalFiles
        }))

        let apiMessageMsg = {};
        try {
            apiMessageMsg = (await axios.get(`https://discord.com/api/v8/webhooks/${this.client.user.id}/${interaction.token}/messages/@original`)).data;
        } catch(e) {
            apiMessage = {
                id: undefined
            }
        }

        if(typeof apiMessage != "object") apiMessage = apiMessage.toJSON();
        if(apiMessage) {
            apiMessage = apiMessageMsg;
            apiMessage.client = this.client ? this.client : client;
            apiMessage.createButtonCollector = function createButtonCollector(filter, options) {return this.client.dispatcher.createButtonCollector(apiMessage, filter, options)};
            apiMessage.awaitButtons = function awaitButtons(filter, options) {return this.client.dispatcher.awaitButtons(apiMessage, filter, options)};
            apiMessage.createSelectMenuCollector = function createSelectMenuCollector(filter, options) {return this.client.dispatcher.createSelectMenuCollector(apiMessage, filter, options)};
            apiMessage.awaitSelectMenus = function awaitSelectMenus(filter, options) {return this.client.dispatcher.awaitSelectMenus(apiMessage, filter, options)};
            apiMessage.delete = function deleteMsg() {return this.client.api.webhooks(this.client.user.id, interaction.token).messages[apiMessageMsg.id].delete()};
        }

        if(!result.ephemeral && this.client.autoTyping) channel.stopTyping(true)

        if(ifDjsV13) return apiMessage.id ? new Message(this.client, apiMessage, channel) : apiMessage;
        else return apiMessage.id ? new GMessage(this.client, apiMessage, channel) : apiMessage;
    }

    async slashEdit(interaction, result) {
        if (typeof result == "object") {
            var data = {}
        
            if(typeof result != "object") data.content = result;
            if(typeof result == "object" && !result.content) data.embeds = [result];
            if(typeof result == "object" && typeof result.content != "object") data.content = result.content;
            if(typeof result == "object" && typeof result.content == "object") data.embeds = [result.content];
            if(typeof result == "object" && result.components) {
                if(!Array.isArray(result.components)) result.components = [result.components];
                data.components = result.components;
            }
            if(typeof result == "object" && result.embeds) {
                if(!Array.isArray(result.embeds)) result.embeds = [result.embeds]
                data.embeds = result.embeds;
            }
            if(result.embeds && !result.content) result.content = "\u200B"
            
            let apiMessage = (await this.client.api.webhooks(this.client.user.id, interaction.token).messages[result.messageId ? result.messageId : "@original"].patch({
                data,
                files: finalFiles   
            }))

            if(apiMessage) {
                apiMessage.client = this.client;
                apiMessage.createButtonCollector = function createButtonCollector(filter, options) {return this.client.dispatcher.createButtonCollector(apiMessage, filter, options)};
                apiMessage.awaitButtons = function awaitButtons(filter, options) {return this.client.dispatcher.awaitButtons(apiMessage, filter, options)};
                apiMessage.createSelectMenuCollector = function createSelectMenuCollector(filter, options) {return this.client.dispatcher.createSelectMenuCollector(apiMessage, filter, options)};
                apiMessage.awaitSelectMenus = function awaitSelectMenus(filter, options) {return this.client.dispatcher.awaitSelectMenus(apiMessage, filter, options)};
                apiMessage.delete = function deleteMsg() {return this.client.api.webhooks(this.client.user.id, interaction.token).messages[apiMessage.id].delete()};
            }

            if(ifDjsV13) return apiMessage.id ? new Message(this.client, apiMessage, channel) : apiMessage;
            else return apiMessage.id ? new GMessage(this.client, apiMessage, channel) : apiMessage;
        }

        return this.client.api.webhooks(this.client.user.id, interaction.token).messages["@original"].patch({ data: { content: result }})
    }

    /**
     * Internal method to getSlashArgs
     * @returns {object}
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

    getSlashArgsObject(options) {
        var args = {};
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

module.exports = GEventLoader;