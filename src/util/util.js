const { version } = require('discord.js');
let _allSlashCommands;

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
    static interactionRefactor(client, interaction, raw = false) {
        let is = {
            button: false,
            menu: false,
            command: false,
        }

        if(interaction.name && client.gcommands.get(interaction.name)) {
            is.command = true;
        }

        if(interaction.componentType == 2) {
            is.button = true;
        }

        if(interaction.componentType == 3) {
            is.menu = true;
        }

        interaction.isCommand = () => is.command;
        interaction.isButton = () => is.button;
        interaction.isSelectMenu = () => is.menu;
        if(!raw) return interaction;
        else return { c: is.command, b: is.button, m: is.menu }
    }

    /**
     * Internal method to inhivit
     * @param {Client} client
     * @param {GInteraction} interaction
     * @param {Function} data
     * @returns {object}
    */
    static inhibit(client, interaction, data) {
		for(const inhibitor of client.inhibitors) {
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
            const app = client.api.applications(client.user.id)
            if(guildId) {
                app.guilds(guildId)
            }

            await app.commands(commandId).delete()
        } catch(e) {return;}
    }

    /**
     * Internal method to getAllCommands
     * @param {Client} client
     * @param {Number} guildId
     * @private
    */
    static async __getAllCommands(client, guildId = undefined) {
        if(_allSlashCommands && !guildId) return _allSlashCommands;

        try {
            const app = client.api.applications(client.user.id)
            if(guildId) {
                app.guilds(guildId)
            }

            const cmds = await app.commands.get();

            _allSlashCommands = cmds;
            return cmds;
        } catch(e) {
            return undefined;
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
        if(ver == parseInt(needVer)) {
            return true;
        } else {
            return false;
        }
    }
}

module.exports = Util;