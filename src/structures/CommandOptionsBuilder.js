const { resolveString } = require('../util/util');

/**
 * The builder for a command
 */
class CommandOptionsBuilder {
  /**
   * @param {CommandOptions} data
   * @constructor
  */
  constructor(data = {}) {
    this.setup(data);
  }

  /**
   * Setup function
   * @param {CommandOptions} data
   * @returns {CommandOptions}
   * @private
   */
  setup(data) {
    /**
      * The name
      * @type {string}
     */
    this.name = 'name' in data ? resolveString(data.name) : null;

    /**
      * The context menu name
      * @type {string}
     */
    this.contextMenuName = 'contextMenuName' in data ? resolveString(data.contextMenuName) : null;

    /**
      * The description
      * @type {string}
     */
    this.description = 'description' in data ? resolveString(data.description) : null;

    /**
     * The usage
     * @type {string}
    */
    this.usage = 'usage' in data ? resolveString(data.usage) : null;

    /**
      * The arguments
      * @type {Array<CommandArgsOption>}
     */
    this.args = 'args' in data ? data.args : null;

    /**
      * Whether always obtain is enabled
      * @type {boolean}
     */
    this.alwaysObtain = 'alwaysObtain' in data ? data.alwaysObtain : null;

    /**
      * The cooldown
      * @type {string}
     */
    this.cooldown = 'cooldown' in data ? resolveString(data.cooldown) : null;

    /**
      * The category
      * @type {string}
     */
    this.category = 'category' in data ? resolveString(data.category) : null;

    /**
      * The aliases
      * @type {Array}
     */
    this.aliases = 'aliases' in data ? data.aliases : null;

    /**
      * The permissions required by a user
      * @type {string | Array}
     */
    this.userRequiredPermissions = 'userRequiredPermissions' in data ? data.userRequiredPermissions : null;

    /**
      * The roles required by a user
      * @type {string | Array}
     */
    this.userRequiredRoles = 'userRequiredRoles' in data ? data.userRequiredRoles : null;

    /**
      * The permissions required by the client
      * @type {string | Array}
     */
    this.clientRequiredPermissions = 'clientRequiredPermissions' in data ? data.clientRequiredPermissions : null;

    /**
      * The users who can use this command
      * @type {Snowflake | Array}
     */
    this.userOnly = 'userOnly' in data ? data.userOnly : null;

    /**
      * The channels in wich this command can get used
      * @type {Snowflake | Array}
     */
    this.channelOnly = 'channelOnly' in data ? data.channelOnly : null;

    /**
      * The guilds in wich this command can get used
      * @type {Snowflake}
     */
    this.guildOnly = 'guildOnly' in data ? data.guildOnly : null;

    /**
      * Wheter the command can only be used inside a text channel
      * @type {boolean}
     */
    this.channelTextOnly = 'channelTextOnly' in data ? Boolean(data.channelTextOnly) : null;

    /**
      * Wheter the command can only be used inside a news channel
      * @type {boolean}
     */
    this.channelNewsOnly = 'channelNewsOnly' in data ? Boolean(data.channelNewsOnly) : null;

    /**
      * Wheter the command can only be used inside a thread channel
      * @type {boolean}
     */
    this.channelThreadOnly = 'channelThreadOnly' in data ? Boolean(data.channelThreadOnly) : null;

    /**
      * Wheter the command can be used in DM's
      * @type {boolean}
     */
    this.allowDm = 'allowDm' in data ? Boolean(data.allowDm) : null;

    /**
      * Wheter this command can be only be used inside NSFW channels
      * @type {boolean}
     */
    this.nsfw = 'nsfw' in data ? Boolean(data.nsfw) : null;

    /**
      * Wheter this command should be a slash command
      * @type {boolean}
     */
    this.slash = 'slash' in data ? Boolean(data.slash) : null;

    /**
      * Wheter this command should be a context menu
      * @type {string | boolean}
     */
    this.context = 'context' in data ? data.context : null;

    return this.toJSON();
  }

  /**
   * Method to set name
   * @param {string} name
  */
  setName(name) {
    this.name = resolveString(name);
    return this;
  }

  /**
   * Method to set context menu name
   * @param {string} contextMenuName
  */
  setContextMenuName(contextMenuName) {
    this.contextMenuName = resolveString(contextMenuName);
    return this;
  }

  /**
   * Method to set description
   * @param {string} description
  */
  setDescription(description) {
    this.description = resolveString(description);
    return this;
  }

  /**
   * Method to set usage
   * @param {string} usage
  */
  setUsage(usage) {
    this.usage = resolveString(usage);
    return this;
  }

