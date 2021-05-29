const { promisify } = require('util');
const path = require('path');
const Color = require("./utils/color/Color");
const EventLoader = require('./utils/EventLoader');
const cmdUtils = require('./utils/cmdUtils');
const Updater = require('./utils/updater');
const GCommandsDispatcher = require("./GCommandsDispatcher")
const GCommandsBase = require("./GCommandsBase")
const { Events } = require("./utils/Constants")
const GEvents = require("./GEvents")
const { Collection, version } = require('discord.js');
const axios = require("axios");
const fs = require("fs");

/* GCommands Class */
class GCommands extends GCommandsBase {
    /**
     * The GCommands class
     * @param {Object} client - Discord.js Client
     * @param {Object} options - Options (cmdDir, eventDir etc)
     */
    constructor(client, options = {}) {
        super(client, options)

        if (typeof client !== 'object') return console.log(new Color("&d[GCommands] &cNo discord.js client provided!",{json:false}).getText());
        if (!Object.keys(options).length) return console.log(new Color("&d[GCommands] &cNo default options provided!",{json:false}).getText());
        if(!options.cmdDir) return console.log(new Color("&d[GCommands] &cNo default options provided! (cmdDir)",{json:false}).getText());
        if(!options.language) return console.log(new Color("&d[GCommands] &cNo default options provided! (language (english, spanish, portuguese, russian, german, czech, slovak))",{json:false}).getText());

        if(!client) console.log(new Color("&d[GCommands] &cNo discord.js client provided!"));
        this.GCommandsClient = this;
        this.client = client;

        /**
         * CmdDir
         * @property {String} cmdDir
        */
        this.cmdDir = options.cmdDir;

        /**
         * EventDir
         * @property {String} eventDir
         */
        this.eventDir = options.eventDir;
        this.client.discordjsversion = version

        /**
         * unkownCommandMessage
         * @property {String} unkownCommandMessage
         */
        this.unkownCommandMessage = options.unkownCommandMessage;

        /**
         * ownLanguageFile
         * @property {Object} ownLanguageFile
         */
        if(!options.ownLanguageFile) this.languageFile = require("./utils/message.json");
        else this.languageFile = options.ownLanguageFile;
        this.language = options.language;

        if(this.eventDir) {
            new GEvents(this.GCommandsClient, {
                eventDir: this.eventDir
            })
        }

        /**
         * database
         * @property {Object} database
         */
         this.database = {
            type:  undefined,
            url: undefined,
            host: undefined,
            username: undefined,
            password: undefined,
            databaseName: undefined,
            port: undefined,
            working: false
        };
        
        if(options.database) {
            this.database = {
                type: options.database.type ? options.database.type : undefined,
                url: options.database.url ? options.database.url : undefined,
                host: options.database.host ? options.database.host : undefined,
                username: options.database.username ? options.database.username : undefined,
                password: options.database.password ? options.database.password : undefined,
                databaseName: options.database.databaseName ? options.database.databaseName : undefined,
                port: options.database.port ? options.database.port : undefined,
                working: false
            };
        }

        this.client.categories = fs.readdirSync("./" + this.cmdDir );
        this.client.commands = new Collection();
        this.client.aliases = new Collection();

        /**
         * Prefix
         * @property {String} prefix
         */
        this.prefix = options.slash.prefix ? options.slash.prefix : undefined;

        /**
         * Slash
         * @property {String} slash
         */
        this.slash = options.slash.slash ? options.slash.slash : false;

        /**
         * cooldownDefault
         * @property {Number} cooldownDefault
         */
        this.cooldownDefault = options.defaultCooldown ? options.defaultCooldown : 0;

        this.GCommandsClient.unkownCommandMessage = this.unkownCommandMessage;
        this.client.language = this.language;
        this.client.languageFile = this.languageFile;
        this.client.database = this.database
        this.client.prefix = this.prefix;
        this.client.slash = this.slash;
        this.client.cooldownDefault = this.cooldownDefault;


        process.setMaxListeners(50);
        process.on('uncaughtException', (error) => { console.log(new Color("&d[GCommands Errors] &eHandled: &a" + error).getText()) });
        this.__loadCommands();
        this.__dbLoad();

        new EventLoader(this.GCommandsClient)
        this.client.dispatcher = new GCommandsDispatcher(this.client);

        Updater.__updater();
    }

