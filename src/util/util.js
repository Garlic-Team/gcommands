const { version, DMChannel, TextChannel, NewsChannel } = require('discord.js');
const { InteractionTypes, MessageComponentTypes } = require('./Constants');

/**
 * The Util class
 */
class Util {
    /**
     * Internal method to resolveString
     * @param {String | Array} data
     * @returns {String}
    */
    static resolveString(data) {
        if (typeof data === 'string') return data;
        if (Array.isArray(data)) return data.join('\n');
        return String(data);
    }

    /**
     * Internal method to msToSeconds
     * @param {Number} ms
     * @returns {number}
    */
    static msToSeconds(ms) {
        let seconds = ms / 1000;
        return seconds;
    }

    /**
     * Internal method to parseEmoji
     * @param {String} text
     * @returns {Object}
    */
    static parseEmoji(text) {
        if (text.includes('%')) text = decodeURIComponent(text);
        if (!text.includes(':')) return { animated: false, name: text, id: null };
        const match = text.match(/<?(?:(a):)?(\w{2,32}):(\d{17,19})?>?/);
        return match && { animated: Boolean(match[1]), name: match[2], id: match[3] || null };
    }

    /**
     * Internal method to interactionRefactor
     * @param {Client} djsclient
     * @param {GInteraction} interaction
     * @returns {Object}
    */
    static interactionRefactor(interaction, cmd) {
        interaction.inGuild = () => Boolean(interaction.guild && interaction.member);

        interaction.isApplication = () => InteractionTypes[interaction.type] === InteractionTypes.APPLICATION_COMMAND;
        interaction.isCommand = () => cmd ? true : false || (InteractionTypes[interaction.type] === InteractionTypes.APPLICATION_COMMAND && String(interaction.targetType) === 'undefined');
        interaction.isContextMenu = () => InteractionTypes[interaction.type] === InteractionTypes.APPLICATION_COMMAND && String(interaction.targetType) !== 'undefined';

        interaction.isMessageComponent = () => InteractionTypes[interaction.type] === InteractionTypes.MESSAGE_COMPONENT;

        interaction.isButton = () => (
            InteractionTypes[interaction.type] === InteractionTypes.MESSAGE_COMPONENT &&
            MessageComponentTypes[interaction.componentType] === MessageComponentTypes.BUTTON
        );

        interaction.isSelectMenu = () => (
            InteractionTypes[interaction.type] === InteractionTypes.MESSAGE_COMPONENT &&
            MessageComponentTypes[interaction.componentType] === MessageComponentTypes.SELECT_MENU
        );

        return interaction;
    }

    /**
     * Internal method to channelTypeRefactor
     * @param {Channel} channel
     * @returns {Object}
    */
    static channelTypeRefactor(channel) {
        let finalResult;

        if (!channel) return null;
        if (channel instanceof TextChannel) finalResult = 'text';
        if (channel instanceof NewsChannel) finalResult = 'news';
        if (channel instanceof DMChannel) finalResult = 'dm';
        if (channel.type === 'GUILD_NEWS_THREAD') finalResult = 'thread';
        if (channel.type === 'GUILD_PUBLIC_THREAD') finalResult = 'thread';
        if (channel.type === 'GUILD_PRIVATE_THREAD') finalResult = 'thread';

        return finalResult;
    }

    /**
     * Internal method to inhivit
     * @param {Client} client
     * @param {GInteraction} interaction
     * @param {Function} data
     * @returns {object}
    */
    static inhibit(client, interaction, data) {
		for (const inhibitor of client.inhibitors) {
			let inhibit = inhibitor(interaction, data);
			return inhibit;
		}
		return null;
    }

    /**
     * Internal method to isClass
     * @param {File} input
     * @returns {boolean}
    */
	static isClass(input) {
		return typeof input === 'function' &&
        typeof input.prototype === 'object' &&
        input.toString().substring(0, 5) === 'class';
	}

    /**
     * Internal method to deleteCmd
     * @param {Client} client
     * @param {Number} commandId
     * @private
    */
    static async __deleteCmd(client, commandId, guildId = undefined) {
        try {
            const app = client.api.applications(client.user.id);
            if (guildId) {
                app.guilds(guildId);
            }

            await app.commands(commandId).delete();
        } catch (e) {
            return null;
        }
    }

    /**
     * Internal method to getAllCommands
     * @param {Client} client
     * @param {Number} guildId
     * @private
    */
    static async __getAllCommands(client, guildId = undefined) {
        if (client._applicationCommandsCache) {
            if (guildId && client._applicationCommandsCache[guildId]) return client._applicationCommandsCache[guildId];
            else if (!guildId) return client._applicationCommandsCache.global;
        }

        try {
            const app = client.api.applications(client.user.id);
            if (guildId) {
                app.guilds(guildId);
            }

            const cmds = await app.commands.get();

            if (guildId) client._applicationCommandsCache[guildId] = cmds;
            else client._applicationCommandsCache.global = cmds;

            return cmds;
        } catch (e) {
            return [];
        }
    }

    /**
     * Internal method to checkDjsVersion
     * @param {Number} needVer
     * @returns {Boolean}
     * @private
    */
     static checkDjsVersion(needVer) {
        let ver = parseInt(version.split('')[0] + version.split('')[1]);
        if (ver === parseInt(needVer)) {
            return true;
        } else {
            return false;
        }
    }
}

module.exports = Util;
