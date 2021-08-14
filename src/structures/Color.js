const { resolveString } = require('../util/util');

/**
 * The Color class
 */
class Color {
    /**
     * Creates new Color instance
     * @param {string} text
     * @param {ColorOptions} options
     */
	constructor(text = '', options = {}) {
        /**
         * Text
         * @type {string}
        */
		this.text = resolveString(text);

        /**
         * Json
         * @type {Object}
        */
		this.json = options.json;

        this.text = this.text
			// COLORS
			.replace(/&0/g, '\x1b[30m')
			.replace(/&c/g, '\x1b[31m')
			.replace(/&a/g, '\x1b[32m')
			.replace(/&e/g, '\x1b[33m')
			.replace(/&b/g, '\x1b[34m')
			.replace(/&d/g, '\x1b[35m')
			.replace(/&3/g, '\x1b[36m')
			.replace(/&f/g, '\x1b[37m')
			.replace(/&8/g, '\x1b[90m')
			.replace(/&h/g, '\x1b[91m')
			.replace(/&9/g, '\x1b[92m')
			.replace(/&4/g, '\x1b[93m')
			.replace(/&2/g, '\x1b[94m')
			.replace(/&6/g, '\x1b[95m')
			.replace(/&7/g, '\x1b[96m')
			.replace(/&i/g, '\x1b[97m')

			.replace(/&B0/g, '\x1b[40m')
			.replace(/&Bc/g, '\x1b[41m')
			.replace(/&Ba/g, '\x1b[42m')
			.replace(/&Be/g, '\x1b[43m')
			.replace(/&Bb/g, '\x1b[44m')
			.replace(/&Bd/g, '\x1b[45m')
			.replace(/&B3/g, '\x1b[46m')
			.replace(/&Bf/g, '\x1b[47m')
			.replace(/&B8/g, '\x1b[100m')
			.replace(/&Bh/g, '\x1b[101m')
			.replace(/&B9/g, '\x1b[102m')
			.replace(/&B4/g, '\x1b[103m')
			.replace(/&B2/g, '\x1b[104m')
			.replace(/&B6/g, '\x1b[105m')
			.replace(/&B7/g, '\x1b[106m')
			.replace(/&Bi/g, '\x1b[107m')

			// OTHER
			.replace(/&r/g, '\x1b[0m')
			.replace(/&l/g, '\x1b[1m')
			.replace(/&n/g, '\x1b[4m')
			.replace(/&k/g, '\x1b[5m')
			.replace(/&p/g, '\x1b[7m');
	}


    /**
     * Internal method to getText
     * @returns {json}
	 * @returns {string}
     */
	getText() {
		if (this.json) {
			return { text: `${this.text}\x1b[0m` };
		}
		return `${this.text}\x1b[0m`;
	}

    /**
     * Internal method to getRGB
     * @returns {json}
	 * @returns {string}
     */
	getRGB() {
		let get = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.text);

		if (this.json) {
			return {
				r: parseInt(get[1], 16),
				g: parseInt(get[2], 16),
				b: parseInt(get[3], 16),
			};
		}

		return `r: ${parseInt(get[1], 16)}, g: ${parseInt(get[2], 16)}, b: ${parseInt(get[3], 16)}`;
	}
}

module.exports = Color;
