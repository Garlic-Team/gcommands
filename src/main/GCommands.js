const { promisify } = require('util');
const path = require('path');
const glob = promisify(require('glob'));
const Color = require("../color/Color");
const GEvents = require("./GEvents");
const Events = require('./Events');
const { Collection, Structures, APIMessage } = require('discord.js');
const axios = require("axios");
const fs = require("fs");

module.exports = class GCommands {
    constructor(client, options = {}) {
        if (typeof client !== 'object') return console.log(new Color("&d[GCommands] &cNo discord.js client provided!",{json:false}).getText());
        if (!Object.keys(options).length) return console.log(new Color("&d[GCommands] &cNo default options provided!",{json:false}).getText());
        if(!options.cmdDir) return console.log(new Color("&d[GCommands] &cNo default options provided! (cmdDir)",{json:false}).getText());

        if(!client) console.log(new Color("&d[GCommands] &cNo discord.js client provided!"));

        this.client = client;

        this.cmdDir = options.cmdDir;
        this.eventDir = options.eventDir;

        if(this.eventDir) {
            new GEvents(this.client, {
                eventDir: this.eventDir
            })
        }

        if(options.database) {
            this.client.database = {
                type: options.database.type ? options.database.type : undefined,
                url: options.database.url ? options.database.url : undefined,
                working: false
            };
        } else {
            this.client.database = {
                type:  undefined,
                url: undefined,
                working: false
            };
        }

        this.client.categories = fs.readdirSync("./" + this.cmdDir );
        this.client.commands = new Collection();
        this.client.aliases = new Collection();
        this.client.cooldowns = new Collection();

        this.client.prefix = options.slash.prefix ? options.slash.prefix : undefined;
        this.client.slash = options.slash.slash ? options.slash.slash : false;
        this.client.cooldownMessage = options.cooldown.message ? options.cooldown.message : "Please wait {cooldown} more second(s) before reusing the \`{cmdname}\` command.";
        this.client.cooldownDefault = options.cooldown.default ? options.cooldown.default : 0;

        if(options.errorMessage) {
            this.client.errorMessage = options.errorMessage;
        }

        this.__loadCommands();
        this.__dbLoad();

        Events.normalCommands(this.client, this.client.slash, this.client.commands, this.client.aliases, this.client.cooldowns, this.client.errorMessage, this.client.cooldownMessage, this.client.cooldownDefault, this.client.prefix)
        Events.slashCommands(this.client, this.client.slash, this.client.commands, this.client.cooldowns, this.client.errorMessage, this.client.cooldownMessage, this.client.cooldownDefault)
    }

    async __dbLoad() {
        if(this.client.database.type == "mongodb") {
            var mongoose = require("mongoose")
            mongoose.connect(this.client.database.url, { useNewUrlParser: true, useUnifiedTopology: true })
                .then((connection) => {
                    console.log(new Color("&d[GCommands] &aMongodb loaded!",{json:false}).getText());
                    this.client.database.working = true;
                    return;
                })
                .catch((e) => {
                    console.log(new Color("&d[GCommands] &cMongodb url is not valid.",{json:false}).getText());
                    this.client.database.working = false;
                    return;
                })
        }
        else if(this.client.database.type == "sqlite") {
            var sqliteDb = require("quick.db")
            this.client.database.working = true;
            this.client.database.sqlite = sqliteDb;
        }
    }

    async __loadCommands() {
		return glob(`./${this.cmdDir}/**/*.js`).then(commands => {
			for (const commandFile of commands) {
				const { name } = path.parse(commandFile);
                var File;

                try {
                    File = require("../../../../"+this.cmdDir+"/"+name)
                    console.log(new Color("&d[GCommands] &aLoaded (File): &e➜   &3" + name, {json:false}).getText());
                } catch(e) {
                    try {
                        File = require("../../../../"+commandFile.split("./")[1])
                        console.log(new Color("&d[GCommands] &aLoaded (File): &e➜   &3" + name, {json:false}).getText());
                    } catch(e) {
                        try {
                            File = require("../../"+this.cmdDir+"/"+name);
                            console.log(new Color("&d[GCommands] &aLoaded (File): &e➜   &3" + name, {json:false}).getText());
                        } catch(e) {
                            try {
                                File = require("../../../"+this.cmdDir+"/"+name);
                                console.log(new Color("&d[GCommands] &aLoaded (File): &e➜   &3" + name, {json:false}).getText());
                            } catch(e) {
                                this.client.emit("gDebug", new Color("&d[GCommands Debug] "+e).getText())
                                return console.log(new Color("&d[GCommands] &cCan't load " + name).getText());
                            }
                        }
                    }
                }

                if (File.aliases && Array.isArray(File.aliases)) File.aliases.forEach(alias => this.client.aliases.set(alias, File.name));
				this.client.commands.set(File.name, File);
			};

            this.__deleteAllCmds();
		});
    }

    async __createCommands() {
        var po = await this.__getAllCommands();

        let keys = Array.from(this.client.commands.keys());

        keys.forEach(async (cmdname) => {
            var options = [];
            var subCommandGroup = {};
            var subCommand = [];
            const cmd = this.client.commands.get(cmdname)
            if(cmd.slash == false || cmd.slash == "false") return;

            if(!cmd.name) return console.log(new Color("&d[GCommands] &cParameter name is required! ("+cmdname+")",{json:false}).getText());
            if(!cmd.description) return console.log(new Color("&d[GCommands] &cParameter description is required! ("+cmdname+")",{json:false}).getText());

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
                var split = cmd.expectedArgs
                  .substring(1, cmd.expectedArgs.length - 1)
                  .split(/[>\]] [<\[]/)
        
                for (let a = 0; a < split.length; ++a) {
                  var item = split[a];
                  var option = item.replace(/ /g, '-').split(":")[0] ? item.replace(/ /g, '-').split(":")[0] : item.replace(/ /g, '-');
                  var optionType = item.replace(/ /g, '-').split(":")[1] ? item.replace(/ /g, '-').split(":")[1] : 3;
                  var optionDescription = item.replace(/ /g, '-').split(":")[2] ? item.replace(/ /g, '-').split(":")[2] : item;
                  if(optionType == 1 || optionType == 2) optionType = 3

                  options.push({
                    name: option,
                    description: optionDescription,
                    type: parseInt(optionType),
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
                                var option = item.replace(/ /g, '-').split(":")[0] ? item.replace(/ /g, '-').split(":")[0] : item.replace(/ /g, '-');
                                var optionType = item.replace(/ /g, '-').split(":")[1] ? item.replace(/ /g, '-').split(":")[1] : 3;
                                var optionDescription = item.replace(/ /g, '-').split(":")[2] ? item.replace(/ /g, '-').split(":")[2] : item;
                                if(optionType == 1 || optionType == 2) optionType = 3

                                g.push({
                                    name: option,
                                    description: optionDescription,
                                    type: parseInt(optionType),
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
                        } else {
                            try {
                                this.client.emit("gDebug", new Color([
                                    "&a----------------------",
                                    "  &d[GCommands Debug] &3",
                                    "&aCode: &b" + error.response.data.code,
                                    "&aMessage: &b" + error.response.data.message,
                                    " ",
                                    "&b" + error.response.data.errors.guild_id._errors[0].code,
                                    "&b" + rror.response.data.errors.guild_id._errors[0].message,
                                    "&a----------------------"
                                ]).getText())
                            } catch(e) {
                                this.client.emit("gDebug", new Color([
                                    "&a----------------------",
                                    "  &d[GCommands Debug] &3",
                                    "&aCode: &b" + error.response.data.code,
                                    "&aMessage: &b" + error.response.data.message,
                                    "&a----------------------"
                                ]).getText())
                            }  
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
        try {
            var allcmds = await this.__getAllCommands();
            if(!this.slash) {
                allcmds.forEach(fo => {
                    this.__deleteCmd(fo.id)
                })
            }

            var nowCMDS = [];

            let keys = Array.from(this.client.commands.keys());
            keys.forEach(cmdname => {
                nowCMDS.push(cmdname)

                /*if(this.client.commands.get(cmdname).slash == false) {
                    allcmds.forEach(fo => {
                        if(fo.name == cmdname) {
                            this.__deleteCmd(fo.id)
                        }
                    })
                }*/
            })

            allcmds.forEach(fo => {
                var f = nowCMDS.some(v => fo.name.toLowerCase().includes(v.toLowerCase()))

                if(!f) {
                    this.__deleteCmd(fo.id)
                }
            })

            if((this.slash) || (this.slash == "both")) {
                this.__createCommands();
            }
        } catch(e) {
            this.client.emit("gDebug", new Color("&d[GCommands Debug] &3Can't remove commands!").getText())
        }
    }

    async __deleteCmd(commandId) {
        try {
            const app = this.client.api.applications(this.client.user.id)

            await app.commands(commandId).delete()
        } catch(e) {return;}
    }

    async __getAllCommands() {
        const app = this.client.api.applications(this.client.user.id)
        return await app.commands.get()
    }
}

Structures.extend("Message", require("../structures/MessageStructure"))
Structures.extend("User", require("../structures/ClientUser"))