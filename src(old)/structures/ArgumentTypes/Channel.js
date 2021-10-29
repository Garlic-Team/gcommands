const ArgumentType = require('./Base');
const { ArgumentChannelTypes } = require('../../util/Constants');

/**
 * The ChannelArgumentType class
 * @extends ArgumentType
 */
class ChannelArgumentType extends ArgumentType {
    /**
     * The ChannelArgumentType class
     * @param {Client}
     */
    constructor(client) {
        super(client, 'CHANNEL');

        /**
         * Client
         * @type {Client}
        */
		this.client = client;

         /**
         * Value
         * @type {Object}
        */
          this.value = {};
    }

	validate(argument, message, language) {
		const matches = message.content.match(/([0-9]+)/);

		if (!matches?.[0]) return this.client.languageFile.ARGS_MUST_CONTAIN[language].replace('{argument}', argument.name).replace('{type}', 'channel');
        this.value.value = matches[0];

		const channel = this.client.channels.cache.get(matches[0]);
		if (!channel) return this.client.languageFile.ARGS_MUST_CONTAIN[language].replace('{argument}', argument.name).replace('{type}', 'channel');
        else this.value.channel = channel;
        if (argument.channel_types && argument.channel_types.some(type => type !== ArgumentChannelTypes[channel.type])) return this.client.languageFile.ARGS_MUST_CONTAIN[language].replace('{argument}', argument.name).replace('{type}', 'channel');
	}
    resolve(option) {
        if (this.value.channel) option.channel = this.value.channel;

        return option;
    }
}

module.exports = ChannelArgumentType;
