const ArgumentType = require('./base');

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
        super(client, 'channel');

        /**
         * Client
         * @type {Client}
        */
		this.client = client;
    }

	validate(argument, message, language) {
		const matches = message.content.match(/([0-9]+)/);

		if (!matches) return this.client.languageFile.ARGS_MUST_CONTAIN[language].replace('{argument}', argument.name).replace('{type}', 'channel');

		const channel = this.client.channels.cache.get(matches[1]);
		if (!channel) return this.client.languageFile.ARGS_MUST_CONTAIN[language].replace('{argument}', argument.name).replace('{type}', 'channel');

        if (argument.channel_types && argument.channel_types.some(type => type !== channel.type)) return this.client.languageFile.ARGS_MUST_CONTAIN[language].replace('{argument}', argument.name).replace('{type}', 'channel');
	}
    get(argument, message) {
        return message.match(/([0-9]+)/)[0];
    }
}

module.exports = ChannelArgumentType;
