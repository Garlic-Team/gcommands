const { promisify } = require('util');
const path = require('path');
const glob = promisify(require('glob'));
const Color = require("../color/Color");
const { Collection, Structures, APIMessage } = require('discord.js');
const { cpuUsage } = require('process');

module.exports = class GCommands {
    constructor(client, options = {}) {
        if (typeof client !== 'object') return console.log(new Color("&d[GCommands] &cNo discord.js client provided!",{json:false}).getText());
        if (!Object.keys(options).length) return console.log(new Color("&d[GCommands] &cNo default options provided!",{json:false}).getText());
        if(!options.cmdDir) return console.log(new Color("&d[GCommands] &cNo default options provided! (cmdDir)",{json:false}).getText());

        if(!client) console.log(new Color("&d[GCommands] &cNo discord.js client provided!"));

        this.client = client;

        this.commands = new Collection();
        this.cooldowns = new Collection();

        this.cmdDir = options.cmdDir;

        this.prefix = options.slash.prefix ? options.slash.prefix : undefined;
        this.slash = options.slash.slash ? options.slash.slash : true;
        this.cooldownMessage = options.cooldown.message ? options.cooldown.message : "Please wait {cooldown} more second(s) before reusing the \`{cmdname}\` command.";
        this.cooldownDefault = options.cooldown.default ? options.cooldown.default : 0;

        if(options.errorMessage) {
            this.errorMessage = options.errorMessage;
        }

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
                            console.log(interaction.member.user.id)
                            const expirationTime = timestamps.get(interaction.member.user.id) + cooldownAmount;
                        
                            if (now < expirationTime) {
                                const timeLeft = (expirationTime - now) / 1000;
                                client.api.interactions(interaction.id, interaction.token).callback.post({
                                    data: {
                                        type: 4,
                                        data: {
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
                        if(interaction.member.user.id == commandos.ownerOnly) {
                            this.commands.get(interaction.data.name).run(this.client, interaction);
                            return;
                        } else {
                            return;
                        }
                    }

                    this.commands.get(interaction.data.name).run(this.client, interaction);
                }catch(e) {
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

        if((this.slash == "both") || (!this.slash)) {
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
                                return message.reply(this.cooldownMessage.replace(/{cooldown}/g, timeLeft.toFixed(1)).replace(/{cmdname}/g, cmd));
                            }
                        }
                    }

                    timestamps.set(message.author.id, now);
                    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

                    if(commandos.guildOnly) {
                        if(message.guild.id == commandos.guildOnly) {
                            this.commands.get(cmd).run(this.client, undefined, message, args)
                        } else {
                            return;
                        }
                    } 

                    if(commandos.ownerOnly) {
                        if(message.author.id == commandos.ownerOnly) {
                            this.commands.get(cmd).run(this.client, undefined, message, args)
                            return;
                        } else {
                            return;
                        }
                    }

                    this.commands.get(cmd).run(this.client, undefined, message, args)
                } catch(e) {
                    message.channel.send(this.errorMessage);
                }
            })
        }

        this.__loadCommands();
    }

    async __loadCommands() {
		return glob(`./${this.cmdDir}/**/*.js`).then(commands => {
			for (const commandFile of commands) {
				delete require.cache[commandFile];
				const { name } = path.parse(commandFile);
                var File;

                try {
                    File = require("../../../../"+this.cmdDir+"/"+name)
                } catch(e) {
                    File = require("../../"+this.cmdDir+"/"+name)
                }

				this.commands.set(File.name, File);
			};

            this.__deleteAllCmds();
		});
    }

    async __createCommands() {
        var po = await this.__getAllCommands();

        let keys = Array.from(this.commands.keys());
        keys.forEach(async (cmdname) => {
            const options = [];
            const cmd = this.commands.get(cmdname)

            if (cmd.expectedArgs && cmd.minArgs) {
                const split = cmd.expectedArgs
                  .substring(1, cmd.expectedArgs.length - 1)
                  .split(/[>\]] [<\[]/)
        
                for (let a = 0; a < split.length; ++a) {
                  const item = split[a]

                  options.push({
                    name: item.replace(/ /g, '-'),
                    description: item,
                    type: 3,
                    required: a < cmd.minArgs,
                  })
                }
            }

            try {
                var url = `https://discord.com/api/v8/applications/${this.client.user.id}/commands`;
        
                if(cmd.guildOnly) url = `https://discord.com/api/v8/applications/${this.client.user.id}/guilds/${cmd.guildOnly}/commands`;

                var cmdd = {
                    name: cmd.name,
                    description: cmd.description,
                    options: options || []
                };
        
                var config = {
                    method: "POST",
                    headers: {
                        Authorization: `Bot ${this.client.token}`,
                        "Content-Type": "application/json"
                    },
                    data: JSON.stringify(cmdd), 
                    url,
                }

                const axios = require("axios");
                axios(config).then((response) => {
                    console.log(new Color("&d[GCommands] &aLoaded: &e➜   &3" + cmd.name, {json:false}).getText());
                })
                .catch((err) => {
                    console.log(new Color("&d[GCommands] &cRequest failed! " + err, {json:false}).getText());
                }) 
            }catch(e) {
                console.log(e)
            }  
        })
    }

    async __deleteAllCmds() {
        var allcmds = await this.__getAllCommands();
        if(!this.slash) {
            allcmds.forEach(fo => {
                this.__deleteCmd(fo.id)
            })
        }

        var nowCMDS = [];

        let keys = Array.from(this.commands.keys());
        keys.forEach(cmdname => {
            nowCMDS.push(cmdname)
        })

        allcmds.forEach(fo => {
            var f = nowCMDS.some(v => fo.name.toLowerCase().includes(v.toLowerCase()))

            if(!f) {
                this.__deleteCmd(fo.id, fo.guild_id)
            }
        })

        this.__createCommands();
    }

    async __deleteCmd(commandId, guildId) {
        const app = this.client.api.applications(this.client.user.id)
        if(guildId) {
            app.guilds(guildId)
        }


        await app.commands(commandId).delete()
    }

    async __getAllCommands() {
        const app = this.client.api.applications(this.client.user.id)
        return await app.commands.get()
    }
}

