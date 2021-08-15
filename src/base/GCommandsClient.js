const GCommandLoader = require('../managers/GCommandLoader'),
    GCommandsDispatcher = require('./GCommandsDispatcher'),
    { GEvents: GEventLoader } = require('@gcommands/events'),
    GEventHandling = require('../managers/GEventHandling'),
    GDatabaseLoader = require('../managers/GDatabaseLoader'),
    GUpdater = require('../util/updater');

const { Collection, Client } = require('discord.js');
const fs = require('fs');
const GError = require('../structures/GError');

/**
 * The main GCommandsClient class
 * @extends Client
 */
class GCommandsClient extends Client {
    /**
     * The GCommandsClient class
     * @param {GCommandsOptions} options - Options (Discord.js client options, GCommandOptions)
     */
    constructor(options = {}) {
        super(options);

        if (!options.cmdDir) throw new GError('[DEFAULT OPTIONS]','You must specify the cmdDir');
        if (!options.language) throw new GError('[DEFAULT OPTIONS]','You must specify the language');
        if (String(options.commands.slash) !== 'false' && !options.commands.prefix) throw new GError('[DEFAULT OPTIONS]','You must specify the commands#prefix');

        /**
         * GCommandsClient
         * @type {GCommands}
        */
        this.GCommandsClient = this;
        this.GCommandsClient.client = this;
        this.client = this;

        /**
         * CaseSensitiveCommands
         * @type {Boolean}
         * @default true
        */
        this.caseSensitiveCommands = options.caseSensitiveCommands ? Boolean(options.caseSensitiveCommands) : true;

        /**
         * CaseSensitivePrefixes
         * @type {Boolean}
         * @default true
        */
        this.caseSensitivePrefixes = options.caseSensitivePrefixes ? Boolean(options.caseSensitivePrefixes) : true;

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

        /**
         * AutoTyping
         * @type {Boolean}
         * @default false
        */
        this.autoTyping = options.autoTyping;

        /**
         * OwnLanguageFile
         * @type {Object}
        */
        if (!options.ownLanguageFile) this.languageFile = require('../util/message.json');
        else this.languageFile = options.ownLanguageFile;

        /**
         * Language
         * @type {Object} language
        */
        this.language = options.language;

        /**
         * Database
         * @type {Object} database
         * @default undefined
        */
        this.database = options.database;

        /**
         * Gcategories
         * @type {Array}
         */
        this.gcategories = fs.readdirSync(`./${this.cmdDir}`);

        /**
         * Gcommands
         * @type {Collection}
         */
        this.gcommands = new Collection();

        /**
         * Galiases
         * @type {Collection}
         */
        this.galiases = new Collection();

        /**
         * Prefix
         * @type {string}
         * @default undefined
         */
        this.prefix = !Array.isArray(options.commands.prefix) ? Array(options.commands.prefix) : options.commands.prefix;

        /**
         * Slash
         * @type {string}
         * @default false
         */
        this.slash = options.commands.slash ? options.commands.slash : false;

        /**
         * Context
         * @type {string}
         * @default false
         */
        this.context = options.commands.context ? options.commands.context : false;

        /**
         * DefaultCooldown
         * @type {Number}
         * @default 0
         */
        this.defaultCooldown = options.defaultCooldown ? options.defaultCooldown : 0;

        /**
         * Dispatcher
         * @type {GCommandsDispatcher}
         * @readonly
         */
        this.dispatcher = new GCommandsDispatcher(this.GCommandsClient, true);

        new GDatabaseLoader(this.GCommandsClient);

        setImmediate(() => {
            super.on('ready', () => {
                this.loadSys();
            });
        });
        GUpdater.__updater();
    }

    loadSys() {
        new (require('../structures/GMessage'));
        new (require('../structures/GGuild'));

        require('../structures/DMChannel');
        require('../structures/NewsChannel');
        require('../structures/TextChannel');
        require('../structures/ThreadChannel');

        setTimeout(() => {
            new GEventHandling(this.GCommandsClient);
            new GEventLoader(this.GCommandsClient);
            new GCommandLoader(this.GCommandsClient);
        }, 1000);
    };
}

module.exports = GCommandsClient;
