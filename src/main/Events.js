const {Collection} = require("discord.js")

module.exports = {
    normalCommands: async function (client, slash, commands, cooldowns, errorMessage, prefix) {
        this.prefix = prefix
        this.client = client;
        this.slash = slash;
        this.commands = commands;
        this.cooldowns = cooldowns;
        this.errorMessage = errorMessage;

        if((this.slash == false) || (this.slash == "both")) {
            this.client.on('message', async(message) => {
                const prefix = this.prefix;

                if (message.author.bot) return;
                if (!message.guild) return;
                if (!message.content.startsWith(prefix)) return;
            
                const args = message.content.slice(prefix.length).trim().split(/ +/g);
                const cmd = args.shift().toLowerCase();
                
                if (cmd.length === 0) return;
        
                try {
                    var commandos = this.commands.get(cmd);
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
                                return message.reply(this.cooldownMessage.replace(/{cooldown}/g, timeLeft.toFixed(1)).replace(/{cmdname}/g, cmd)).then(m => {m.delete({timeout:5000})});
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
                        if(!message.member.hasPermission(commandos.requiredPermission)) {
                            message.channel.send(commandos.requiredPermissionMessage ? commandos.requiredPermissionMessage : "You don't have permissions!")
                            return;
                        }
                    }

                    this.commands.get(cmd).run(this.client, undefined, message, args)
                } catch(e) {
                    if(this.errorMessage) {
                        message.channel.send(this.errorMessage);
                    }
                }
            })
        }
    },

    slashCommands: async function (client, slash, commands, cooldowns, errorMessage) {
        this.client = client;
        this.slash = slash;
        this.commands = commands;
        this.cooldowns = cooldowns;
        this.errorMessage = errorMessage;
        
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
                        if(!this.client.guilds.cache.get(interaction.guild_id).members.cache.get(interaction.member.user.id).hasPermission(commandos.requiredPermission)) {
                            client.api.interactions(interaction.id, interaction.token).callback.post({
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

                    this.commands.get(interaction.data.name).run(this.client, interaction);
                }catch(e) {
                    console.log(e)
                    if(this.errorMessage) {
                        client.api.interactions(interaction.id, interaction.token).callback.post({
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
    }
};