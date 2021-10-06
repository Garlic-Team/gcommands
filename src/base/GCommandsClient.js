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
        if (!options.commands) throw new GError('[DEFAULT OPTIONS]','You must specify the command options');
        if (String(options.commands.slash) !== 'false' && !options.commands.prefix) throw new GError('[DEFAULT OPTIONS]','You must specify the commands#prefix');

        /**
         * CaseSensitiveCommands
         * @type {boolean}
         * @default true
        */
         this.caseSensitiveCommands = options.caseSensitiveCommands;

         /**
          * CaseSensitivePrefixes
          * @type {boolean}
          * @default true
         */
         this.caseSensitivePrefixes = options.caseSensitivePrefixes;

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
         * @type {boolean}
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
        this.gcategories = fs.readdirSync(this.cmdDir);

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
         * LoadFromCache
         * @type {boolean}
         * @default true
         */
        this.loadFromCache = options.commands.loadFromCache !== undefined ? Boolean(options.commands.loadFromCache) : true;

        /**
         * DefaultCooldown
         * @type {number}
         * @default 0
         */
        this.defaultCooldown = options.defaultCooldown ? options.defaultCooldown : 0;

        /**
         * Dispatcher
         * @type {GCommandsDispatcher}
         * @readonly
         */
        this.dispatcher = new GCommandsDispatcher(this, true);

        new GDatabaseLoader(this);

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
            new GEventHandling(this);
            new GEventLoader(this);
            new GCommandLoader(this);
        }, 1000);
    };
}

module.exports = GCommandsClient;
