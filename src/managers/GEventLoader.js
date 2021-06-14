const { default: axios } = require("axios");
const {Collection,MessageEmbed,APIMessage} = require("discord.js");
const Color = require("../structures/Color"), { Events } = require("../util/Constants"), { createAPIMessage } = require("../util/util");
const ms = require("ms")

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

        this.client.cooldowns = new Collection();

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
        if(this.client == undefined) return;
        if((this.client.slash == false) || (this.client.slash == "both")) {
            this.client.on('message', async(message) => {
                messageEventUse(message)
            })

            this.client.on('messageUpdate', async(oldMessage, newMessage) => {
                messageEventUse(newMessage)
            })
        }

        let messageEventUse = async(message) => {
            if(!message) return;
            if (!message.author || message.author.bot) return;
            if (!message.guild) return;
            
            let mentionRegex = new RegExp(`^<@!?(${this.client.user.id})> `)
            let prefix = message.content.match(mentionRegex) ? message.content.match(mentionRegex)[0] : this.client.prefix

            if(this.client.database.working) {
                let guildSettings = await this.client.dispatcher.getGuildPrefix(message.guild.id) || this.client.prefix;
                prefix = message.content.match(mentionRegex) ? message.content.match(mentionRegex)[0] : guildSettings
            }

            if (!message.content.startsWith(prefix)) return;
        
            const args = message.content.slice(prefix.length).trim().split(/ +/g);
            const cmd = args.shift().toLowerCase();
            
            if (cmd.length === 0) return;
    
            try {
                let commandos = this.client.commands.get(cmd);
                if(!commandos) commandos = this.client.commands.get(this.client.aliases.get(cmd));
                if(!commandos) return;
                if(commandos.slash == true || commandos.slash == "true") return;

                let member = message.member, guild = message.guild, channel = message.channel
                let inhibit = await this.inhibit(commandos, {
                    message, member, guild, channel,
                    respond: async(options = undefined) => {
                        let inlineReply = true;
                        if(options.inlineReply == false) inlineReply = false;

                        if(typeof options == "object" && options.content) {
                            if(inlineReply) msg = await message.buttonsWithReply(options.content, options)
                            else  msg = await message.buttons(options.content, options)
                        } else if(typeof options == "object" && !options.content) {
                            if(inlineReply) msg = await message.inlineReply(options)
                            else msg = await message.channel.send(options)
                        } else {
                            if(inlineReply) msg = await message.inlineReply({content:options});
                            else msg = await message.channel.send(options)
                        }

                        msg = msg.toJSON()
                        msg.client = this.client;
                        msg.createButtonCollector = function createButtonCollector(filter, options) {return client.dispatcher.createButtonCollector(msg, filter, options)}
                        msg.awaitButtons = function awaitButtons(filter, options) {return client.dispatcher.awaitButtons(msg, filter, options)}
                        return msg;
                    },
                    edit: async(options = undefined) => {
                        if(typeof options == "object" && options.content) {
                            msg = await message.buttonsEdit(msg.id, options.content, options)
                            return msg;
                        } else if(typeof options == "object" && !options.content) {
                            msg = await message.buttonsEdit(msg.id, options, [])
                            return msg;
                        } else {
                            msg = await message.buttonsEdit(msg.id, options, [])
                            return msg;
                        }
                    }
                })
                if(inhibit == false) return;

                if (!this.client.cooldowns.has(commandos.name)) {
                    this.client.cooldowns.set(commandos.name, new Collection());
                }
                
                const now = Date.now();
                const timestamps = this.client.cooldowns.get(commandos.name);
                const cooldownAmount = ms(commandos.cooldown ? commandos.cooldown : this.client.cooldownDefault);
                
                if (timestamps.has(message.author.id)) {
                    if (timestamps.has(message.author.id)) {
                        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
                    
                        if (now < expirationTime) {
                            const timeLeft = ms(expirationTime - now);

                            return message.inlineReply(this.client.languageFile.COOLDOWN[this.client.language].replace(/{COOLDOWN}/g, timeLeft).replace(/{CMDNAME}/g, commandos.name))
                        }
                    }
                }

                timestamps.set(message.author.id, now);
                setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

                if(commandos.nsfw) {
                    if(!message.channel.nsfw) {
                        return message.inlineReply(this.client.languageFile.NSFW[this.client.language])
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
                        message.channel.send(this.client.languageFile.MISSING_CLIENT_PERMISSIONS[this.client.language].replace("{PERMISSION}",commandos.clientRequiredPermissions.map(v => v.split(" ").map(vv => vv[0].toUpperCase() + vv.slice(1).toLowerCase()).join(" ")).join(", ")))
                        return;
                    }
                }

                if(commandos.userRequiredPermissions) {
                    if(!Array.isArray(commandos.userRequiredPermissions)) commandos.userRequiredPermissions = [commandos.userRequiredPermissions]
                    if(this.client.discordjsversion.includes("12.")) {
                        if(!message.member.hasPermission(commandos.userRequiredPermissions)) {
                            message.channel.send(this.client.languageFile.MISSING_PERMISSIONS[this.client.language].replace("{PERMISSION}",commandos.userRequiredPermissions.map(v => v.split(" ").map(vv => vv[0].toUpperCase() + vv.slice(1).toLowerCase()).join(" ")).join(", ")))
                            return;
                        }
                    } else {
                        if(!message.member.permission.has(commandos.userRequiredPermissions)) {
                            message.channel.send(this.client.languageFile.MISSING_PERMISSIONS[this.client.language].replace("{PERMISSION}",commandos.userRequiredPermissions.map(v => v.split(" ").map(vv => vv[0].toUpperCase() + vv.slice(1).toLowerCase()).join(" ")).join(", ")))
                            return;
                        }
                    } 
                }

                if(commandos.userRequiredRoles) {
                    if(!Array.isArray(commandos.userRequiredRoles)) commandos.userRequiredRoles = [commandos.userRequiredRoles]

                    let roles = commandos.userRequiredRoles.some(v => message.member._roles.includes(v))
                    if(!roles) {
                        message.channel.send(this.client.languageFile.MISSING_ROLES[this.client.language].replace("{ROLES}", `\`${message.guild.roles.cache.get(commandos.userRequiredRole).name}\``))
                        return;
                    }
                }

                if(commandos.userRequiredRole) {
                    if(!Array.isArray(commandos.userRequiredRole)) commandos.userRequiredRole = [commandos.userRequiredRole]

                    let roles = commandos.userRequiredRole.some(v => message.member._roles.includes(v))
                    if(!roles) {
                        message.channel.send(this.client.languageFile.MISSING_ROLES[this.client.language].replace("{ROLES}", `\`${message.guild.roles.cache.get(commandos.userRequiredRole).name}\``))
                        return;
                    }
                }

                this.GCommandsClient.emit(Events.DEBUG, new Color("&d[GCommands Debug] &3User &a" + message.author.id + "&3 used &a" + cmd).getText())

                const client = this.client, bot = this.client
                var msg = "";
                commandos.run({
                    client, bot, message, member, guild, channel,
                    respond: async(options = undefined) => {
                        let inlineReply = true;
                        if(options.inlineReply == false) inlineReply = false;

                        if(typeof options == "object" && options.content) {
                            if(inlineReply) msg = await message.buttonsWithReply(options.content, options)
                            else  msg = await message.buttons(options.content, options)
                        } else if(typeof options == "object" && !options.content) {
                            if(inlineReply) msg = await message.inlineReply(options)
                            else msg = await message.channel.send(options)
                        } else {
                            if(inlineReply) msg = await message.inlineReply({content:options});
                            else msg = await message.channel.send(options)
                        }

                        msg = msg.toJSON()
                        msg.client = this.client;
                        msg.createButtonCollector = function createButtonCollector(filter, options) {return client.dispatcher.createButtonCollector(msg, filter, options)}
                        msg.awaitButtons = function awaitButtons(filter, options) {return client.dispatcher.awaitButtons(msg, filter, options)}
                        return msg;
                    },
                    edit: async(options = undefined) => {
                        if(typeof options == "object" && options.content) {
                            msg = await message.buttonsEdit(msg.id, options.content, options)
                            return msg;
                        } else if(typeof options == "object" && !options.content) {
                            msg = await message.buttonsEdit(msg.id, options, [])
                            return msg;
                        } else {
                            msg = message.buttonsEdit(msg.id, options, [])
                            return msg;
                        }
                    }
                }, args, args)
            } catch(e) {
                this.GCommandsClient.emit(Events.DEBUG, new Color("&d[GCommands Debug] &3" + e).getText())
                if(!this.GCommandsClient.unkownCommandMessage) return;
                if(this.client.languageFile.UNKNOWN_COMMAND[this.client.language]) {
                    message.channel.send(this.client.languageFile.UNKNOWN_COMMAND[this.client.language].replace("{COMMAND}",cmd));
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
        if(this.client == undefined) return;
        if((this.client.slash) || (this.client.slash == "both")) {
            this.client.ws.on('INTERACTION_CREATE', async (interaction) => {
                if(this.client == undefined) return;
                try {
                    let commandos = this.client.commands.get(interaction.data.name);
                    if(commandos.slash == false || commandos.slash == "false") return;
                    if (!this.client.cooldowns.has(commandos.name)) {
                        this.client.cooldowns.set(commandos.name, new Collection());
                    }

                    let member = this.client.guilds.cache.get(interaction.guild_id).members.cache.get(interaction.member.user.id);
                    let inhibit = await this.inhibit(commandos, {
                        interaction, member,
                        guild: member.guild, 
                        channel: member.guild.channels.cache.get(interaction.channel_id),
                        respond: async(result) => {
                            var data = {
                                content: result
                            }

                            if (typeof result === 'object') {
                                if(typeof result == "object" && !result.content) {
                                    const embed = new MessageEmbed(result)
                                    data = await createAPIMessage(this.client, interaction, embed)
                                }
                                else if(typeof result.content == "object" ) {
                                    const embed = new MessageEmbed(result.content)
                                    data = await createAPIMessage(this.client, interaction, embed)
                                } else data = { content: result.content }
                            }

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

                            let finalFiles = [];
                            if(typeof result == "object" && result.attachments) {
                                if(!Array.isArray(result.attachments)) result.attachments = [result.attachments]
                                result.attachments.forEach(file => {
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
                            })).toJSON();

                            let apiMessageMsg = undefined;
                            try {
                                apiMessageMsg = (await axios.get(`https://discord.com/api/v8/webhooks/${client.user.id}/${interaction.token}/messages/@original`)).data;
                            } catch(e) {
                                apiMessage = {
                                    id: undefined
                                }
                            }

                            apiMessage = apiMessageMsg;
                            apiMessage.client = this.client;
                            apiMessage.createButtonCollector = function createButtonCollector(filter, options) {return this.client.dispatcher.createButtonCollector(apiMessage, filter, options)};
                            apiMessage.awaitButtons = function awaitButtons(filter, options) {return this.client.dispatcher.awaitButtons(apiMessage, filter, options)};
                            apiMessage.delete = function deleteMsg() {return this.client.api.webhooks(this.client.user.id, interaction.token).messages[apiMessageMsg.id].delete()};

                            return apiMessage
                        },
                        edit: async(result) => {
                            if (typeof result == "object") {
                                result.embeds = [];
                                if(!Array.isArray(result.embeds)) result.embeds = [result.embeds]

                                if(result.components) {
                                    if(!Array.isArray(result.components)) result.components = [result.components];

                                    result.components = result.components;
                                } else result.components = [];

                                if(typeof result.content == "object") {
                                    result.embeds = [result.content]
                                    result.content = "\u200B"
                                }
                                if(typeof result == "object" && result.embeds) {
                                    if(!Array.isArray(result.embeds)) result.embeds = [result.embeds];
                                    result.embeds = result.embeds;
                                } else result.embeds = [];

                                let finalFiles = [];
                                if(typeof result == "object" && result.attachments) {
                                    if(!Array.isArray(result.attachments)) result.attachments = [result.attachments]
                                    result.attachments.forEach(file => {
                                        finalFiles.push({
                                            attachment: file.attachment,
                                            name: file.name,
                                            file: file.attachment
                                        })
                                    })
                                }

                                let apiMessage = (await this.client.api.webhooks(client.user.id, interaction.token).messages["@original"].patch({
                                    data: {
                                        content: result.content,
                                        components: result.components,
                                        embeds: result.embeds || []
                                    },
                                    files: finalFiles   
                                }))

                                apiMessage.client = this.client;
                                apiMessage.createButtonCollector = function createButtonCollector(filter, options) {return this.client.dispatcher.createButtonCollector(apiMessage, filter, options)};
                                apiMessage.awaitButtons = function awaitButtons(filter, options) {return this.client.dispatcher.awaitButtons(apiMessage, filter, options)};
                                apiMessage.delete = function deleteMsg() {return this.client.api.webhooks(this.client.user.id, interaction.token).messages[apiMessage.id].delete()};

                                return apiMessage;
                            }

                            return this.client.api.webhooks(client.user.id, interaction.token).messages["@original"].patch({ data: { content: result }})
                        }
                    })
                    if(inhibit == false) return;

                    let now = Date.now();
                    let timestamps = this.client.cooldowns.get(commandos.name);
                    let cooldownAmount = ms(commandos.cooldown ? commandos.cooldown : this.client.cooldownDefault);
                    
                    if (timestamps.has(interaction.member.user.id)) {
                        if (timestamps.has(interaction.member.user.id)) {
                            let expirationTime = timestamps.get(interaction.member.user.id) + cooldownAmount;
                        
                            if (now < expirationTime) {
                                let timeLeft = ms(expirationTime - now);
                                this.client.api.interactions(interaction.id, interaction.token).callback.post({
                                    data: {
                                        type: 4,
                                        data: {
                                            flags: 64,
                                            content: this.client.languageFile.COOLDOWN[this.client.language].replace(/{COOLDOWN}/g, timeLeft).replace(/{CMDNAME}/g, commandos.name)
                                        }
                                    }
                                });
                                return;
                            }
                        }
                    }

                    timestamps.set(interaction.member.user.id, now);
                    setTimeout(() => timestamps.delete(interaction.member.user.id), cooldownAmount);

                    if(commandos.nsfw) {
                        if(!member.guild.channels.cache.get(interaction.channel_id).nsfw) {
                            return this.client.api.interactions(interaction.id, interaction.token).callback.post({
                                data: {
                                    type: 4,
                                    data: {
                                        flags: 64,
                                        content:  this.client.languageFile.NSFW[this.client.language]
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
                                        content: this.client.languageFile.MISSING_CLIENT_PERMISSIONS[this.client.language].replace("{PERMISSION}",commandos.clientRequiredPermissions.map(v => v.split(" ").map(vv => vv[0].toUpperCase() + vv.slice(1).toLowerCase()).join(" ")).join(", "))
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
                                            content:  this.client.languageFile.MISSING_PERMISSIONS[this.client.language].replace("{PERMISSION}",commandos.userRequiredPermissions.map(v => v.split(" ").map(vv => vv[0].toUpperCase() + vv.slice(1).toLowerCase()).join(" ")).join(", "))
                                        }
                                    }
                                });
                                return;
                            }
                        } else {
                            if(!this.client.guilds.cache.get(interaction.guild_id).members.cache.get(interaction.member.user.id).permission.has(commandos.userRequiredPermissions)) {
                                this.client.api.interactions(interaction.id, interaction.token).callback.post({
                                    data: {
                                        type: 4,
                                        data: {
                                            flags: 64,
                                            content: this.client.languageFile.MISSING_PERMISSIONS[this.client.language].replace("{PERMISSION}",commandos.userRequiredPermissions.map(v => v.split(" ").map(vv => vv[0].toUpperCase() + vv.slice(1).toLowerCase()).join(" ")).join(", "))
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
                                        content: this.client.languageFile.MISSING_ROLES[this.client.language].replace("{ROLES}", `\`${member.guild.roles.cache.get(commandos.userRequiredRole).name}\``),
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
                                        content: this.client.languageFile.MISSING_ROLES[this.client.language].replace("{ROLES}", `\`${member.guild.roles.cache.get(commandos.userRequiredRole).name}\``),
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

                        const client = this.client, bot = this.client
                        commandos.run({
                            client, bot, interaction, member,
                            guild: member.guild, 
                            channel: member.guild.channels.cache.get(interaction.channel_id),
                            respond: async(result) => {
                                var data = {
                                    content: result
                                }

                                if (typeof result === 'object') {
                                    if(typeof result == "object" && !result.content) {
                                        const embed = new MessageEmbed(result)
                                        data = await createAPIMessage(this.client, interaction, embed)
                                    }
                                    else if(typeof result.content == "object" ) {
                                        const embed = new MessageEmbed(result.content)
                                        data = await createAPIMessage(this.client, interaction, embed)
                                    } else data = { content: result.content }
                                }

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

                                let finalFiles = [];
                                if(typeof result == "object" && result.attachments) {
                                    if(!Array.isArray(result.attachments)) result.attachments = [result.attachments]
                                    result.attachments.forEach(file => {
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
                                })).toJSON();

                                let apiMessageMsg = {};
                                try {
                                    apiMessageMsg = (await axios.get(`https://discord.com/api/v8/webhooks/${client.user.id}/${interaction.token}/messages/@original`)).data;
                                } catch(e) {
                                    apiMessage = {
                                        id: undefined
                                    }
                                }

                                if(apiMessage) {
                                    apiMessage = apiMessageMsg;
                                    apiMessage.client = this.client ? this.client : client;
                                    apiMessage.createButtonCollector = function createButtonCollector(filter, options) {return this.client.dispatcher.createButtonCollector(apiMessage, filter, options)};
                                    apiMessage.awaitButtons = function awaitButtons(filter, options) {return this.client.dispatcher.awaitButtons(apiMessage, filter, options)};
                                    apiMessage.delete = function deleteMsg() {return this.client.api.webhooks(this.client.user.id, interaction.token).messages[apiMessageMsg.id].delete()};
                                }

                                return apiMessage
                            },
                            edit: async(result) => {
                                if (typeof result == "object") {
                                    if(result.components) {
                                        if(!Array.isArray(result.components)) result.components = [result.components];

                                        result.components = result.components;
                                    } else result.components = [];

                                    if(typeof result.content == "object") {
                                        result.embeds = [result.content]
                                        result.content = "\u200B"
                                    }
                                    if(typeof result == "object" && result.embeds) {
                                        if(!Array.isArray(result.embeds)) result.embeds = [result.embeds];
                                        result.embeds = result.embeds;
                                    } else result.embeds = []
                                    let finalFiles = [];
                                    if(typeof result == "object" && result.attachments) {
                                        if(!Array.isArray(result.attachments)) result.attachments = [result.attachments]
                                        result.attachments.forEach(file => {
                                            finalFiles.push({
                                                attachment: file.attachment,
                                                name: file.name,
                                                file: file.attachment
                                            })
                                        })
                                    }
                                    
                                    let apiMessage = (await this.client.api.webhooks(client.user.id, interaction.token).messages[result.messageId ? result.messageId : "@original"].patch({
                                        data: {
                                            content: result.content,
                                            components: result.components,
                                            embeds: result.embeds || []
                                        },
                                        files: finalFiles   
                                    }))

                                    if(apiMessage) {
                                        apiMessage.client = this.client;
                                        apiMessage.createButtonCollector = function createButtonCollector(filter, options) {return this.client.dispatcher.createButtonCollector(apiMessage, filter, options)};
                                        apiMessage.awaitButtons = function awaitButtons(filter, options) {return this.client.dispatcher.awaitButtons(apiMessage, filter, options)};
                                        apiMessage.delete = function deleteMsg() {return this.client.api.webhooks(this.client.user.id, interaction.token).messages[apiMessage.id].delete()};
                                    }

                                    return apiMessage;
                                }

                                return this.client.api.webhooks(client.user.id, interaction.token).messages["@original"].patch({ data: { content: result }})
                            }
                        }, await this.getSlashArgs(interaction.data.options || []), await this.getSlashArgs2(interaction.data.options || []))
                    } catch(e) {
                        this.GCommandsClient.emit(Events.DEBUG, new Color("&d[GCommands Debug] &3" + e).getText())
                    }
                    
                    this.GCommandsClient.emit(Events.DEBUG, new Color("&d[GCommands Debug] &3User &a" + interaction.member.user.id + "&3 used &a" + interaction.data.name).getText())
                }catch(e) {
                    this.GCommandsClient.emit(Events.DEBUG, new Color("&d[GCommands Debug] &3" + e).getText())
                    if(!this.unkownCommandMessage) return;
                    if(this.client.languageFile.UNKNOWN_COMMAND[this.client.language]) {
                        this.client.api.interactions(interaction.id, interaction.token).callback.post({
                            data: {
                                type: 4,
                                data: {
                                    content: this.client.languageFile.UNKNOWN_COMMAND[this.client.language].replace("{COMMAND}",interaction.data.name)
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
        require("../base/actions/channel")(this.client)
        require("../base/actions/guild")(this.client)
        require("../base/actions/guildmember")(this.client)
        require("../base/actions/role")(this.client)
        require("../base/actions/user")(this.client)
        require("../base/actions/voiceupdate")(this.client)
        require("../base/actions/interactions")(this.client)
    }

    /**
     * Internal method to getSlashArgs
     * @returns {object}
    */
    async getSlashArgs(options) {
        var args = [];
  
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

    async getSlashArgs2(options) {
        var args = {};
        for (let o of options) {
          if (o.type == 1) args[o.name] = this.getSlashArgs2(o.options || []);
          else if (o.type == 2) args[o.name] = this.getSlashArgs2(o.options || []); 
          else {
              args[o.name] = o.value;
          }
        }
        return args;
    }

    /**
     * Internal method to inhivit
     * @returns {object}
    */
    async inhibit(cmd, data) {
		for(const inhibitor of this.client.inhibitors) {
			let inhibit = inhibitor(cmd, data);
			return inhibit;
		}
		return null;
    }
}

module.exports = GEventLoader;