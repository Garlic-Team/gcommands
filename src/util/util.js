module.exports = {
    /**
     * Internal method to resolveString
     * @param {String | Array} data
     * @returns {String}
    */
    resolveString(data) {
        if (typeof data === 'string') return data;
        if (Array.isArray(data)) return data.join('\n');
        return String(data);
    },

    /**
     * Internal method to msToSeconds
     * @param {Number} ms
     * @returns {number}
    */
    msToSeconds(ms) {
        let seconds = ms / 1000;
        return seconds;
    },

    /**
     * Internal method to parseEmoji
     * @param {String} text
     * @returns {Object}
    */
    parseEmoji(text) {
        if (text.includes('%')) text = decodeURIComponent(text);
        if (!text.includes(':')) return { animated: false, name: text, id: null };
        const match = text.match(/<?(?:(a):)?(\w{2,32}):(\d{17,19})?>?/);
        return match && { animated: Boolean(match[1]), name: match[2], id: match[3] || null };
    },

    /**
     * Internal method to interactionRefactor
     * @param {Client} djsclient
     * @param {GInteraction} interaction
     * @returns {Object}
    */
    interactionRefactor(client, interaction) {
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

        interaction.isCommand = async() => is.command;
        interaction.isButton = async() => is.button;
        interaction.isSelectMenu = async() => is.menu;
        return interaction;
    },

    /**
     * Internal method to inhivit
     * @param {Client} client
     * @param {GInteraction} interaction
     * @param {Function} data
     * @returns {object}
    */
    inhibit(client, interaction, data) {
		for(const inhibitor of client.inhibitors) {
			let inhibit = inhibitor(interaction, data);
			return inhibit;
		}
		return null;
    },

    /**
     * Internal method to isClass
     * @param {File} input
     * @returns {boolean}
    */
	isClass(input) {
		return typeof input === 'function' &&
        typeof input.prototype === 'object' &&
        input.toString().substring(0, 5) === 'class';
	}
}