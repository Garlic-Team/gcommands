const GCommandLoader = require('../managers/GCommandLoader'),
  GCommandsDispatcher = require('./GCommandsDispatcher'),
  { GEvents: GEventLoader } = require('@gcommands/events'),
  { GComponents } = require('@gcommands/components'),
  GEventHandling = require('../managers/GEventHandling'),
  GDatabaseLoader = require('../managers/GDatabaseLoader'),
  GUpdater = require('../util/updater');

const { Collection, Client } = require('discord.js');
const fs = require('fs');
const GError = require('../structures/GError');

/**
 * The main hub for interacting with the Discord API, and the starting point for any bot.
 * @extends Client
 */
class GCommandsClient extends Client {
  /**
   * @param {GCommandsOptions} options Options for the client
   * @constructor
   */
  constructor(options = {}) {
    super(options);

    if (!options.loader?.cmdDir) throw new GError('[DEFAULT OPTIONS]', 'You must specify the cmdDir');
    if (!options.language) throw new GError('[DEFAULT OPTIONS]', 'You must specify the language');

    const isClientMessageEnabled = ['false', 'both'].includes(String(options.commands?.slash));

    if (isClientMessageEnabled && !options.commands?.prefix) {
      throw new GError(
        '[DEFAULT OPTIONS]',
        'You must specify the commands#prefix',
      );
    }

    /**
     * The path to the command files
     * @type {string}
     */
    this.cmdDir = String(options.loader.cmdDir);

    /**
     * The path to the event files
     * @type {string}
     * @default undefined
     */
    this.eventDir =
      options.loader?.eventDir !== undefined
        ? String(options.loader.eventDir)
        : undefined;

    /**
     * The path to the component files
     * @type {string}
     * @default undefined
     */
    this.componentDir =
      options.loader?.componentDir !== undefined
        ? String(options.loader.componentDir)
        : undefined;

    /**
     * Wheter loading from cache is enabled
     * @type {boolean}
     * @default true
     */
    this.loadFromCache =
      options.loader?.loadFromCache !== undefined
        ? Boolean(options.loader.loadFromCache)
        : true;

    /**
     * Wheter auto category is enabled
     * @type {boolean}
     * @default false
     */
    this.autoCategory =
      options.loader?.autoCategory !== undefined
        ? Boolean(options.loader.autoCategory)
        : false;

    /**
     * Wheter auto deleting non existent commands is enabled
     * @type {boolean}
     * @default true
     */
    this.deleteNonExistent =
      options.loader?.deleteNonExistent !== undefined
        ? Boolean(options.loader.deleteNonExistent)
        : true;

    /**
     * The own language file
     * @type {?Object}
     */
    this.languageFile =
      options.ownLanguageFile
        ? options.ownLanguageFile
        : require('../util/message.json');

    /**
     * The default language
     * @type {Object} language
     */
    this.language = options.language;

    /**
     * The database
     * @type {Object} database
     * @default undefined
     */
    this.database = options.database;

    /**
     * All the categories
     * @type {Array}
     */
    this.gcategories = fs.readdirSync(this.cmdDir);

    /**
     * All the commands
     * @type {Collection}
     */
    this.gcommands = new Collection();

    /**
     * All the aliases of commands
     * @type {Collection}
     */
    this.galiases = new Collection();

    /**
     * The default prefix
     * @type {string}
     * @default undefined
     */
    this.prefix = options.commands?.prefix
      ? String(options.commands.prefix)
      : undefined;

    /**
     * Wheter slash commands are enabled
     * @type {string}
     * @default false
     */
    this.slash = options.commands?.slash
      ? String(options.commands.slash)
      : false;

    /**
     * Wheter context menu's are enabled
     * @type {string}
     * @default false
     */
    this.context =
      options.commands?.context !== undefined
        ? String(options.commands.context)
        : false;

    /**
     * Wheter commands in DM are enabled
     * @type {boolean}
     * @default false
     */
    this.allowDm =
      options.commands?.allowDm !== undefined
        ? Boolean(options.commands.allowDm)
        : false;

    /**
     * Whether case sensitive commands is enabled
     * @type {boolean}
     * @default false
     */
    this.caseSensitiveCommands =
      options.commands?.caseSensitiveCommands !== undefined
        ? Boolean(options.commands?.caseSensitiveCommands)
        : false;

    /**
     * Wheter case sensitive prefix is enabled
     * @type {boolean}
     * @default false
     */
    this.caseSensitivePrefixes =
      options.caseSensitivePrefixes !== undefined
        ? Boolean(options.caseSensitivePrefixes)
        : false;

    /**
     * Wheter deleting the prompt is enabled
     * @type {boolean}
     * @default false
     */
    this.deletePrompt =
      options.arguments?.deletePrompt !== undefined
        ? Boolean(options.arguments.deletePrompt)
        : false;

    /**
     * Wheter deleting the input is enabled
     * @type {boolean}
     * @default false
     */
    this.deleteInput =
      options.arguments?.deleteInput !== undefined
        ? Boolean(options.arguments.deleteInput)
        : false;

    /**
     * How long a user has to respond to a argument prompt
     * @type {boolean}
     * @default 30000
     */
    this.wait =
      options.arguments?.wait !== undefined
        ? Number(options.arguments.wait)
        : 30000;

    /**
     * The default cooldown
     * @type {number}
     * @default '0s'
     */
    this.defaultCooldown =
      options.defaultCooldown !== undefined
        ? String(options.defaultCooldown)
        : '0s';

    /**
     * The dispatcher
     * @type {GCommandsDispatcher}
     * @private
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
    new (require('../structures/GGuild'))();

    setTimeout(() => {
      new GEventHandling(this);
      if (this.eventDir) new GEventLoader(this);
      if (this.componentDir) new GComponents(this, { dir: this.componentDir });
      new GCommandLoader(this);
    }, 1000);
  }
}

module.exports = GCommandsClient;
