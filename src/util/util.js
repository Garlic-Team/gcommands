const { version, DMChannel, TextChannel, NewsChannel } = require('discord.js');
const Color = require('../structures/Color');
const { InteractionTypes, MessageComponentTypes, Events } = require('./Constants');
const axios = require('axios');

/**
 * The Util class
 */
class Util {
    /**
     * Internal method to resolveString
     * @param {string | Array} data
     * @returns {string}
    */
    static resolveString(data) {
        if (typeof data === 'string') return data;
        if (Array.isArray(data)) return data.join('\n');
        return String(data);
    }

    /**
     * Internal method to msToSeconds
     * @param {number} ms
     * @returns {number}
    */
    static msToSeconds(ms) {
        const seconds = ms / 1000;
        return seconds;
    }

    /**
     * Internal method to parseEmoji
     * @param {string} text
     * @returns {Object}
    */
    static parseEmoji(text) {
        if (text.includes('%')) text = decodeURIComponent(text);
        if (!text.includes(':')) return { animated: false, name: text, id: null };
        const match = text.match(/<?(?:(a):)?(\w{2,32}):(\d{17,19})?>?/);
        return match && { animated: Boolean(match[1]), name: match[2], id: match[3] || null };
    }

    /**
     * Resolve emoji without client
     * @param {EmojiIdentifierResolvable} emoji
     * @returns {Object|null}
     */
     static resolvePartialEmoji(emoji) {
        if (!emoji) return null;
        if (typeof emoji === 'string') return /^\d{17,19}$/.test(emoji) ? { id: emoji } : Util.parseEmoji(emoji);
        const { id, name, animated } = emoji;
        if (!id && !name) return null;
        return { id, name, animated };
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

        if (interaction.isCommand() && !interaction.isApplication()) {
            interaction.commandName = cmd.name;
            interaction.commandId = null;
        }

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
			const inhibit = inhibitor(interaction, data);
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
     * @param {number} commandId
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
     * @param {number} guildId
     * @private
    */
    static async __getAllCommands(client, guildId = undefined) {
        try {
            const config = {
                method: 'GET',
                headers: {
                    Authorization: `Bot ${client.token}`,
                    'Content-Type': 'application/json',
                },
                url: guildId ? `https://discord.com/api/v9/applications/${client.user.id}/guilds/${guildId}/commands` : `https://discord.com/api/v9/applications/${client.user.id}/commands`,
            };
            const response = await axios(config);
            if (response.data) return response.data;
            else return [];
        } catch (e) { console.log(e); return []; }
    }

    /**
     * Internal method to checkDjsVersion
     * @param {number} needVer
     * @returns {boolean}
     * @private
    */
    static checkDjsVersion(needVer) {
        const ver = parseInt(version.split('')[0] + version.split('')[1]);
        if (ver === parseInt(needVer)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Determine equality for two JavaScript objects
     * @param {Object | Array} o
     * @returns {Object | Array}
    */
    static comparable(o) {
        return (typeof o !== 'object' || !o) ? o : (Object.keys(o).sort().reduce((c, key) => (c[key] = Util.comparable(o[key]), c), {})); // eslint-disable-line no-return-assign, no-sequences
    }

    /**
     * Unescape
     * @param {String} a
     * @param {String} b
     * @param {String} c
     * @returns {Object | Array}
    */
    static unescape(a, b, c) {
        a = a.split(b || '-')
            .map(x => x[0].toUpperCase() + x.slice(1).toLowerCase()) // eslint-disable-line comma-dangle
            .join(c || ' ');

        return a;
    }

    /**
     * GetAllObjects from object
     * @param {GCommandsClient} client
     * @param {Object} ob
     * @returns {String}
    */
    static getAllObjects(client, ob) {
	    if (typeof ob !== 'object') return;
        for (const v of Object.values(ob)) {
            if (Array.isArray(v)) {
                Util.getAllObjects(v[0]);
            } else if (typeof v === 'object') {
                Util.getAllObjects(v);
            } else {
                client.emit(Events.DEBUG, new Color([
                    `&b${v}`,
                ]).getText());
            }
        }
    }
}

module.exports = Util;
