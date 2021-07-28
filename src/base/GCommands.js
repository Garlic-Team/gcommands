const GCommandLoader = require('../managers/GCommandLoader'), Color = require('../structures/Color'), GCommandsBase = require('./GCommandsBase'), GCommandsDispatcher = require('./GCommandsDispatcher'), { GEvents: GEventLoader } = require('@gcommands/events'), GEventHandling = require('../managers/GEventHandling'), GDatabaseLoader = require('../managers/GDatabaseLoader'), { Events } = require('../util/Constants'), GUpdater = require('../util/updater'), {msToSeconds} = require('../util/util');
const { Collection, version } = require('discord.js');
const fs = require('fs');
const ms = require('ms');

/**
 * The main GCommands class
 */
class GCommands extends GCommandsBase {
    /**
     * The GCommands class
     * @param {Client} client - Discord.js Client
     * @param {Object} options - Options (cmdDir, eventDir etc)
     */
    constructor(client, options = {}) {
        super(client, options)

        if (typeof client !== 'object') return console.log(new Color('&d[GCommands] &cNo discord.js client provided!',{json:false}).getText());
        if (!Object.keys(options).length) return console.log(new Color('&d[GCommands] &cNo default options provided!',{json:false}).getText());
        if(!options.cmdDir) return console.log(new Color('&d[GCommands] &cNo default options provided! (cmdDir)',{json:false}).getText());
        if(!options.language) return console.log(new Color('&d[GCommands] &cNo default options provided! (language (english, spanish, portuguese, russian, german, czech, slovak, turkish))',{json:false}).getText());

        /**
         * GCommandsClient
         * @type {GCommands}
        */
        this.GCommandsClient = this;

        /**
         * client
         * @type {Client}
        */
        this.client = client;

        /**
         * caseSensitiveCommands
         * @type {Boolean}
         * @default true
        */
        this.caseSensitiveCommands = Boolean(options.caseSensitiveCommands) || true

        /**
         * caseSensitivePrefixes
         * @type {Boolean}
         * @default true
        */
        this.caseSensitivePrefixes = Boolean(options.caseSensitivePrefixes) || true

        /**
         * CmdDir
         * @type {string}
        */
        this.cmdDir = options.cmdDir;

        /**
         * EventDir
         * @type {string}
         * @default undefined
        */
        this.eventDir = options.eventDir;
        this.client.discordjsversion = version;

        /**
         * unkownCommandMessage
         * @type {Boolean}
         * @default false
        */
        this.unkownCommandMessage = options.unkownCommandMessage;

        /**
         * AutoTyping
         * @type {Boolean}
         * @default false
        */
        this.autoTyping = options.autoTyping;

        /**
         * ownLanguageFile
         * @type {Object}
        */
        if(!options.ownLanguageFile) this.languageFile = require('../util/message.json');
        else this.languageFile = options.ownLanguageFile;

        /**
         * language
         * @type {Object} language
        */
        this.language = options.language;

        /**
         * database
         * @type {Object} database
         * @default undefined
        */
        this.database = options.database;

        /**
         * gcategories
         * @type {Array}
         */
        this.gcategories = fs.readdirSync(`./${this.cmdDir}`)

        /**
         * gcommands
         * @type {Collection}
         */
        this.gcommands = new Collection();

        /**
         * galiases
         * @type {Collection}
         */
        this.galiases = new Collection();

        /**
         * Prefix
         * @type {string}
         * @default undefined
         */
        this.prefix = !Array.isArray(options.slash.prefix) ? [options.slash.prefix] : options.slash.prefix;

        /**
         * Slash
         * @type {string}
         * @default false
         */
        this.slash = options.slash.slash ? options.slash.slash : false;

        /**
         * defaultCooldown
         * @type {Number}
         * @default 0
         */
        this.defaultCooldown = options.defaultCooldown ? options.defaultCooldown : 0;

        this.client.language = this.language;
        this.client.languageFile = this.languageFile;
        this.client.database = this.database
        this.client.prefixes = this.prefix;
        this.client.slash = this.slash;
        this.client.defaultCooldown = this.defaultCooldown;
        this.client.autoTyping = this.autoTyping ? msToSeconds(ms(this.autoTyping)) : null;
        this.client.gcategories = this.gcategories;
        this.client.galiases = this.galiases;
        this.client.gcommands = this.gcommands;

        process.on('uncaughtException', (error) => {
            this.emit(Events.LOG, new Color('&d[GCommands Errors] &eHandled: &a' + error + ` ${error.response ? error.response.data.message : ''} ${error.response ? error.response.data.code : ''} | use debug for full error`).getText());
            setTimeout(() => {this.emit(Events.DEBUG, error)}, 1000)
        });
        
        this.client.dispatcher = new GCommandsDispatcher(this.client);

        this.loadSys();
        GUpdater.__updater();
    }

    async loadSys() {
        new (require('../structures/GMessage')); 
        new (require('../structures/GGuild')); 

        require('../structures/DMChannel'); require('../structures/NewsChannel'); require('../structures/TextChannel');

        setTimeout(() => {
            new GDatabaseLoader(this.GCommandsClient)
            new GEventHandling(this.GCommandsClient)
            new GEventLoader(this.GCommandsClient)
            new GCommandLoader(this.GCommandsClient)
        }, 1000)
    };
}

module.exports = GCommands;