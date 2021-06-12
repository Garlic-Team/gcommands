const GCommandLoader = require("../managers/GCommandLoader"), Color = require("../structures/Color"), GCommandsBase = require("./GCommandsBase"), GCommandsDispatcher = require("./GCommandsDispatcher"), GEvents = require("./GEvents"), GEventLoader = require("../managers/GEventLoader"), GDatabaseLoader = require("../managers/GDatabaseLoader"), { Events } = require("../util/Constants"), GUpdater = require("../util/updater");
const { Collection, version, Client } = require('discord.js');
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

        if (typeof client != "object") return console.log(new Color("&d[GCommands] &cNo discord.js client provided!",{json:false}).getText());
        if (!Object.keys(options).length) return console.log(new Color("&d[GCommands] &cNo default options provided!",{json:false}).getText());
        if(!options.cmdDir) return console.log(new Color("&d[GCommands] &cNo default options provided! (cmdDir)",{json:false}).getText());
        if(!options.language) return console.log(new Color("&d[GCommands] &cNo default options provided! (language (english, spanish, portuguese, russian, german, czech, slovak, turkish))",{json:false}).getText());

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
        process.on('uncaughtException', (error) => {
            console.log(new Color("&d[GCommands Errors] &eHandled: &a" + error + ` ${error.response ? error.response.data.message : ""} ${error.response ? error.response.data.code : ""} | use debug for full error`).getText());
            setTimeout(() => {this.emit(Events.DEBUG, error)}, 1000)
        });
        
        setTimeout(() => {
            this.client.dispatcher = new GCommandsDispatcher(this.client);
            new GDatabaseLoader(this.GCommandsClient);
            new GEventLoader(this.GCommandsClient);
            new GCommandLoader(this.GCommandsClient);
        }, 1000)

        GUpdater.__updater();
    }
}

module.exports = GCommands;