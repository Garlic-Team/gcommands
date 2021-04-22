const { promisify } = require('util');
const path = require('path');
const glob = promisify(require('glob'));
const Color = require("../color/Color");
const { Collection } = require('discord.js');

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
        this.ignoreBots = options.ignoreBots ? options.ignoreBots : false;

        this.prefix = options.slash.prefix.toLowerCase() ? options.slash.prefix.toLowerCase() : undefined;
        this.slash = options.slash.slash ? options.slash.slash : true;
        this.cooldownMessage = options.cooldownMessage ? options.cooldownMessage : "Please wait {cooldown} more second(s) before reusing the \`{cmdname}\` command.";

        if(options.errorMessage) {
            this.errorMessage = options.errorMessage;
        }

        if((this.slash) || (this.slash == "both")) {
            this.client.ws.on('INTERACTION_CREATE', async (interaction) => {
                try {
                    if (!this.cooldowns.has(interaction.data.name)) {
                        this.cooldowns.set(interaction.data.name, new Collection());
                    }
                    
                    const now = Date.now();
                    const timestamps = this.cooldowns.get(interaction.data.name);
                    const cooldownAmount = (this.commands.get(interaction.data.name).cooldown || 3) * 1000;
                    
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
                    if (!this.cooldowns.has(cmd)) {
                        this.cooldowns.set(cmd, new Collection());
                    }
                    
                    const now = Date.now();
                    const timestamps = this.cooldowns.get(cmd);
                    const cooldownAmount = (this.commands.get(cmd).cooldown || 3) * 1000;
                    
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

                    this.commands.get(cmd).run(this.client, undefined, message, args)
                } catch(e) {
                    console.log(e)
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
                const File = require("../../../../"+this.cmdDir+"/"+name)

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
                let url = `https://discord.com/api/v8/applications/${this.client.user.id}/commands`;
        
                let cmdd = {
                    name: cmd.name,
                    description: cmd.description,
                    options: options || []
                };
        
                let config = {
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
                this.__deleteCmd(fo.id)
            }
        })

        this.__createCommands();
    }

    async __deleteCmd(commandId) {
        const app = this.client.api.applications(this.client.user.id)
    
        await app.commands(commandId).delete()
    }

    async __getAllCommands() {
        const app = this.client.api.applications(this.client.user.id)
        return await app.commands.get()
    }
}