const {Collection,MessageEmbed,APIMessage} = require("discord.js")
const Color = require("../color/Color");

module.exports = {
    normalCommands: async function (client, slash, commands, aliases, cooldowns, errorMessage, cooldownMessage, cooldownDefault, prefix) {
        this.prefix = prefix
        this.client = client;
        this.slash = slash;
        this.commands = commands;
        this.aliases = aliases;
        this.cooldowns = cooldowns;
        this.errorMessage = errorMessage;
        this.cooldownMessage = cooldownMessage;
        this.cooldownDefault = cooldownDefault;

        if((this.slash == false) || (this.slash == "both")) {
            this.client.on('message', async(message) => {
                if (message.author.bot) return;
                if (!message.guild) return;
                var prefix = this.prefix;

                if(this.client.database.working) {
                    if(this.client.database.type == "mongodb") {
                        var guildSettings = require('../models/guild')
                        const guild = await guildSettings.findOne({ id: message.guild.id })
                        if(!guild || !guild.prefix) prefix = this.prefix
                        else prefix = guild.prefix
                    } else {
                        var guildSettings = this.client.database.sqlite.get(`guildPrefix_${message.guild.id}`)
                        if(!guildSettings) prefix = this.prefix
                        else prefix = guildSettings
                    }
                }
                if (!message.content.toLowerCase().startsWith(prefix)) return;
            
                const args = message.content.slice(prefix.length).trim().split(/ +/g);
                const cmd = args.shift().toLowerCase();
                
                if (cmd.length === 0) return;
        
                try {
                    var commandos = this.commands.get(cmd);
                    if(!commandos) commandos = this.commands.get(this.aliases.get(cmd));

                    if (!this.cooldowns.has(cmd)) {
                        this.cooldowns.set(cmd, new Collection());
                    }
                    
                    const now = Date.now();
                    const timestamps = this.cooldowns.get(cmd);
                    const cooldownAmount = (commandos.cooldown ? commandos.cooldown : this.cooldownDefault) * 1000;
                    
                    if (timestamps.has(message.author.id)) {
                        if (timestamps.has(message.author.id)) {
                            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
                        
                            if (now < expirationTime) {
                                const timeLeft = (expirationTime - now) / 1000;

                                return message.channel.send(this.cooldownMessage.replace(/{cooldown}/g, timeLeft.toFixed(1)).replace(/{cmdname}/g, cmd))
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

                    if(commandos.ownerOnly) {
                        if(message.author.id != commandos.ownerOnly) {
                            return;
                        }
                    }

                    if(commandos.requiredPermission) {
                        if(this.client.discordjsversion.includes("12.")) {
                            if(!message.member.hasPermission(commandos.requiredPermission)) {
                                message.channel.send(commandos.requiredPermissionMessage ? commandos.requiredPermissionMessage : "You don't have permissions!")
                                return;
                            }
                        } else {
                            if(!message.member.permission.has(commandos.requiredPermission)) {
                                message.channel.send(commandos.requiredPermissionMessage ? commandos.requiredPermissionMessage : "You don't have permissions!")
                                return;
                            }
                        }
                    }

                    if(commandos.requiredRole) {
                        if(!message.member._roles.includes(commandos.requiredRole)) {
                            message.channel.send(commandos.requiredRoleMessage ? commandos.requiredRoleMessage : "You don't have role!")
                            return;
                        }
                    }

                    commandos.run(this.client, undefined, message, args)
                    this.client.emit("gDebug", new Color("&d[GCommands Debug] &3User &a" + message.author.id + "&3 used &a" + cmd).getText())
                } catch(e) {
                    if(this.errorMessage) {
                        message.channel.send(this.errorMessage);
                    }
                }
            })
        }
    },

    slashCommands: async function (client, slash, commands, cooldowns, errorMessage, cooldownMessage, cooldownDefault) {
        this.client = client;
        this.slash = slash;
        this.commands = commands;
        this.cooldowns = cooldowns;
        this.errorMessage = errorMessage;
        this.cooldownMessage = cooldownMessage;
        this.cooldownDefault = cooldownDefault;

        if((this.slash) || (this.slash == "both")) {
            this.client.ws.on('INTERACTION_CREATE', async (interaction) => {
                try {
                    var commandos = this.commands.get(interaction.data.name);
                    if (!this.cooldowns.has(interaction.data.name)) {
                        this.cooldowns.set(interaction.data.name, new Collection());
                    }
                    
                    const now = Date.now();
                    const timestamps = this.cooldowns.get(interaction.data.name);
                    const cooldownAmount = (commandos.cooldown ? commandos.cooldown : this.cooldownDefault) * 1000;
                    
                    if (timestamps.has(interaction.member.user.id)) {
                        if (timestamps.has(interaction.member.user.id)) {
                            const expirationTime = timestamps.get(interaction.member.user.id) + cooldownAmount;
                        
                            if (now < expirationTime) {
                                const timeLeft = (expirationTime - now) / 1000;
                                client.api.interactions(interaction.id, interaction.token).callback.post({
                                    data: {
                                        type: 4,
                                        data: {
                                            flags: 64,
                                            content: this.cooldownMessage.replace(/{cooldown}/g, timeLeft.toFixed(1)).replace(/{cmdname}/g, interaction.data.name)
                                        }
                                    }
                                });
                                return;
                            }
                        }
                    }

                    timestamps.set(interaction.member.user.id, now);
                    setTimeout(() => timestamps.delete(interaction.member.user.id), cooldownAmount);

                    if(commandos.ownerOnly) {
                        if(interaction.member.user.id != commandos.ownerOnly) {
                            return;
                        }
                    }

                    if(commandos.requiredPermission) {
                        if(this.client.discordjsversion.includes("12.")) {
                            if(!this.client.guilds.cache.get(interaction.guild_id).members.cache.get(interaction.member.user.id).hasPermission(commandos.requiredPermission)) {
                                this.client.api.interactions(interaction.id, interaction.token).callback.post({
                                    data: {
                                        type: 4,
                                        data: {
                                            flags: 64,
                                            content: commandos.requiredPermissionMessage ? commandos.requiredPermissionMessage : "You don't have permissions!"
                                        }
                                    }
                                });
                                return;
                            }
                        } else {
                            if(!this.client.guilds.cache.get(interaction.guild_id).members.cache.get(interaction.member.user.id).permission.has(commandos.requiredPermission)) {
                                this.client.api.interactions(interaction.id, interaction.token).callback.post({
                                    data: {
                                        type: 4,
                                        data: {
                                            flags: 64,
                                            content: commandos.requiredPermissionMessage ? commandos.requiredPermissionMessage : "You don't have permissions!"
                                        }
                                    }
                                });
                                return;
                            } 
                        }
                    }

                    if(commandos.requiredRole) {
                        if(!interaction.member.roles.includes(commandos.requiredRole)) {
                            this.client.api.interactions(interaction.id, interaction.token).callback.post({
                                data: {
                                    type: 4,
                                    data: {
                                        flags: 64,
                                        content: commandos.requiredRoleMessage ? commandos.requiredRoleMessage : "You don't have role!"
                                    }
                                }
                            }); 
                            return;
                        }
                    }

                    try {
                        var result = await commandos.run(this.client, interaction)
                        var data = {
                            content: result,
                            allowedMentions: { parse: [], repliedUser: true }
                        }

                        if (typeof result === 'object') {
                            if(typeof result == "object" && !result.content) {
                                const embed = new MessageEmbed(result)
                                data = await this.createAPIMessage(this.client, interaction, embed)
                            }
                            else if(result.ephemeral == true && typeof result.content != "object") {
                                data = {
                                    content: result.content,
                                    allowedMentions: { parse: [], repliedUser: true },
                                    flags: 64
                                }
                            } else if(typeof result.content == "object" && result.ephemeral == true) {
                                const embed = new MessageEmbed(result.content)
                                data = await this.createAPIMessage(this.client, interaction, embed)
                            } else if(typeof result.content == "object" ) {
                                const embed = new MessageEmbed(result.content)
                                data = await this.createAPIMessage(this.client, interaction, embed)
                            } else {
                                data = {
                                    content: result.content,
                                    allowedMentions: { parse: [], repliedUser: true },
                                }
                            }
                        }

                        this.client.api.interactions(interaction.id, interaction.token).callback.post({
                          data: {
                            type: 4,
                            data
                          },
                        })
                    } catch(e) {
                        this.client.emit("gDebug", new Color("&d[GCommands Debug] &3" + e).getText())
                        commandos.run(this.client, interaction);
                    }
                    this.client.emit("gDebug", new Color("&d[GCommands Debug] &3User &a" + interaction.member.user.id + "&3 used &a" + interaction.data.name).getText())
                }catch(e) {
                    if(this.errorMessage) {
                        this.client.api.interactions(interaction.id, interaction.token).callback.post({
                            data: {
                                type: 4,
                                data: {
                                    content: this.errorMessage
                                }
                            }
                        });
                    }
                }
            })
        }
    },

    loadMoreEvents: async function(client) {
        this.client = client;

        require("./moreEvents/channel")(this.client)
        require("./moreEvents/guild")(this.client)
        require("./moreEvents/guildmember")(this.client)
        require("./moreEvents/role")(this.client)
        require("./moreEvents/user")(this.client)
        require("./moreEvents/voiceupdate")(this.client)
    },

    createAPIMessage: async function(client, interaction, content) {
        const apiMessage = await APIMessage.create(client.channels.resolve(interaction.channel_id), content)
        .resolveData()
        .resolveFiles();
        
        return { ...apiMessage.data, files: apiMessage.files };
    }
};