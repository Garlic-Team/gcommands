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

        if (!options.loader?.cmdDir) throw new GError('[DEFAULT OPTIONS]', 'You must specify the cmdDir');
        if (!options.language) throw new GError('[DEFAULT OPTIONS]', 'You must specify the language');

        const isClientMessageEnabled = ['false', 'slash'].includes(String(options.commands?.slash));

        if (!isClientMessageEnabled && !options.commands?.prefix) throw new GError('[DEFAULT OPTIONS]', 'You must specify the commands#prefix');

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
        this.cmdDir = String(options.loader.cmdDir);

        /**
         * EventDir
         * @type {string}
         * @default undefined
        */
        this.eventDir = options.loader?.eventDir ? String(options.loader.eventDir) : undefined;

        /**
         * ModelDir
         * @type {string}
         * @default undefined
        */
        this.modelDir = options.loader?.modelDir ? String(options.loader.modelDir) : undefined;

        /**
         * LoadFromCache
         * @type {boolean}
         * @default true
         */
        this.loadFromCache = options.loader?.loadFromCache !== undefined ? Boolean(options.loader.loadFromCache) : true;

        /**
         * AutoCategory
         * @type {boolean}
         * @default false
         */
        this.autoCategory = options.loader?.autoCategory !== undefined ? Boolean(options.loader.autoCategory) : false;

        /**
         * DeleteNonExistent
         * @type {boolean}
         * @default true
         */
        this.deleteNonExistent = options.loader?.deleteNonExistent !== undefined ? Boolean(options.loader.deleteNonExistent) : true;

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
        this.prefix = options.commands?.prefix ? String(options.commands?.prefix) : undefined;

        /**
         * Slash
         * @type {string}
         * @default false
         */
        this.slash = options.commands?.slash ? options.commands?.slash : false;

        /**
         * Context
         * @type {string}
         * @default false
         */
        this.context = options.commands?.context ? options.commands?.context : false;

        /**
         * AllowDm
         * @type {boolean}
         * @default false
        */
        this.allowDm = options.commands?.allowDm !== undefined ? Boolean(options.commands?.allowDm) : false;

        /**
         * DeletePrompt
         * @type {boolean}
         * @default false
         */
        this.deletePrompt = options.arguments?.deletePrompt !== undefined ? Boolean(options.arguments?.deletePrompt) : false;

        /**
         * DeleteInput
         * @type {boolean}
         * @default false
         */
        this.deleteInput = options.arguments?.deleteInput !== undefined ? Boolean(options.arguments?.deleteInput) : false;

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
        new (require('../structures/GGuild'));
        new (require('../structures/GUser'));

        setTimeout(() => {
            new GEventHandling(this);
            new GEventLoader(this);
            new GCommandLoader(this);
        }, 1000);
    };
}

module.exports = GCommandsClient;
