const GCommandLoader = require('../managers/GCommandLoader'),
    Color = require('../structures/Color'),
    GCommandsDispatcher = require('./GCommandsDispatcher'),
    { GEvents: GEventLoader } = require('@gcommands/events'),
    GEventHandling = require('../managers/GEventHandling'),
    GDatabaseLoader = require('../managers/GDatabaseLoader'),
    { Events } = require('../util/Constants'),
    GUpdater = require('../util/updater');

const { Collection, Client } = require('discord.js');
const fs = require('fs');

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

        if (!options.cmdDir) return console.log(new Color('&d[GCommands] &cNo default options provided! (cmdDir)',{ json: false }).getText());
        if (!options.language) return console.log(new Color('&d[GCommands] &cNo default options provided! (language)',{ json: false }).getText());
        if (String(options.commands.slash) !== 'false' && !options.commands.prefix) return console.log(new Color('&d[GCommands] &cNo default options provided! (commands#prefix)',{ json: false }).getText());

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

        process.on('uncaughtException', error => {
            this.emit(Events.LOG, new Color(`&d[GCommands Errors] &eHandled: &a${error} ${error.response ? error.response.data.message : ''} ${error.response ? error.response.data.code : ''} | use debug for full error`).getText());
            setTimeout(() => { this.emit(Events.DEBUG, error); }, 1000);
        });

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