    /**
     * Internal method to dbLoad
     * @returns {boolean}
     * @private
     */
    async __dbLoad() {
        if(this.client.database.type == "mongodb") {
            var mongoose = require("mongoose")
            mongoose.connect(this.client.database.url, { useNewUrlParser: true, useUnifiedTopology: true })
                .then((connection) => {
                    console.log(new Color("&d[GCommands] &aMongodb loaded!",{json:false}).getText());
                    this.client.database.working = true;
                    return true;
                })
                .catch((e) => {
                    console.log(new Color("&d[GCommands] &cMongodb url is not valid.",{json:false}).getText());
                    this.client.database.working = false;
                    return false;
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
     * @returns {void}
     * @private
     */
    async __loadCommands() {
        fs.readdirSync(`${__dirname}/../../../${this.cmdDir}`).forEach(async(dir) => {
            var file;
            var fileName = dir.split(".").reverse()[1]
            var fileType = dir.split(".").reverse()[0]
            if(fileType == "js" || fileType == "ts") {
                try {
                    file = await require(`../../../${this.cmdDir}${dir}`);

                    if (file.aliases && Array.isArray(file.aliases)) file.aliases.forEach(alias => this.client.aliases.set(alias, file.name));
                    this.client.commands.set(file.name, file);
                    console.log(new Color("&d[GCommands] &aLoaded (File): &e➜   &3" + fileName, {json:false}).getText());
                } catch(e) {
                    this.emit(Events.DEBUG, new Color("&d[GCommands Debug] "+e).getText());
                    console.log(new Color("&d[GCommands] &cCan't load " + fileName).getText());
                }
            } else {
                fs.readdirSync(`${this.cmdDir}${dir}`).forEach(async(file) => {
                    fileName = file.split(".").reverse()[1];
                    try {
                        file = await require(`../../../${this.cmdDir}${dir}/${file}`);
    
                        if (file.aliases && Array.isArray(file.aliases)) file.aliases.forEach(alias => this.client.aliases.set(alias, file.name));
                        this.client.commands.set(file.name, file);
                        console.log(new Color("&d[GCommands] &aLoaded (File): &e➜   &3" + fileName, {json:false}).getText());
                    } catch(e) {
                        console.log(e)
                        this.emit(Events.DEBUG, new Color("&d[GCommands Debug] "+e).getText());
                        console.log(new Color("&d[GCommands] &cCan't load " + fileName).getText());
                    }
                })
            }
        })

        this.__deleteAllGlobalCmds();
    }

    /**
     * Internal method to createCommands
     * @returns {void}
     * @private
     */
    async __createCommands() {
        this.emit(Events.DEBUG, new Color("&d[GCommands] &3Creating slash commands...").getText())
        let keys = Array.from(this.client.commands.keys());

        keys.forEach(async (cmdname) => {
            this.emit(Events.DEBUG, new Color("&d[GCommands] &3Creating slash command (&e"+cmdname+"&3)").getText());
            var options = [];
            var subCommandGroup = {};
            var subCommand = [];
            const cmd = this.client.commands.get(cmdname)
            if(cmd.slash != undefined && (cmd.slash == false || cmd.slash == "false")) return;

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
                            choices: option.choices ? option.choices : [],
                            options: option.options ? option.options : []
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
                                this.emit(Events.DEBUG, new Color([
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
                                this.emit(Events.DEBUG, new Color([
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
     * @returns {void}
     * @private
    */
    async __tryAgain(cmd, config) {
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
                }
            }
        })
    }

    /**
     * Internal method to deleteAllGlobalCmds
     * @returns {void}
     * @private
    */
     async __deleteAllGlobalCmds() {
        try {
            var allcmds = await cmdUtils.__getAllCommands(this.client);
            if(!this.client.slash) {
                allcmds.forEach(cmd => {
                    cmdUtils.__deleteCmd(this.client, cmd.id)
                })
            }

            var nowCMDS = [];

            var keys = Array.from(this.client.commands.keys());
            keys.forEach(cmdname => {
                nowCMDS.push(cmdname)

                if(this.client.commands.get(cmdname).slash == false || this.client.commands.get(cmdname).slash == "false") {
                    allcmds.forEach(cmd => {
                        if(cmd.name == cmdname) {
                            cmdUtils.__deleteCmd(this.client, cmd.id)
                        }
                    })
                }
            })

            allcmds.forEach(cmd => {
                var f = nowCMDS.some(v => cmd.name.toLowerCase().includes(v.toLowerCase()))

                if(!f) {
                    cmdUtils.__deleteCmd(this.client, cmd.id)
                }
            })
        } catch(e) {
            this.emit(Events.DEBUG, new Color("&d[GCommands Debug] &3Can't remove global commands!").getText())
        }

        this.__deleteAllGuildCmds()
    }

    /**
     * Internal method to deleteAllGuildCmds
     * @returns {void}
     * @private
    */
    async __deleteAllGuildCmds() {
        try {
            this.client.guilds.forEach(async(guild) => {
                var allcmds = await cmdUtils.__getAllCommands(this.client, guild.id);

                if(!this.client.slash) {
                    allcmds.forEach(cmd => {
                        cmdUtils.__deleteCmd(this.client, cmd.id, guild.id)
                    })
                }

                var nowCMDS = [];

                var keys = Array.from(this.client.commands.keys());
                keys.forEach(cmdname => {
                    nowCMDS.push(cmdname)

                    if(this.client.commands.get(cmdname).slash == false || this.client.commands.get(cmdname).slash == "false") {
                        allcmds.forEach(cmd => {
                            if(fo.name == cmdname) {
                                cmdUtils.__deleteCmd(this.client, cmd.id, guild.id)
                            }
                        })
                    }
                })

                allcmds.forEach(cmd => {
                    var f = nowCMDS.some(v => cmd.name.toLowerCase().includes(v.toLowerCase()))

                    if(!f) {
                        cmdUtils.__deleteCmd(this.client, cmd.id, guild.id)
                    }
                })
            })

            console.log(new Color("&d[GCommands TIP] &3Are guild commands not deleted when you delete them? Use this site for remove &ehttps://gcommands-slash-gui.netlify.app/").getText())
            if((this.client.slash) || (this.client.slash == "both")) {
                this.__createCommands();
            }
        } catch(e) {
            this.emit(Events.DEBUG, new Color("&d[GCommands Debug] &3Can't remove guild commands!").getText())

            if((this.client.slash) || (this.client.slash == "both")) {
                this.__createCommands();
            }
        }
    }
}

module.exports = GCommands;