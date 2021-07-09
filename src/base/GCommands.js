const GCommandLoader = require("../managers/GCommandLoader"), Color = require("../structures/Color"), GCommandsBase = require("./GCommandsBase"), GCommandsDispatcher = require("./GCommandsDispatcher"), GEventLoader = require("../managers/GEventLoader"), GEventHandling = require("../managers/GEventHandling"), GDatabaseLoader = require("../managers/GDatabaseLoader"), { Events } = require("../util/Constants"), GUpdater = require("../util/updater"), {msToSeconds} = require("../util/util");
const { Collection, version } = require('discord.js');
const axios = require("axios");
const fs = require("fs");
const ms = require("ms");

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
        this.client.discordjsversion = version;

        /**
         * unkownCommandMessage
         * @property {String} unkownCommandMessage
        */
        this.unkownCommandMessage = options.unkownCommandMessage;

        /**
         * AutoTyping
         * @property {Boolean} autoTyping
        */
        this.autoTyping = options.autoTyping;

        /**
         * ownLanguageFile
         * @property {Object} ownLanguageFile
        */
        if(!options.ownLanguageFile) this.languageFile = require("../util/message.json");
        else this.languageFile = options.ownLanguageFile;
        this.language = options.language;

        /**
         * ShardClusterName
         * @property {String} shardClusterName
        */
        this.shardClusterName = options.shardClusterName || "shard";

        /**
         * database
         * @property {Object} database
        */
        this.database = options.database || undefined;

        /**
         * gcategories
         * @property {Array}
         */
        this.client.gcategories = fs.readdirSync(`./${this.cmdDir}`)

        /**
         * gcommands
         * @property {Collection}
         */
        this.client.gcommands = new Collection();

        /**
         * galiases
         * @property {Collection}
         */
        this.client.galiases = new Collection();

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
         * defaultCooldown
         * @property {Number} defaultCooldown
         */
        this.defaultCooldown = options.defaultCooldown ? options.defaultCooldown : 0;

        this.client.language = this.language;
        this.client.languageFile = this.languageFile;
        this.client.database = this.database
        this.client.prefix = this.prefix;
        this.client.slash = this.slash;
        this.client.defaultCooldown = this.defaultCooldown;
        this.client.autoTyping = this.autoTyping ? msToSeconds(ms(this.autoTyping)) : null;

        process.on('uncaughtException', (error) => {
            this.emit(Events.LOG, new Color("&d[GCommands Errors] &eHandled: &a" + error + ` ${error.response ? error.response.data.message : ""} ${error.response ? error.response.data.code : ""} | use debug for full error`).getText());
            setTimeout(() => {this.emit(Events.DEBUG, error)}, 1000)
        });
        
        this.client.dispatcher = new GCommandsDispatcher(this.client);

        setTimeout(() => { this.loadSys() }, 1000)
        GUpdater.__updater();
    }

    async loadSys() {
        require("../structures/GMessage"); require("../structures/GGuild"); require("../structures/DMChannel"); require("../structures/NewsChannel"); require("../structures/TextChannel");
        new GDatabaseLoader(this.GCommandsClient)
        new GEventHandling(this.GCommandsClient)
        new GEventLoader(this.GCommandsClient)
        new GCommandLoader(this.GCommandsClient)
    };
}

module.exports = GCommands;