module.exports = class Color {
	constructor(text = "", options = {}) {
		this.text = text;

		this.json = options.json;

        this.text = this.text
			// COLORS
			.replace(/&c/g, "\x1b[31m")
			.replace(/&a/g, "\x1b[32m")
			.replace(/&e/g, "\x1b[33m")
			.replace(/&b/g, "\x1b[34m")
			.replace(/&d/g, "\x1b[35m")
			.replace(/&3/g, "\x1b[36m")
			.replace(/&f/g, "\x1b[37m")

			// OTHER
			.replace(/&r/g, "\x1b[0m")
			.replace(/&n/g, "\x1b[4m")
			.replace(/&p/g, "\x1b[7m")
	}

	getText() {
		if(this.json) {
			return {text:this.text + "\x1b[0m"}
		}
		return this.text + "\x1b[0m";
	}

	getRGB() {
		var get = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.text);

		if(this.json) {
			return {
				r: parseInt(get[1], 16),
				g: parseInt(get[2], 16),
				b: parseInt(get[3], 16)
			};
		}

		return `r: ${parseInt(get[1], 16)}, g: ${parseInt(get[2], 16)}, b: ${parseInt(get[3], 16)}`
	}
};
