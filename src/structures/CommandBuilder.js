const { resolveString } = require('../util/util');

/**
 * The CommandBuilder class
 */
class CommandBuilder {
    /**
     * Creates new CommandBuilder instance
     * @param {Object} data
    */
    constructor(data = {}) {
        this.setup(data);
    }

    /**
     * Setup
     * @param {Object} data
     * @returns {CommandOptions}
     * @private
     */
    setup(data) {
       /**
         * Name
         * @type {string}
        */
       this.name = 'name' in data ? resolveString(data.name) : null;

       /**
         * Description
         * @type {string}
        */
       this.description = 'description' in data ? resolveString(data.description) : null;

        /**
         * Usage
         * @type {string}
        */
       this.usage = 'usage' in data ? resolveString(data.usage) : null;

       /**
         * Args
         * @type {Array<CommandArgsOption>}
        */
       this.args = 'args' in data ? data.args : null;

       /**
         * Cooldown
         * @type {string}
        */
       this.cooldown = 'cooldown' in data ? resolveString(data.cooldown) : null;

       /**
         * Category
         * @type {string}
        */
       this.category = 'category' in data ? resolveString(data.category) : null;

       /**
         * Aliases
         * @type {Array}
        */
       this.aliases = 'aliases' in data ? data.aliases : null;

       /**
         * User
         * @type {string | Array}
        */
       this.userRequiredPermissions = 'userRequiredPermissions' in data ? data.userRequiredPermissions : null;

       /**
         * UserRequiredRoles
         * @type {string | Array}
        */
       this.userRequiredRoles = 'userRequiredRoles' in data ? data.userRequiredRoles : null;

       /**
         * ClientRequiredPermissions
         * @type {string | Array}
        */
       this.clientRequiredPermissions = 'clientRequiredPermissions' in data ? data.clientRequiredPermissions : null;

       /**
         * UserOnly
         * @type {Snowflake | Array}
        */
       this.userOnly = 'userOnly' in data ? data.userOnly : null;

       /**
         * ChannelOnly
         * @type {Snowflake | Array}
        */
       this.channelOnly = 'channelOnly' in data ? data.channelOnly : null;

       /**
         * GuildOnly
         * @type {Snowflake}
        */
       this.guildOnly = 'guildOnly' in data ? resolveString(data.guildOnly) : null;

       /**
         * ChannelTextOnly
         * @type {Boolean}
        */
       this.channelTextOnly = 'channelTextOnly' in data ? Boolean(data.channelTextOnly) : null;

       /**
         * ChannelNewsOnly
         * @type {Boolean}
        */
       this.channelNewsOnly = 'channelNewsOnly' in data ? Boolean(data.channelNewsOnly) : null;

       /**
         * ChannelThreadOnly
         * @type {Boolean}
        */
       this.channelThreadOnly = 'channelThreadOnly' in data ? Boolean(data.channelThreadOnly) : null;

       /**
         * Nsfw
         * @type {Boolean}
        */
       this.nsfw = 'nsfw' in data ? Boolean(data.nsfw) : null;

       /**
         * Slash
         * @type {Boolean}
        */
       this.slash = 'slash' in data ? Boolean(data.slash) : null;

       /**
         * Context
         * @type {string | Boolean}
        */
       this.context = 'context' in data ? data.context : null;

       return this.toJSON();
    }

    /**
     * Method to setName
     * @param {String} name
    */
    setName(name) {
        this.name = resolveString(name);
        return this;
    }

    /**
     * Method to setDescription
     * @param {String} description
    */
    setDescription(description) {
        this.description = resolveString(description);
        return this;
    }

    /**
     * Method to setUsage
     * @param {String} usage
    */
    setUsage(usage) {
      this.usage = resolveString(usage);
      return this;
    }

    /**
     * Method to addArg
     * @param {CommandArgsChoice} arg
    */
    addArg(arg) {
      if (!Array.isArray(this.args)) this.args = [];
      this.args.push(arg);
      console.log(this.args);
      return this;
    }

    /**
     * Method to addArgs
     * @param {Array<CommandArgsChoice>} args
    */
    addArgs(args) {
      if (!Array.isArray(this.args)) this.args = [];
      for (const arg of Object.values(args)) {
        this.args.push(arg);
      }
      return this;
    }

    /**
     * Method to setCooldown
     * @param {String} cooldown
    */
    setCooldown(cooldown) {
      this.cooldown = resolveString(cooldown);
      return this;
    }

    /**
     * Method to setCategory
     * @param {String} category
    */
    setCategory(category) {
      this.category = resolveString(category);
      return this;
    }

    /**
     * Method to setAliases
     * @param {Array} aliases
    */
    setAliases(aliases) {
      this.aliases = aliases;
      return this;
    }

    /**
     * Method to setUserRequiredPermissions
     * @param {string | Array} permissions
    */
    setUserRequiredPermissions(permissions) {
      this.userRequiredPermissions = permissions;
      return this;
    }

    /**
     * Method to setUserRequiredRoles
     * @param {string | Array} roles
    */
    setUserRequiredRoles(roles) {
      this.userRequiredRoles = roles;
      return this;
    }

    /**
     * Method to setClientRequiredPermissions
     * @param {string | Array} permissions
    */
    setClientRequiredPermissions(permissions) {
      this.clientRequiredPermissions = permissions;
      return this;
    }

    /**
     * Method to setUserOnly
     * @param {Snowflake | Array} userOnly
    */
    setUserOnly(userOnly) {
      this.userOnly = userOnly;
      return this;
    }

    /**
     * Method to setChannelOnly
     * @param {Snowflake | Array} channelOnly
    */
    setChannelOnly(channelOnly) {
      this.channelOnly = channelOnly;
      return this;
    }

    /**
     * Method to setGuildOnly
     * @param {Snowflake} guildOnly
    */
    setGuildOnly(guildOnly) {
      this.guildOnly = guildOnly;
      return this;
    }

    /**
     * Method to setChannelTextOnly
     * @param {Boolean} channelTextOnly
    */
    setChannelTextOnly(channelTextOnly) {
      this.channelTextOnly = Boolean(channelTextOnly);
      return this;
    }

    /**
     * Method to setChannelNewsOnly
     * @param {Boolean} channelNewsOnly
    */
    setChannelNewsOnly(channelNewsOnly) {
      this.channelNewsOnly = Boolean(channelNewsOnly);
      return this;
    }

    /**
     * Method to setChannelThreadOnly
     * @param {Boolean} channelThreadOnly
    */
    setChannelThreadOnly(channelThreadOnly) {
      this.channelThreadOnly = Boolean(channelThreadOnly);
      return this;
    }

    /**
     * Method to setNsfw
     * @param {Boolean} nsfw
    */
    setNsfw(nsfw) {
      this.nsfw = Boolean(nsfw);
      return this;
    }

    /**
     * Method to setSlash
     * @param {Boolean} slash
    */
    setSlash(slash) {
      this.slash = Boolean(slash);
      return this;
    }

    /**
     * Method to setContext
     * @param {String | Boolean} context
    */
    setContext(context) {
      this.context = Boolean(context);
      return this;
    }

    /**
     * Method to toJSON
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

module.exports = CommandBuilder;
