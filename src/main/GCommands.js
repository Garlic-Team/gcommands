const { promisify } = require('util');
const path = require('path');
const glob = promisify(require('glob'));
const Color = require("../color/Color");
const Events = require('./Events');
const Message = require('./Message');
const { Collection, Structures } = require('discord.js');
const axios = require("axios");

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
        this.mongodb = options.mongodb;

        this.prefix = options.slash.prefix ? options.slash.prefix : undefined;
        this.slash = options.slash.slash ? options.slash.slash : false;
        this.cooldownMessage = options.cooldown.message ? options.cooldown.message : "Please wait {cooldown} more second(s) before reusing the \`{cmdname}\` command.";
        this.cooldownDefault = options.cooldown.default ? options.cooldown.default : 0;

        if(options.errorMessage) {
            this.errorMessage = options.errorMessage;
        }

        Events.normalCommands(this.client, this.slash, this.commands, this.cooldowns, this.errorMessage, this.prefix)
        Events.slashCommands(this.client, this.slash, this.commands, this.cooldowns, this.errorMessage)

        this.__loadCommands();
    }

    async __loadCommands() {
		return glob(`./${this.cmdDir}/**/*.js`).then(commands => {
			for (const commandFile of commands) {
				const { name } = path.parse(commandFile);
                var File;

                try {
                    File = require("../../../../"+this.cmdDir+"/"+name)
                } catch(e) {
                    try {
                        File = require("../../../../"+commandFile.split("./")[1])
                    } catch(e) {
                        try {
                            File = require("../../"+this.cmdDir+"/"+name);
                        } catch(e) {
                            try {
                                File = require("../../../"+this.cmdDir+"/"+name);
                            } catch(e) {
                                return console.log(new Color("&d[GCommands] &cCan't load " + name));
                            }
                        }
                    }
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
            var options = [];
            var subCommandGroup = {};
            var subCommand = [];
            const cmd = this.commands.get(cmdname)

            if(cmd.subCommandGroup) {
                subCommandGroup = [
                    {
                        name: cmd.subCommandGroup,
                        description: cmd.subCommandGroup,
                        type: 2
                    }
                ]
            }

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

                if(cmd.subCommand) {
                    cmd.subCommand.forEach(sc => {
                        var g = []
                        var optionsSplit = sc.split(";")[1]

                        if(optionsSplit) {
                            var split = optionsSplit
                                .substring(1, optionsSplit.length - 1)
                                .split(/[>\]] [<\[]/)
                
                            for (let a = 0; a < split.length; ++a) {
                                var item = split[a]
            
                                g.push({
                                    name: item.replace(/ /g, '-'),
                                    description: item,
                                    type: 3,
                                    required: a < cmd.minArgs,
                                })
                            }
                        }

                        subCommand.push({
                            name: sc.split(";")[0],
                            description: sc.split(";")[0],
                            type: 1,
                            options: g || []
                        })
                    })
                    /*subCommand = [
                        {
                            name: cmd.subCommand,
                            description: cmd.subCommand,
                            type: 1,
                            options: options || []
                        }
                    ]*/
                }

                if(cmd.subCommandGroup) {
                    subCommandGroup = [
                        {
                            name: subCommandGroup[0].name,
                            description: subCommandGroup[0].name,
                            type: subCommandGroup[0].type,
                            options: subCommand
                        }
                    ]
                }
            }

            try {
                var url = `https://discord.com/api/v8/applications/${this.client.user.id}/commands`;
        
                if(cmd.guildOnly) url = `https://discord.com/api/v8/applications/${this.client.user.id}/guilds/${cmd.guildOnly}/commands`;

                var cmdd = {
                    name: cmd.name,
                    description: cmd.description,
                    options: options || []
                }

                if(cmd.subCommandGroup && cmd.subCommand) {
                     cmdd = {
                        name: cmd.name,
                        description: cmd.description,
                        options: subCommandGroup || []
                    };
                } else {
                    cmdd = {
                        name: cmd.name,
                        description: cmd.description,
                        options: options || []
                    };
                }

                var config = {
                    method: "POST",
                    headers: {
                        Authorization: `Bot ${this.client.token}`,
                        "Content-Type": "application/json"
                    },
                    data: JSON.stringify(cmdd), 
                    url,
                }

                axios(config).then((response) => {
                    console.log(new Color("&d[GCommands] &aLoaded: &e➜   &3" + cmd.name, {json:false}).getText());
                })
                .catch((error) => {
                    console.log(new Color("&d[GCommands] &cRequest failed! " + error, {json:false}).getText());

                    if(error.response) {
                        if(error.response.status == 429) {
                            setTimeout(() => {
                                this.__tryAgain(cmd, config)
                            }, 20000)
                        }
                    }
                }) 
            }catch(e) {
                console.log(e)
            }  
        })
    }

    async __tryAgain(cmd, config) {
        axios(config).then((response) => {
            console.log(new Color("&d[GCommands] &aLoaded: &e➜   &3" + cmd.name, {json:false}).getText());
        })
        .catch((error) => {
            console.log(new Color("&d[GCommands] &cRequest failed! " + error, {json:false}).getText());
            
            if(error.response) {
                if(error.response.status == 429) {
                    setTimeout(() => {
                        this.__tryAgain(cmd, config)
                    }, 20000)
                }
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

class Message extends Structures.get("Message") {
    async buttons(content, options) {
        Message.buttons(this.client, content, options)
    }

    async inlineReply(content, options) {
        Message.inlineReply(this.client, content, options)
    }

    async buttonsWithReply(content, options) {
        Message.inlineReply(this.client, content, options)
    }
}

Structures.extend("Message", () => Message);