  /**
   * Method to add arg
   * @param {CommandArgsOption} arg
  */
  addArg(arg) {
    if (!Array.isArray(this.args)) this.args = [];
    this.args.push(arg);
    return this;
  }

  /**
   * Method to add args
   * @param {Array<CommandArgsOption>} args
  */
  addArgs(args) {
    for (const arg of Object.values(args)) {
      this.addArg(arg);
    }
    return this;
  }

  /**
   * Method to set always obtain
   * @param {boolean} alwaysObtain
  */
  setAlwaysObtain(alwaysObtain) {
    this.alwaysObtain = Boolean(alwaysObtain);
    return this;
  }

  /**
   * Method to set cooldown
   * @param {string} cooldown
  */
  setCooldown(cooldown) {
    this.cooldown = resolveString(cooldown);
    return this;
  }

  /**
   * Method to set category
   * @param {string} category
  */
  setCategory(category) {
    this.category = resolveString(category);
    return this;
  }

  /**
   * Method to set aliases
   * @param {Array} aliases
  */
  setAliases(aliases) {
    this.aliases = aliases;
    return this;
  }

  /**
   * Method to set user required permissions
   * @param {string | Array} permissions
  */
  setUserRequiredPermissions(permissions) {
    this.userRequiredPermissions = permissions;
    return this;
  }

  /**
   * Method to set user required roles
   * @param {string | Array} roles
  */
  setUserRequiredRoles(roles) {
    this.userRequiredRoles = roles;
    return this;
  }

  /**
   * Method to set client required permissions
   * @param {string | Array} permissions
  */
  setClientRequiredPermissions(permissions) {
    this.clientRequiredPermissions = permissions;
    return this;
  }

  /**
   * Method to set user only
   * @param {Snowflake | Array} userOnly
  */
  setUserOnly(userOnly) {
    this.userOnly = userOnly;
    return this;
  }

  /**
   * Method to set channel only
   * @param {Snowflake | Array} channelOnly
  */
  setChannelOnly(channelOnly) {
    this.channelOnly = channelOnly;
    return this;
  }

  /**
   * Method to set guild only
   * @param {Snowflake | Array} guildOnly
  */
  setGuildOnly(guildOnly) {
    this.guildOnly = guildOnly;
    return this;
  }

  /**
   * Method to set channel text only
   * @param {boolean} channelTextOnly
  */
  setChannelTextOnly(channelTextOnly) {
    this.channelTextOnly = Boolean(channelTextOnly);
    return this;
  }

  /**
   * Method to set channel news only
   * @param {boolean} channelNewsOnly
  */
  setChannelNewsOnly(channelNewsOnly) {
    this.channelNewsOnly = Boolean(channelNewsOnly);
    return this;
  }

  /**
   * Method to set channel thread only
   * @param {boolean} channelThreadOnly
  */
  setChannelThreadOnly(channelThreadOnly) {
    this.channelThreadOnly = Boolean(channelThreadOnly);
    return this;
  }

  /**
   * Method to set allow DM
   * @param {boolean} allowDm
  */
   setAllowDm(allowDm) {
    this.allowDm = Boolean(allowDm);
    return this;
  }

  /**
   * Method to set nsfw
   * @param {boolean} nsfw
  */
  setNsfw(nsfw) {
    this.nsfw = Boolean(nsfw);
    return this;
  }

  /**
   * Method to set slash
   * @param {boolean} slash
  */
  setSlash(slash) {
    this.slash = Boolean(slash);
    return this;
  }

  /**
   * Method to set context
   * @param {string | boolean} context
  */
  setContext(context) {
    this.context = Boolean(context);
    return this;
  }

  /**
   * Method to convert to JSON
   * @returns {Object}
  */
  toJSON() {
    return {
      name: this.name,
      description: this.description,
      usage: this.usage,
      cooldown: this.cooldown,
      category: this.category,
      aliases: this.aliases,
      userRequiredPermissions: this.userRequiredPermissions,
      userRequiredRoles: this.userRequiredRoles,
      clientRequiredPermissions: this.clientRequiredPermissions,
      userOnly: this.userOnly,
      channelOnly: this.channelOnly,
      guildOnly: this.guildOnly,
      channelTextOnly: this.channelTextOnly,
      channelNewsOnly: this.channelNewsOnly,
      channelThreadOnly: this.channelThreadOnly,
      nsfw: this.nsfw,
      slash: this.slash,
      context: this.context,
    };
  }
}

module.exports = CommandOptionsBuilder;
