const { User, GuildMember } = require('discord.js');
const { ApplicationCommandTypes } = require('../util/Constants');
const BaseCommandInteraction = require('./BaseCommandInteraction');
const ifDjsV13 = require('../util/util').checkDjsVersion(13);

/**
 * The ContextMenuInteraction
 * @extends BaseCommandInteraction
 */
class ContextMenuInteraction extends BaseCommandInteraction {
    constructor(client, data) {
        super(client, data);

        /**
         * The id of the target of the interaction
         * @type {Snowflake}
         */
        this.targetId = data.data.target_id;

        /**
          * The type of the target of the interaction; either USER or MESSAGE
          * @type {ApplicationCommandType}
          */
        this.targetType = ApplicationCommandTypes[data.data.type];

        /**
         * The invoked application command's arrayArguments
         * @type {Array}
         */
        this.arrayArguments = this.getArgs(data.data);

        /**
         * The invoked application command's objectArguments
         * @type {object}
         */
        this.objectArguments = this.getArgsObject(data.data);
    }

    /**
     * Internal method to getArgs
     * @returns {Array}
     * @private
    */
     getArgs(options) {
        let args = [];

        if (options.resolved.users && options.resolved.users[options.target_id]) {
          args.push(new User(this.client, options.resolved.users[options.target_id]));
          args.push(new GuildMember(this.client, options.resolved.members[options.target_id]));
        }

        if (options.resolved.messages && options.resolved.messages[options.target_id]) {
          args.push(ifDjsV13 ? this.channel.messages._add(options.resolved.messages[options.target_id]) : this.channel.messages.add(options.resolved.messages[options.target_id]));
        }

        return args;
    }

    /**
     * Internal method to getArgsObject
     * @returns {object}
     * @private
    */
     getArgsObject(options) {
        let args = {};

        if (options.resolved.users && options.resolved.users[options.target_id]) {
          args.user = new User(this.client, options.resolved.users[options.target_id]);
          args.member = new GuildMember(this.client, options.resolved.members[options.target_id]);
        }

        if (options.resolved.messages && options.resolved.messages[options.target_id]) {
          args.message = ifDjsV13 ? this.channel.messages._add(options.resolved.messages[options.target_id]) : this.channel.messages.add(options.resolved.messages[options.target_id]);
        }

        return args;
    }
}

module.exports = ContextMenuInteraction;
