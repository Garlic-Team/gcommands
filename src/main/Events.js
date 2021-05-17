const {Collection,MessageEmbed,APIMessage} = require("discord.js")
const Color = require("../color/Color");

module.exports = {

    /**
     * Command
     * @name ExampleCommand
     * @param {DiscordClient} client
     * @param {Object} slash
     * @param {Object} message
     * @param {Array} args
     * @example
     * module.exports = {
     *  name: "hi",
     *  aliases: ["hello"],
     *  description: "goo",
     *  run: async(client, slash, message, args) => {
     *      // code ... 
     *  }
    */

    /**
     * Internal method to normalCommands
     * @private
    */
    normalCommands: async function (client, slash, commands, aliases, cooldowns, cooldownDefault, prefix) {
        this.prefix = prefix
        this.client = client;
        this.slash = slash;
        this.commands = commands;
        this.aliases = aliases;
        this.cooldowns = cooldowns;
        this.cooldownDefault = cooldownDefault;

        if((this.slash == false) || (this.slash == "both")) {
            this.client.on('message', async(message) => {
                if (message.author.bot) return;
                if (!message.guild) return;
                var mentionRegex = new RegExp(`^<@!?(${this.client.user.id})> `)
                var prefix = message.content.match(mentionRegex) ? message.content.match(mentionRegex)[0] : this.prefix

                if(this.client.database.working) {
                    var guildSettings = await this.client.user.getGuildPrefix(message.guild.id)
                    prefix = message.content.match(mentionRegex) ? message.content.match(mentionRegex)[0] : guildSettings
                }

                if (!message.content.startsWith(prefix)) return;
            
                const args = message.content.slice(prefix.length).trim().split(/ +/g);
                const cmd = args.shift().toLowerCase();
                
                if (cmd.length === 0) return;
        
                try {
                    var commandos = this.commands.get(cmd);
                    if(!commandos) commandos = this.commands.get(this.aliases.get(cmd));

                    var inhibit = await this.inhibit(commandos, undefined, message)
                    if(inhibit == false) return;

                    if (!this.cooldowns.has(commandos.name)) {
                        this.cooldowns.set(commandos.name, new Collection());
                    }
                    
                    const now = Date.now();
                    const timestamps = this.cooldowns.get(commandos.name);
                    const cooldownAmount = (commandos.cooldown ? commandos.cooldown : this.cooldownDefault) * 1000;
                    
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

                    if(commandos.requiredPermission) {
                        if(this.client.discordjsversion.includes("12.")) {
                            if(!message.member.hasPermission(commandos.requiredPermission)) {
                                message.channel.send(this.client.languageFile.MISSING_PERMISSIONS[this.client.language].replace("{PERMISSION}",commandos.requiredPermission))
                                return;
                            }
                        } else {
                            if(!message.member.permission.has(commandos.requiredPermission)) {
                                message.channel.send(this.client.languageFile.MISSING_PERMISSIONS[this.client.language].replace("{PERMISSION}",commandos.requiredPermission))
                                return;
                            }
                        }
                    }

                    if(commandos.requiredRole) {
                        if(!message.member._roles.includes(commandos.requiredRole)) {
                            message.channel.send(this.client.languageFile.MISSING_ROLES[this.client.language].replace("{ROLES}",commandos.requiredRole))
                            return;
                        }
                    }

                    commandos.run(this.client, undefined, message, args)
                    this.client.emit("gDebug", new Color("&d[GCommands Debug] &3User &a" + message.author.id + "&3 used &a" + cmd).getText())
                } catch(e) {
                    if(this.client.languageFile.UNKNOWN_COMMAND[this.client.language]) {
                        message.channel.send(this.client.languageFile.UNKNOWN_COMMAND[this.client.language].replace("{COMMAND}",commandos.name));
                    }
                }
            })

            this.client.on('messageUpdate', async(oldMessage, message) => {
                if (message.author.bot) return;
                if (!message.guild) return;
                var mentionRegex = new RegExp(`^<@!?(${this.client.user.id})> `)
                var prefix = message.content.match(mentionRegex) ? message.content.match(mentionRegex)[0] : this.prefix

                if(this.client.database.working) {
                    var guildSettings = await this.client.user.getGuildPrefix(message.guild.id)
                    prefix = message.content.match(mentionRegex) ? message.content.match(mentionRegex)[0] : guildSettings
                }

                if (!message.content.startsWith(prefix)) return;
            
                const args = message.content.slice(prefix.length).trim().split(/ +/g);
                const cmd = args.shift().toLowerCase();
                
                if (cmd.length === 0) return;
        
                try {
                    var commandos = this.commands.get(cmd);
                    if(!commandos) commandos = this.commands.get(this.aliases.get(cmd));

                    var inhibit = await this.inhibit(commandos, undefined, message)
                    if(inhibit == false) return;

                    if (!this.cooldowns.has(commandos.name)) {
                        this.cooldowns.set(commandos.name, new Collection());
                    }
                    
                    const now = Date.now();
                    const timestamps = this.cooldowns.get(commandos.name);
                    const cooldownAmount = (commandos.cooldown ? commandos.cooldown : this.cooldownDefault) * 1000;
                    
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

                    if(commandos.requiredPermission) {
                        if(this.client.discordjsversion.includes("12.")) {
                            if(!message.member.hasPermission(commandos.requiredPermission)) {
                                message.channel.send(this.client.languageFile.MISSING_PERMISSIONS[this.client.language].replace("{PERMISSION}",commandos.requiredPermission))
                                return;
                            }
                        } else {
                            if(!message.member.permission.has(commandos.requiredPermission)) {
                                message.channel.send(this.client.languageFile.MISSING_PERMISSIONS[this.client.language].replace("{PERMISSION}",commandos.requiredPermission))
                                return;
                            }
                        }
                    }

                    if(commandos.requiredRole) {
                        if(!message.member._roles.includes(commandos.requiredRole)) {
                            message.channel.send(this.client.languageFile.MISSING_ROLES[this.client.language].replace("{ROLES}",commandos.requiredRole))
                            return;
                        }
                    }

                    commandos.run(this.client, undefined, message, args)
                    this.client.emit("gDebug", new Color("&d[GCommands Debug] &3User &a" + message.author.id + "&3 used &a" + cmd).getText())
                } catch(e) {
                    if(this.client.languageFile.UNKNOWN_COMMAND[this.client.language]) {
                        message.channel.send(this.client.languageFile.UNKNOWN_COMMAND[this.client.language].replace("{COMMAND}",commandos.name));
                    }
                }
            })
        }
    },

    /**
     * Internal method to slashCommands
     * @private
    */
    slashCommands: async function (client, slash, commands, cooldowns, cooldownDefault) {
        this.client = client;
        this.slash = slash;
        this.commands = commands;
        this.cooldowns = cooldowns;
        this.cooldownDefault = cooldownDefault;

        if((this.slash) || (this.slash == "both")) {
            this.client.ws.on('INTERACTION_CREATE', async (interaction) => {
                try {
                    var commandos = this.commands.get(interaction.data.name);
                    if (!this.cooldowns.has(commandos.name)) {
                        this.cooldowns.set(commandos.name, new Collection());
                    }

                    var inhibit = await this.inhibit(commandos, interaction, undefined)
                    if(inhibit == false) return;

                    const now = Date.now();
                    const timestamps = this.cooldowns.get(commandos.name);
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

                    if(commandos.requiredPermission) {
                        if(this.client.discordjsversion.includes("12.")) {
                            if(!this.client.guilds.cache.get(interaction.guild_id).members.cache.get(interaction.member.user.id).hasPermission(commandos.requiredPermission)) {
                                this.client.api.interactions(interaction.id, interaction.token).callback.post({
                                    data: {
                                        type: 4,
                                        data: {
                                            flags: 64,
                                            content:  this.client.languageFile.MISSING_PERMISSIONS[this.client.language].replace("{PERMISSION}",commandos.requiredPermission)
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
                                            content: this.client.languageFile.MISSING_PERMISSIONS[this.client.language].replace("{PERMISSION}",commandos.requiredPermission)
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
                                        content: this.client.languageFile.MISSING_ROLES[this.client.language].replace("{ROLES}",commandos.requiredRole)
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
                        var result = await commandos.run(this.client, interaction, undefined, this.getSlashArgs(interaction.data.options || []))
                        var data = {
                            content: result
                        }

                        if (typeof result === 'object') {
                            if(typeof result == "object" && !result.content) {
                                const embed = new MessageEmbed(result)
                                data = await this.createAPIMessage(this.client, interaction, embed)
                            }
                            else if(typeof result.content == "object" ) {
                                const embed = new MessageEmbed(result.content)
                                data = await this.createAPIMessage(this.client, interaction, embed)
                            } else {
                                data = {
                                    content: result.content
                                }
                            }
                        }

                        if(typeof result == "object" && result.allowedMentions) {
                            data.allowedMentions = result.allowedMentions
                        } else {
                            data.allowedMentions = { parse: [], repliedUser: true }
                        }

                        if(typeof result == "object" && result.ephemeral) {
                            data.flags = 64
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
                    if(this.client.languageFile.UNKNOWN_COMMAND[this.client.language]) {
                        this.client.api.interactions(interaction.id, interaction.token).callback.post({
                            data: {
                                type: 4,
                                data: {
                                    content: this.client.languageFile.UNKNOWN_COMMAND[this.client.language].replace("{COMMAND}",commandos.name)
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
    },

    getSlashArgs: function(options) {
        var args = {};
        for (var o of options) {
          if (o.type == 1) args[o.name] = this.getSlashArgs(o.options || []);
          else if (o.type == 2) args[o.name] = this.getSlashArgs(o.options || []); 
          else {
              args[o.name] = o.value;
          }
        }
        return args;
    },

    inhibit: async function(cmd, slash, message) {
		for(const inhibitor of this.client.inhibitors) {
			let inhibit = inhibitor(cmd, slash, message);
			return inhibit;
		}
		return null;
    }
};