class Message extends Structures.get("Message") {
    async buttons(content, options) {
        if (!options.buttons) {
            options.buttons = [];
        }

        if(!options.allowedMentions) {
            options.allowedMentions = { parse: ["users", "roles", "everyone"] };
        }

        if (!Array.isArray(options.buttons)) {
            return console.log(new Color("&d[GCommands] &cThe buttons must be array.",{json:false}).getText());
        }

        let buttons = [];
        let styles = ['blupurple', 'grey', 'green', 'red', 'url'];

        options.buttons.forEach((x, i) => {
            if (!x.style) x.style = 'blupurple';

            if (!styles.includes(x.style)) {
                return console.log(new Color(`&d[GCommands] &c#${i} button has invalid style, recived ${x.style}`,{json:false}).getText());
            }

            if (!x.label) {
                return console.log(new Color(`&d[GCommands] &c#${i} don't has label!`,{json:false}).getText());
            }

            if (typeof (x.label) !== 'string') x.label = String(x.label);

            if (x.style === 'url') {
                if (!x.url) {
                    return console.log(new Color(`&d[GCommands] &cIf the button style is "url", you must provide url`,{json:false}).getText());
                }
            } else {
                if (!x.id) {
                    return console.log(new Color(`&d[GCommands] &cIf the button style is not "url", you must provide custom id`,{json:false}).getText());
                }
            }

            var style;

            if (x.style === 'blupurple') {
                style = 1;
            } else if (x.style === 'grey') {
                style = 2;
            } else if (x.style === 'green') {
                style = 3;
            } else if (x.style === 'red') {
                style = 4;
            } else if (x.style === 'url') {
                style = 5;
            }

            let data = {
                type: 2,
                style: style,
                label: x.label,
                custom_id: x.id || null,
                url: x.url || null
            }

            buttons.push(data);
        })

        options.buttons === null;

        this.client.ws.on('INTERACTION_CREATE', async (data) => {
            let typeStyles = {
                1: 'blupurple',
                2: 'grey',
                3: 'green',
                4: 'red',
                5: 'url'
            };

            await this.client.channels.cache.get(data.channel_id).messages.fetch();

            var message;
            try {
                message = await this.client.channels.cache.get(data.channel_id).messages.cache.get(data.message.id);
            } catch(e) {
                message = await this.client.channels.cache.get(data.channel_id)
            }

            var clicker = await this.client.guilds.cache.get(data.guild_id).members.cache.get(data.member.user.id);

            this.client.emit('clickButton', {
                version: data.version,
                type: data.type,
                style: typeStyles[data.type],
                token: data.token,
                id: data.data.custom_id,
                discordId: data.id,
                applicationId: data.application_id,
                clicker: clicker,
                message
            })
        });

        this.client.api.channels[this.channel.id].messages.post({
            headers: {
            "Content-Type": 'applications/json'
            },
            data: {
                allowed_mentions: options.allowedMentions,
                content: content,
                components: [
                    {
                        type: 1,
                        components: buttons
                    }
                ],
                options,
                embed: options.embed || null
            }
        });
    }

    async inlineReply(content, options) {
        const mentionRepliedUser = typeof ((options || content || {}).allowedMentions || {}).repliedUser === "undefined" ? true : ((options || content).allowedMentions).repliedUser;
        delete ((options || content || {}).allowedMentions || {}).repliedUser;

        const apiMessage = content instanceof APIMessage ? content.resolveData() : APIMessage.create(this.channel, content, options).resolveData();
        Object.assign(apiMessage.data, { message_reference: { message_id: this.id } });

        if (!apiMessage.data.allowed_mentions || Object.keys(apiMessage.data.allowed_mentions).length === 0)
        apiMessage.data.allowed_mentions = { parse: ["users", "roles", "everyone"] };
        if (typeof apiMessage.data.allowed_mentions.replied_user === "undefined")
        Object.assign(apiMessage.data.allowed_mentions, { replied_user: mentionRepliedUser });

        if (Array.isArray(apiMessage.data.content)) {
            return Promise.all(apiMessage.split().map(x => {
                x.data.allowed_mentions = apiMessage.data.allowed_mentions;
                return x;
            }).map(this.inlineReply.bind(this)));
        }

        const { data, files } = await apiMessage.resolveFiles();
        return this.client.api.channels[this.channel.id].messages
            .post({ data, files })
            .then(d => this.client.actions.MessageCreate.handle(d).message);
    }
}

Structures.extend("Message", () => Message);