const { promisify } = require('util');
const path = require('path');
const glob = promisify(require('glob'));
const Color = require("../color/Color");
const GEvents = require("./GEvents");
const Events = require('./Events');
const { Collection, Structures, APIMessage, version } = require('discord.js');
const axios = require("axios");
const fs = require("fs");

/**
 * The GCommands class
 * @class GCommands
 */
module.exports = class GCommands {

    /**
     * Creates new GCommands instance
     * @param {DiscordClient} client 
     * @param {GCommandsOptions} options 
     */
    constructor(client, options = {}) {
        if (typeof client !== 'object') return console.log(new Color("&d[GCommands] &cNo discord.js client provided!",{json:false}).getText());
        if (!Object.keys(options).length) return console.log(new Color("&d[GCommands] &cNo default options provided!",{json:false}).getText());
        if(!options.cmdDir) return console.log(new Color("&d[GCommands] &cNo default options provided! (cmdDir)",{json:false}).getText());

        if(!client) console.log(new Color("&d[GCommands] &cNo discord.js client provided!"));

        this.client = client;

        /**
         * GCommands options
         * @param {GCommandsOptions} cmdDir
         * @param {GCommandsOptions} eventDir
         * @param {GCommandsOptions} database
         * @param {GCommandsOptions} ownEvents
         * @param {GCommandsOptions} prefix
         * @param {GCommandsOptions} slash
         * @param {GCommandsOptions} cooldownMessage
         * @param {GCommandsOptions} cooldownDefault
         * @param {GCommandsOptions} errorMessage
         * @type {GCommandsOptions}
        */

        this.cmdDir = options.cmdDir;
        this.eventDir = options.eventDir;
        this.client.discordjsversion = version

        if(this.eventDir) {
            new GEvents(this.client, {
                eventDir: this.eventDir
            })
        }

        if(options.database) {
            this.client.database = {
                type: options.database.type ? options.database.type : undefined,
                url: options.database.url ? options.database.url : undefined,

                host: options.database.host ? options.database.host : undefined,
                username: options.database.username ? options.database.username : undefined,
                password: options.database.password ? options.database.password : undefined,
                databaseName: options.database.databaseName ? options.database.databaseName : undefined,
                port: options.database.port ? options.database.port : undefined,

                working: false
            };
        } else {
            this.client.database = {
                type:  undefined,
                url: undefined,
                working: false
            };
        }

        if(options.ownEvents) {
            this.ownEvents = true;
        } else {
            this.ownEvents = false;
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

        process.setMaxListeners(50);
        this.__loadCommands();
        this.__dbLoad();

        Events.loadMoreEvents(this.client)
        if(!this.ownEvents) {
            Events.normalCommands(this.client, this.client.slash, this.client.commands, this.client.aliases, this.client.cooldowns, this.client.errorMessage, this.client.cooldownMessage, this.client.cooldownDefault, this.client.prefix)
            Events.slashCommands(this.client, this.client.slash, this.client.commands, this.client.cooldowns, this.client.errorMessage, this.client.cooldownMessage, this.client.cooldownDefault)
        }
    }

    /**
     * Internal method to dbLoad
     * @private
     */
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
        } else if(this.client.database.type == "mariadb") {
            var mariaDb = require("quick-mariadb");
            this.client.database.working = true;
            this.client.database.mariadb = mariaDb;
            this.client.database.mariadbOptions = {
                host: this.client.database.host,
                user: this.client.database.username,
                password: this.client.database.password,
                database: this.client.database.databaseName,
                port: this.client.database.port
            }
        }
    }

    /**
     * Internal method to loadCommands
     * @private
     */
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
                                console.log(new Color("&d[GCommands] &cCan't load " + name).getText());
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

    /**
     * Internal method to createCommands
     * @private
     */
    async __createCommands() {
        var po = await this.__getAllCommands();

        let keys = Array.from(this.client.commands.keys());

        keys.forEach(async (cmdname) => {
            var options = [];
            var subCommandGroup = {};
            var subCommand = [];
            const cmd = this.client.commands.get(cmdname)
            if(cmd.slash != undefined && (cmd.slash == false)) return;

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

            if (cmd.expectedArgs) {
                if(typeof cmd.expectedArgs == "object") {
                    cmd.expectedArgs.forEach(option => {
                        options.push({
                            name: option.name,
                            description: option.description,
                            type: option.choices ? 3 : parseInt(option.type),
                            required: option.required ? option.required : false,
                            choices: option.choices ? option.choices : []
                        })
                    })
                } else {
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
                        required: a < cmd.minArgs ? cmd.minArgs : 0,
                    })
                    }
                }
            }

            if(cmd.subCommand) {
                cmd.subCommand.forEach(sc => {
                    try {
                        var opt = []
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

                                opt.push({
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
                            options: opt || []
                        })
                    } catch(e) {
                        this.client.emit("gDebug", new Color("[GCommands DEBUG] " + e + " &eignor!").getText())
                        subCommand.push({
                            name: sc.name,
                            description: sc.description,
                            type: 1,
                            options: sc.options || []
                        })
                    }
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
                    console.log(new Color("&d[GCommands] &cRequest failed! " + error + " &e("+cmd.name+")", {json:false}).getText());

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

    /**
     * Internal method to tryAgain
     * @private
    */
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

    /**
     * Internal method to deleteAllCmds
     * @private
    */
    async __deleteAllCmds() {
        try {
            var allcmds = await this.__getAllCommands();
            if(!this.client.slash) {
                allcmds.forEach(fo => {
                    this.__deleteCmd(fo.id)
                })
            }

            var nowCMDS = [];

            let keys = Array.from(this.client.commands.keys());
            keys.forEach(cmdname => {
                nowCMDS.push(cmdname)

                if(this.client.commands.get(cmdname).slash == false) {
                    allcmds.forEach(fo => {
                        if(fo.name == cmdname) {
                            this.__deleteCmd(fo.id)
                        }
                    })
                }
            })

            allcmds.forEach(fo => {
                var f = nowCMDS.some(v => fo.name.toLowerCase().includes(v.toLowerCase()))

                if(!f) {
                    this.__deleteCmd(fo.id)
                }
            })

            if((this.client.slash) || (this.client.slash == "both")) {
                this.__createCommands();
            }

            console.log(new Color("&d[GCommands TIP] &3Are guild commands not deleted when you delete them? Use this site for remove &ehttps://gcommands-slash-gui.netlify.app/"))
        } catch(e) {
            this.client.emit("gDebug", new Color("&d[GCommands Debug] &3Can't remove commands!").getText())
        }
    }

    /**
     * Internal method to deleteCmd
     * @private
    */
    async __deleteCmd(commandId) {
        try {
            const app = this.client.api.applications(this.client.user.id)

            await app.commands(commandId).delete()
        } catch(e) {return;}
    }

    /**
     * Internal method to getAllCmds
     * @returns {object}
     * @private
    */
    async __getAllCommands() {
        const app = this.client.api.applications(this.client.user.id)
        return await app.commands.get()
    }
}

Structures.extend("Message", require("../structures/MessageStructure"))
Structures.extend("User", require("../structures/ClientUser"))