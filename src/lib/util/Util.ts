export class Util {
	/**
	 * @deprecated We don't support arguments in object/array
	 * @link https://discord.js.org/#/docs/main/stable/class/CommandInteractionOptionResolver
	 */
	static argumentsToArray(options: Array<any>): Array<string> {
		const args = [];

		const check = (option) => {
			if (!option) return;

			args.push(option.value);

			if (option.options) {
				for (let o = 0; o < option.options.length; o++) {
					check(option.options[o]);
				}
			}
		};

		if (Array.isArray(options)) {
			for (let o = 0; o < options.length; o++) {
				check(options[o]);
			}
		} else {
			check(options);
		}

		return args;
	}

	/**
	 * @deprecated We don't support arguments in object/array
	 * @link https://discord.js.org/#/docs/main/stable/class/CommandInteractionOptionResolver
	 */
	static argumentsToObject(options: Array<any>) {
		if (!Array.isArray(options)) return {};
		const args = {};

		for (const o of options) {
			if (['SUB_COMMAND', 'SUB_COMMAND_GROUP'].includes(o.type)) {
				args[o.name] = this.argumentsToObject(o.options);
			} else {
				args[o.name] = o.value;
			}
		}

		return args;
	}

	static isClass(input: any): boolean {
		return typeof input === 'function' &&
			typeof input.prototype === 'object' &&
			input.toString().substring(0, 5) === 'class';
	}

	static resolveArgumentOptions(options: any): any {
		for (const [key, value] of Object.entries(options)) {
			const option = key.match(/[A-Z]/g)?.[0] ? key.replace(key.match(/[A-Z]/g)[0], `_${key.match(/[A-Z]/g)[0].toLowerCase()}`) : key;

			if (option !== key) {
				delete options[key];

				options[option] = value;
			}
		}

		return options;
	}

	static resolveFile(file: any, fileType: string): any {
		if (fileType === '.ts') return file.default || Object.values(file)[0];
		if (fileType === '.js') {
			if (this.isClass(file)) return file;
			else return Object.values(file)[0];
		}

		return file;
	}

	static stringToBoolean(string: string): boolean {
		const regex = /^\s*(true|1|on)\s*$/i;
		return regex.test(string);
	}

	static resolveValidationErrorTrace(array: Array<any>): string {
		array = array.filter(item => typeof item === 'string');
		return `(${array.join(' -> ') || 'unknown'})`;
	}
}
