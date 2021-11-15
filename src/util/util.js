const Color = require('../structures/Color');
const { Events } = require('./Constants');
const Discord = require('discord.js');

/**
 * The Util class
 * @private
 */
class Util {
    /**
     * Internal method to resolve string
     * @param {string | Array} data
     * @returns {string}
    */
    static resolveString(data) {
        if (typeof data === 'string') return data;
        if (Array.isArray(data)) return data.join('\n');
        return String(data);
    }

    /**
     * Internal method to convert ms to seconds
     * @param {number} ms
     * @returns {number}
    */
    static msToSeconds(ms) {
        const seconds = ms / 1000;
        return seconds;
    }

    /**
     * Internal method to parse a emoji
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
     * Internal method to resolve a emoji without a client
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
     * Internal method to resolve the message options
     * @param {Object|MessageEmbed|MessageAttachment|MessageActionRow|Sticker} options
     * @returns {GPayloadOptions}
     */
     static resolveMessageOptions(options) {
        if (!options) return {};

        const embeds = [];
        const components = [];
        const files = [];
        const stickers = [];

        if (!Array.isArray(options)) options = [options];

        options.forEach(option => {
        if (option instanceof Discord.MessageEmbed) {
            return embeds.push(option);
        } else if (option instanceof Discord.MessageAttachment) {
            return files.push(option);
        } else if (option instanceof Discord.MessageActionRow) {
            return components.push(option);
        } else if (option instanceof Discord.Sticker) {
            return stickers.push(option);
        }
      });

    if (embeds.length === 0 && components.length === 0 && files.length === 0 && stickers.length === 0) return options[0];

       return {
         embeds: embeds.length !== 0 ? embeds : undefined,
         components: components.length !== 0 ? components : undefined,
         files: files.length !== 0 ? files : undefined,
         stickers: stickers.length !== 0 ? stickers : undefined,
      };
    }

    /**
     * Internal method to inhibit
     * @param {Client} client
     * @param {GInteraction} interaction
     * @param {Function} data
     * @returns {object}
    */
    static inhibit(client, data) {
		for (const inhibitor of client.inhibitors) {
			const inhibit = inhibitor(data);
			return inhibit;
		}
		return null;
    }

    /**
     * Internal method to check if is class
     * @param {File} input
     * @returns {boolean}
    */
	static isClass(input) {
		return typeof input === 'function' &&
        typeof input.prototype === 'object' &&
        input.toString().substring(0, 5) === 'class';
	}

    /**
     * Internal method to delete command
     * @param {Client} client
     * @param {number} commandId
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
     * Internal method to get all commands
     * @param {Client} client
     * @param {number} guildId
    */
    static async __getAllCommands(client, guildId = undefined) {
        try {
            const app = client.api.applications(client.user.id);
            if (guildId) {
                app.guilds(guildId);
            }

            const commands = await app.commands.get();
            if (commands) return commands;
            else return [];
        } catch { return []; }
    }

    /**
     * Internal method to determine equality for two JavaScript objects
     * @param {Object | Array} o
     * @returns {Object | Array}
    */
    static comparable(o) {
        return (typeof o !== 'object' || !o) ? o : (Object.keys(o).sort().reduce((c, key) => (c[key] = Util.comparable(o[key]), c), {})); // eslint-disable-line no-return-assign, no-sequences
    }

    /**
     * Internal method to unescape
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
     * Internal method to get all objects from object
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
