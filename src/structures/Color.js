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
         * text
         * @type {string}
        */
		this.text = resolveString(text);

        /**
         * json
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
			.replace(/&C/g, '\x1b[41m')
			.replace(/&A/g, '\x1b[42m')
			.replace(/&E/g, '\x1b[43m')
			.replace(/&B/g, '\x1b[44m')
			.replace(/&D/g, '\x1b[45m')
			.replace(/&F/g, '\x1b[47m')

			// OTHER
			.replace(/&r/g, '\x1b[0m')
			.replace(/&l/g, '\x1b[1m')
			.replace(/&n/g, '\x1b[4m')
			.replace(/&k/g, '\x1b[5m')
			.replace(/&p/g, '\x1b[7m')
	}


    /**
     * Internal method to getText
     * @returns {json}
	 * @returns {string}
     */
	getText() {
		if(this.json) {
			return {text:this.text + '\x1b[0m'}
		}
		return this.text + '\x1b[0m';
	}

    /**
     * Internal method to getRGB
     * @returns {json}
	 * @returns {string}
     */
	getRGB() {
		let get = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.text);

		if(this.json) {
			return {
				r: parseInt(get[1], 16),
				g: parseInt(get[2], 16),
				b: parseInt(get[3], 16)
			};
		}

		return `r: ${parseInt(get[1], 16)}, g: ${parseInt(get[2], 16)}, b: ${parseInt(get[3], 16)}`
	}
}

module.exports = Color;
