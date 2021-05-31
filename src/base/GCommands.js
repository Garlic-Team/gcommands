const { promisify } = require('util');
const path = require('path');
const GCommandLoader = require("../managers/GCommandLoader"), cmdUtils = require('../util/cmdUtils'), Color = require("../structures/Color"), GCommandsBase = require("./GCommandsBase"), GCommandsDispatcher = require("./GCommandsDispatcher"), GEvents = require("./GEvents"), GEventLoader = require("../managers/GEventLoader"), Events = require("../util/Constants"), GUpdater = require("../util/updater");

const { Collection, version } = require('discord.js');
const axios = require("axios");
const fs = require("fs");

/**
 * The main GCommands class
 */
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
        if(!options.ownLanguageFile) this.languageFile = require("../util/message.json");
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
        process.on('uncaughtException', (error) => { console.log(new Color("&d[GCommands Errors] &eHandled: &a" + error + ` ${error.response ? error.response.data.message : ""} ${error.response ? error.response.data.code : ""}`).getText());});
        this.__dbLoad();

        new GEventLoader(this.GCommandsClient)
        new GCommandLoader(this.GCommandsClient)
        this.client.dispatcher = new GCommandsDispatcher(this.client);

        GUpdater.__updater();
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
}

module.exports = GCommands;