module.exports = {
    resolveString(data) {
        if (typeof data === 'string') return data;
        if (Array.isArray(data)) return data.join('\n');
        return String(data);
    },

    msToSeconds(ms) {
        let seconds = ms / 1000;
        return seconds;
    },

    parseEmoji(text) {
        if (text.includes('%')) text = decodeURIComponent(text);
        if (!text.includes(':')) return { animated: false, name: text, id: null };
        const m = text.match(/<?(?:(a):)?(\w{2,32}):(\d{17,19})?>?/);
        if (!m) return null;
        return { animated: Boolean(m[1]), name: m[2], id: m[3] || null };
    },

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
        interaction.isMenu = async() => is.menu;
        return interaction;
    },

    /**
     * Internal method to inhivit
     * @returns {object}
    */
    inhibit(client, interaction, data) {
		for(const inhibitor of client.inhibitors) {
			let inhibit = inhibitor(interaction, data);
			return inhibit;
		}
		return null;
    }
}