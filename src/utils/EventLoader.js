const {Collection,MessageEmbed,APIMessage} = require("discord.js");
const Color = require("./color/Color");
const {Events} = require("./Constants")

/**
 * The GCommandsEventLoader class
*/
class GCommandsEventLoader {

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
        if((this.client.slash == false) || (this.client.slash == "both")) {
            this.client.on('message', async(message) => {
                if (message.author.bot) return;
                if (!message.guild) return;
                var mentionRegex = new RegExp(`^<@!?(${this.client.user.id})> `)
                var prefix = message.content.match(mentionRegex) ? message.content.match(mentionRegex)[0] : this.client.prefix

                if(this.client.database.working) {
                    var guildSettings = await this.client.dispatcher.getGuildPrefix(message.guild.id)
                    prefix = message.content.match(mentionRegex) ? message.content.match(mentionRegex)[0] : guildSettings
                }

                if (!message.content.startsWith(prefix)) return;
            
                const args = message.content.slice(prefix.length).trim().split(/ +/g);
                const cmd = args.shift().toLowerCase();
                
                if (cmd.length === 0) return;
        
                try {
                    var commandos = this.client.commands.get(cmd);
                    if(!commandos) commandos = this.client.commands.get(this.client.aliases.get(cmd));

                    var inhibit = await this.inhibit(commandos, undefined, message)
                    if(inhibit == false) return;

                    if (!this.client.cooldowns.has(commandos.name)) {
                        this.client.cooldowns.set(commandos.name, new Collection());
                    }
                    
                    const now = Date.now();
                    const timestamps = this.client.cooldowns.get(commandos.name);
                    const cooldownAmount = (commandos.cooldown ? commandos.cooldown : this.client.cooldownDefault) * 1000;
                    
                    if (timestamps.has(message.author.id)) {
                        if (timestamps.has(message.author.id)) {
                            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
                        
                            if (now < expirationTime) {
                                const timeLeft = (expirationTime - now) / 1000;

                                return message.channel.send(this.client.languageFile.COOLDOWN[this.client.language].replace(/{COOLDOWN}/g, timeLeft.toFixed(1)).replace(/{CMDNAME}/g, commandos.name))
                            }
                        }
                    }

                    timestamps.set(message.author.id, now);
                    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

                    if(commandos.guildOnly) {
                        if(message.guild.id != commandos.guildOnly) {
                            return;
                        }
                    } 

                    if(commandos.userOnly) {
                        if(typeof commandos.userOnly == "object") {
                            var users = commandos.userOnly.some(v => message.author.id == v)
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
                            var users = commandos.channelOnly.some(v => message.channel.id == v)
                            if(!users) {
                                return
                            }
                        } else {
                            if(message.channel.id != commandos.channelOnly) {
                                return;
                            }
                        }
                    }

                    if(commandos.userRequiredPermissions) {
                        if(typeof commandos.userRequiredPermissions == "object") {
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
                        } else {
                            if(this.client.discordjsversion.includes("12.")) {
                                if(!message.member.hasPermission(commandos.userRequiredPermissions)) {
                                    message.channel.send(this.client.languageFile.MISSING_PERMISSIONS[this.client.language].replace("{PERMISSION}",commandos.userRequiredPermissions))
                                    return;
                                }
                            } else {
                                if(!message.member.permission.has(commandos.userRequiredPermissions)) {
                                    message.channel.send(this.client.languageFile.MISSING_PERMISSIONS[this.client.language].replace("{PERMISSION}",commandos.userRequiredPermissions))
                                    return;
                                }
                            } 
                        }
                    }

                    if(commandos.clientRequiredPermissions) {
                        if(typeof commandos.clientRequiredPermissions == "object") {
                            if(this.client.discordjsversion.includes("12.")) {
                                if(!message.guild.me.hasPermission(commandos.clientRequiredPermissions)) {
                                    message.channel.send(this.client.languageFile.MISSING_CLIENT_PERMISSIONS[this.client.language].replace("{PERMISSION}",commandos.clientRequiredPermissions.map(v => v.split(" ").map(vv => vv[0].toUpperCase() + vv.slice(1).toLowerCase()).join(" ")).join(", ")))
                                    return;
                                }
                            } else {
                                if(!message.guild.me.has(commandos.clientRequiredPermissions)) {
                                    message.channel.send(this.client.languageFile.MISSING_CLIENT_PERMISSIONS[this.client.language].replace("{PERMISSION}",commandos.clientRequiredPermissions.map(v => v.split(" ").map(vv => vv[0].toUpperCase() + vv.slice(1).toLowerCase()).join(" ")).join(", ")))
                                    return;
                                }
                            } 
                        } else {
                            if(this.client.discordjsversion.includes("12.")) {
                                if(!message.guild.me.hasPermission(commandos.clientRequiredPermissions)) {
                                    message.channel.send(this.client.languageFile.MISSING_CLIENT_PERMISSIONS[this.client.language].replace("{PERMISSION}",commandos.clientRequiredPermissions))
                                    return;
                                }
                            } else {
                                if(!message.guild.me.has(commandos.clientRequiredPermissions)) {
                                    message.channel.send(this.client.languageFile.MISSING_CLIENT_PERMISSIONS[this.client.language].replace("{PERMISSION}",commandos.clientRequiredPermissions))
                                    return;
                                }
                            } 
                        }
                    }

                    if(commandos.userRequiredRole) {
                        if(!message.member._roles.includes(commandos.userRequiredRole)) {
                            message.channel.send(this.client.languageFile.MISSING_ROLES[this.client.language].replace("{ROLES}",commandos.userRequiredRole))
                            return;
                        }
                    }

                    const client = this.client, member = message.member, guild = message.guild, channel = message.channel
                    var msg = "";
                    commandos.run({
                        client, message, member, guild, channel,
                        respond: async(options = undefined) => {
                            if(typeof options == "object" && options.content) {
                                msg = await message.buttonsWithReply(options.content, options)
                            } else if(typeof options == "object" && !options.content) {
                                msg = await message.inlineReply(options)
                            } else msg = await message.inlineReply(options)
                        },
                        edit: async(options = undefined) => {
                            if(typeof options == "object" && options.content) {
                                message.buttonsEdit(msg.id, options.content, options)
                            } else if(typeof options == "object" && !options.content) {
                                msg.edit(options)
                            } else msg.edit(options)
                        }
                    }, args)

                    this.GCommandsClient.emit(Events.DEBUG, new Color("&d[GCommands Debug] &3User &a" + message.author.id + "&3 used &a" + cmd).getText())
                } catch(e) {
                    try {
                        commandos.run(this.client, undefined, message, args)
                    } catch(e) {
                        if(!this.GCommandsClient.unkownCommandMessage) return;
                        this.GCommandsClient.emit(Events.DEBUG, new Color("&d[GCommands Debug] &3" + e).getText())
                        if(this.client.languageFile.UNKNOWN_COMMAND[this.client.language]) {
                            message.channel.send(this.client.languageFile.UNKNOWN_COMMAND[this.client.language].replace("{COMMAND}",cmd));
                        }
                    }
                }
            })

            this.client.on('messageUpdate', async(oldMessage, message) => {
                if (message.author.bot) return;
                if (!message.guild) return;
                var mentionRegex = new RegExp(`^<@!?(${this.client.user.id})> `)
                var prefix = message.content.match(mentionRegex) ? message.content.match(mentionRegex)[0] : this.client.prefix

                if(this.client.database.working) {
                    var guildSettings = await this.client.dispatcher.getGuildPrefix(message.guild.id)
                    prefix = message.content.match(mentionRegex) ? message.content.match(mentionRegex)[0] : guildSettings
                }

                if (!message.content.startsWith(prefix)) return;
            
                const args = message.content.slice(prefix.length).trim().split(/ +/g);
                const cmd = args.shift().toLowerCase();
                
                if (cmd.length === 0) return;
        
                try {
                    var commandos = this.client.commands.get(cmd);
                    if(!commandos) commandos = this.client.commands.get(this.client.aliases.get(cmd));

                    var inhibit = await this.inhibit(commandos, undefined, message)
                    if(inhibit == false) return;

                    if (!this.client.cooldowns.has(commandos.name)) {
                        this.client.cooldowns.set(commandos.name, new Collection());
                    }
                    
                    const now = Date.now();
                    const timestamps = this.client.cooldowns.get(commandos.name);
                    const cooldownAmount = (commandos.cooldown ? commandos.cooldown : this.client.cooldownDefault) * 1000;
                    
                    if (timestamps.has(message.author.id)) {
                        if (timestamps.has(message.author.id)) {
                            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
                        
                            if (now < expirationTime) {
                                const timeLeft = (expirationTime - now) / 1000;

                                return message.channel.send(this.client.languageFile.COOLDOWN[this.client.language].replace(/{COOLDOWN}/g, timeLeft.toFixed(1)).replace(/{CMDNAME}/g, commandos.name))
                            }
                        }
                    }

                    timestamps.set(message.author.id, now);
                    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

                    if(commandos.guildOnly) {
                        if(message.guild.id != commandos.guildOnly) {
                            return;
                        }
                    } 

                    if(commandos.userOnly) {
                        if(typeof commandos.userOnly == "object") {
                            var users = commandos.userOnly.some(v => message.author.id == v)
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
                            var users = commandos.channelOnly.some(v => message.channel.id == v)
                            if(!users) {
                                return
                            }
                        } else {
                            if(message.channel.id != commandos.channelOnly) {
                                return;
                            }
                        }
                    }

                    if(commandos.userRequiredPermissions) {
                        if(typeof commandos.userRequiredPermissions == "object") {
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
                        } else {
                            if(this.client.discordjsversion.includes("12.")) {
                                if(!message.member.hasPermission(commandos.userRequiredPermissions)) {
                                    message.channel.send(this.client.languageFile.MISSING_PERMISSIONS[this.client.language].replace("{PERMISSION}",commandos.userRequiredPermissions))
                                    return;
                                }
                            } else {
                                if(!message.member.permission.has(commandos.userRequiredPermissions)) {
                                    message.channel.send(this.client.languageFile.MISSING_PERMISSIONS[this.client.language].replace("{PERMISSION}",commandos.userRequiredPermissions))
                                    return;
                                }
                            } 
                        }
                    }

                    if(commandos.clientRequiredPermissions) {
                        if(typeof commandos.clientRequiredPermissions == "object") {
                            if(this.client.discordjsversion.includes("12.")) {
                                if(!message.guild.me.hasPermission(commandos.clientRequiredPermissions)) {
                                    message.channel.send(this.client.languageFile.MISSING_CLIENT_PERMISSIONS[this.client.language].replace("{PERMISSION}",commandos.clientRequiredPermissions.map(v => v.split(" ").map(vv => vv[0].toUpperCase() + vv.slice(1).toLowerCase()).join(" ")).join(", ")))
                                    return;
                                }
                            } else {
                                if(!message.guild.me.has(commandos.clientRequiredPermissions)) {
                                    message.channel.send(this.client.languageFile.MISSING_CLIENT_PERMISSIONS[this.client.language].replace("{PERMISSION}",commandos.clientRequiredPermissions.map(v => v.split(" ").map(vv => vv[0].toUpperCase() + vv.slice(1).toLowerCase()).join(" ")).join(", ")))
                                    return;
                                }
                            } 
                        } else {
                            if(this.client.discordjsversion.includes("12.")) {
                                if(!message.guild.me.hasPermission(commandos.clientRequiredPermissions)) {
                                    message.channel.send(this.client.languageFile.MISSING_CLIENT_PERMISSIONS[this.client.language].replace("{PERMISSION}",commandos.clientRequiredPermissions))
                                    return;
                                }
                            } else {
                                if(!message.guild.me.has(commandos.clientRequiredPermissions)) {
                                    message.channel.send(this.client.languageFile.MISSING_CLIENT_PERMISSIONS[this.client.language].replace("{PERMISSION}",commandos.clientRequiredPermissions))
                                    return;
                                }
                            } 
                        }
                    }

                    if(commandos.requiredRole) {
                        if(!message.member._roles.includes(commandos.requiredRole)) {
                            message.channel.send(this.client.languageFile.MISSING_ROLES[this.client.language].replace("{ROLES}",commandos.requiredRole))
                            return;
                        }
                    }

                    const client = this.client, member = message.member, guild = message.guild, channel = message.channel
                    var msg = "";
                    commandos.run({
                        client, message, member, guild, channel,
                        respond: async(options = undefined) => {
                            if(typeof options == "object") {
                                msg = await message.buttonsWithReply(options.content, options)
                            } else msg = await message.inlineReply(options)
                        },
                        edit: async(options = undefined) => {
                            if(typeof options == "object") {
                                msg = await message.buttonsEdit(options.content, options)
                            } else msg.edit(options)
                        }
                    }, args)

                    this.GCommandsClient.emit(Events.DEBUG, new Color("&d[GCommands Debug] &3User &a" + message.author.id + "&3 used &a" + cmd).getText())
                } catch(e) {
                    try {
                        commandos.run(this.client, undefined, message, args)
                    } catch(e) {
                        if(!this.GCommandsClient.unkownCommandMessage) return;
                        this.GCommandsClient.emit(Events.DEBUG, new Color("&d[GCommands Debug] &3" + e).getText())
                        if(this.client.languageFile.UNKNOWN_COMMAND[this.client.language]) {
                            message.channel.send(this.client.languageFile.UNKNOWN_COMMAND[this.client.language].replace("{COMMAND}",cmd));
                        }
                    }
                }
            })
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
                try {
                    var commandos = this.client.commands.get(interaction.data.name);
                    if (!this.client.cooldowns.has(commandos.name)) {
                        this.client.cooldowns.set(commandos.name, new Collection());
                    }

                    var inhibit = await this.inhibit(commandos, interaction, undefined)
                    if(inhibit == false) return;

                    const now = Date.now();
                    const timestamps = this.client.cooldowns.get(commandos.name);
                    const cooldownAmount = (commandos.cooldown ? commandos.cooldown : this.client.cooldownDefault) * 1000;
                    
                    if (timestamps.has(interaction.member.user.id)) {
                        if (timestamps.has(interaction.member.user.id)) {
                            const expirationTime = timestamps.get(interaction.member.user.id) + cooldownAmount;
                        
                            if (now < expirationTime) {
                                const timeLeft = (expirationTime - now) / 1000;
                                this.client.api.interactions(interaction.id, interaction.token).callback.post({
                                    data: {
                                        type: 4,
                                        data: {
                                            flags: 64,
                                            content: this.client.languageFile.COOLDOWN[this.client.language].replace(/{COOLDOWN}/g, timeLeft.toFixed(1)).replace(/{CMDNAME}/g, commandos.name)
                                        }
                                    }
                                });
                                return;
                            }
                        }
                    }

                    timestamps.set(interaction.member.user.id, now);
                    setTimeout(() => timestamps.delete(interaction.member.user.id), cooldownAmount);

                    if(commandos.userOnly) {
                        if(typeof commandos.userOnly == "object") {
                            var users = commandos.userOnly.some(v => interaction.member.user.id == v)
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
                            var users = commandos.channelOnly.some(v => interaction.channel_id == v)
                            if(!users) {
                                return;
                            }
                        } else {
                            if(interaction.channel_id != commandos.channelOnly) {
                                return;
                            }
                        }
                    }

                    if(commandos.userRequiredPermissions) {
                        if(typeof commandos.userRequiredPermissions == "object") {
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
                        } else {
                            if(this.client.discordjsversion.includes("12.")) {
                                if(!this.client.guilds.cache.get(interaction.guild_id).members.cache.get(interaction.member.user.id).hasPermission(commandos.userRequiredPermissions)) {
                                    this.client.api.interactions(interaction.id, interaction.token).callback.post({
                                        data: {
                                            type: 4,
                                            data: {
                                                flags: 64,
                                                content:  this.client.languageFile.MISSING_PERMISSIONS[this.client.language].replace("{PERMISSION}",commandos.userRequiredPermissions)
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
                                                content: this.client.languageFile.MISSING_PERMISSIONS[this.client.language].replace("{PERMISSION}",commandos.userRequiredPermissions)
                                            }
                                        }
                                    });
                                    return;
                                } 
                            }
                        }
                    }

                    if(commandos.clientRequiredPermissions) {
                        if(typeof commandos.clientRequiredPermissions == "object") {
                            if(this.client.discordjsversion.includes("12.")) {
                                if(!this.client.guilds.cache.get(interaction.guild_id).me.hasPermission(commandos.clientRequiredPermissions)) {
                                    this.client.api.interactions(interaction.id, interaction.token).callback.post({
                                        data: {
                                            type: 4,
                                            data: {
                                                flags: 64,
                                                content:  this.client.languageFile.MISSING_CLIENT_PERMISSIONS[this.client.language].replace("{PERMISSION}",commandos.clientRequiredPermissions.map(v => v.split(" ").map(vv => vv[0].toUpperCase() + vv.slice(1).toLowerCase()).join(" ")).join(", "))
                                            }
                                        }
                                    });
                                    return;
                                }
                            } else {
                                if(!this.client.guilds.cache.get(interaction.guild_id).me.permission.has(commandos.clientRequiredPermissions)) {
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
                        } else {
                            if(this.client.discordjsversion.includes("12.")) {
                                if(!this.client.guilds.cache.get(interaction.guild_id).me.hasPermission(commandos.clientRequiredPermissions)) {
                                    this.client.api.interactions(interaction.id, interaction.token).callback.post({
                                        data: {
                                            type: 4,
                                            data: {
                                                flags: 64,
                                                content:  this.client.languageFile.MISSING_CLIENT_PERMISSIONS[this.client.language].replace("{PERMISSION}",commandos.clientRequiredPermissions)
                                            }
                                        }
                                    });
                                    return;
                                }
                            } else {
                                if(!this.client.guilds.cache.get(interaction.guild_id).me.permission.has(commandos.clientRequiredPermissions)) {
                                    this.client.api.interactions(interaction.id, interaction.token).callback.post({
                                        data: {
                                            type: 4,
                                            data: {
                                                flags: 64,
                                                content: this.client.languageFile.MISSING_CLIENT_PERMISSIONS[this.client.language].replace("{PERMISSION}",commandos.clientRequiredPermissions)
                                            }
                                        }
                                    });
                                    return;
                                } 
                            }
                        }
                    }

                    if(commandos.userRequiredRole) {
                        if(!interaction.member.roles.includes(commandos.userRequiredRole)) {
                            this.client.api.interactions(interaction.id, interaction.token).callback.post({
                                data: {
                                    type: 4,
                                    data: {
                                        flags: 64,
                                        content: this.client.languageFile.MISSING_ROLES[this.client.language].replace("{ROLES}",commandos.userRequiredRole)
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

                        const client = this.client, member = this.client.guilds.cache.get(interaction.guild_id).members.cache.get(interaction.member.user.id);
                        commandos.run({
                            client, interaction, member,
                            guild: member.guild, 
                            channel: member.guild.channels.cache.get(interaction.channel_id),
                            respond: async(result) => {
                                var data = {
                                    content: result
                                }

                                if (typeof result === 'object') {
                                    if(typeof result == "object" && !result.content) {
                                        const embed = new MessageEmbed(result)
                                        data = await this.createAPIMessage(interaction, embed)
                                    }
                                    else if(typeof result.content == "object" ) {
                                        const embed = new MessageEmbed(result.content)
                                        data = await this.createAPIMessage(interaction, embed)
                                    } else data = { content: result.content }
                                }

                                if(typeof result == "object" && result.allowedMentions) { data.allowedMentions = result.allowedMentions } else data.allowedMentions = { parse: [], repliedUser: true }
                                if(typeof result == "object" && result.ephemeral) { data.flags = 64 }
                                if(typeof result == "object" && result.components) {
                                    var finalData = [];
                                    if(!Array.isArray(result.components)) result.components = [[result.components]]
                                    result.components.forEach(option => {
                                        finalData.push({
                                            type: 1,
                                            components: option
                                        })
                                    })

                                    data.components = finalData
                                }

                                return this.client.api.interactions(interaction.id, interaction.token).callback.post({
                                    data: {
                                        type: result.thinking ? 5 : 4,
                                        data
                                    }, 
                                })
                            },
                            edit: async(result) => {
                                if (typeof result == "object") {
                                    var finalData = [];
                                    result.embeds = [];
                                    if(!Array.isArray(result.embeds)) result.embeds = [result.embeds]

                                    if(result.components) {
                                        if(!Array.isArray(result.components)) result.components = [[result.components]]
                                        result.components.forEach(option => {
                                            finalData.push({
                                                type: 1,
                                                components: option
                                            })
                                        })
                                    } else finalData = []

                                    if(typeof result.content == "object") {
                                        result.embeds = [result.content]
                                        result.content = "\u200B"
                                    }

                                    return this.client.api.webhooks(client.user.id, interaction.token).messages["@original"].patch({ data: {
                                        content: result.content,
                                        components: finalData,
                                        embeds: result.embeds
                                    }})
                                }

                                return this.client.api.webhooks(client.user.id, interaction.token).messages["@original"].patch({ data: { content: result }})
                            }
                        }, await this.getSlashArgs(interaction.data.options || []), await this.getSlashArgs2(interaction.data.options || []))
                    } catch(e) {
                        this.GCommandsClient.emit(Events.DEBUG, new Color("&d[GCommands Debug] &3" + e).getText())
                    }
                    
                    this.GCommandsClient.emit(Events.DEBUG, new Color("&d[GCommands Debug] &3User &a" + interaction.member.user.id + "&3 used &a" + interaction.data.name).getText())
                }catch(e) {
                    if(!this.unkownCommandMessage) return;
                    this.GCommandsClient.emit(Events.DEBUG, new Color("&d[GCommands Debug] &3" + e).getText())
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
        require("../moreEvents/channel")(this.client)
        require("../moreEvents/guild")(this.client)
        require("../moreEvents/guildmember")(this.client)
        require("../moreEvents/role")(this.client)
        require("../moreEvents/user")(this.client)
        require("../moreEvents/voiceupdate")(this.client)
        require("../moreEvents/interactions")(this.client)
    }

    /**
     * Internal method to createAPIMessage
     * @returns {object}
    */
    async createAPIMessage(interaction, content) {
        const apiMessage = await APIMessage.create(this.client.channels.resolve(interaction.channel_id), content)
        .resolveData()
        .resolveFiles();
        
        return { ...apiMessage.data, files: apiMessage.files };
    }

    /**
     * Internal method to getSlashArgs
     * @returns {object}
    */
    async getSlashArgs(options) {
        var args = [];
  
        var check = (option) => {
          if (!option) return;
          if (option.value) args.push(option.value);
          else args.push(option.name);
      
          if (option.options) {
            for (var o = 0; o < option.options.length; o++) {
              check(option.options[o]);
            }
          }
        }
      
        if (Array.isArray(options)) {
          for (var o = 0; o < options.length; o++) {
            check(options[o]);
          }
        } else {
          check(options);
        }
      
        return args;
    }

    async getSlashArgs2(options) {
        var args = {};
        for (var o of options) {
          if (o.type == 1) args[o.name] = this.getSlashArgs(o.options || []);
          else if (o.type == 2) args[o.name] = this.getSlashArgs(o.options || []); 
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
    async inhibit(cmd, slash, message) {
		for(const inhibitor of this.client.inhibitors) {
			let inhibit = inhibitor(cmd, slash, message);
			return inhibit;
		}
		return null;
    }
}

module.exports = GCommandsEventLoader;