import Logger from 'js-logger';

export class Util {
	/**
	 * @deprecated We don't support arguments in object/array
	 * @link https://discord.js.org/#/docs/main/stable/class/CommandInteractionOptionResolver
	 */
	static argumentsToArray(options: Array<any>): Array<string> {
		const args = [];

		const check = options => {
			for (const option of options) {
				if (Util.checkIfSubOrGroup(option.type)) args.push(option.name);
				else args.push(option.value);

				if (option.options) check(option.options);
			}
		};

		check(options);

		return args;
	}

	/**
	 * @deprecated We don't support arguments in object/array
	 * @link https://discord.js.org/#/docs/main/stable/class/CommandInteractionOptionResolver
	 */
	static argumentsToObject(options: Array<any>) {
		const args = {};

		const check = (options, object) => {
			for (const option of options) {
				if (Util.checkIfSubOrGroup(option.type)) object[option.name] = {};
				else object[option.name] = option.value;

				if (option.options) check(option.options, object[option.name]);
			}
		};

		check(options, args);

		return args;
	}
	
	/**
	 * @deprecated We don't support arguments in object/array
	 * @link https://discord.js.org/#/docs/main/stable/class/CommandInteractionOptionResolver
	*/
	static checkIfSubOrGroup(type: string) {
		// Why? Because discord.js v14 (:
		return !!['SUB_COMMAND', 'SUB_COMMAND_GROUP', 'Subcommand', 'SubcommandGroup'].includes(type);
	}

	static isClass(input: any): boolean {
		return (
			typeof input === 'function' && typeof input.prototype === 'object' && input.toString().substring(0, 5) === 'class'
		);
	}

	static resolveArgumentOptions(options: any): any {
		for (const [key, value] of Object.entries(options)) {
			const option = key.match(/[A-Z]/g)?.[0]
				? key.replace(key?.match(/[A-Z]/g)?.[0], `_${key?.match(/[A-Z]/g)?.[0]?.toLowerCase()}`)
				: key;

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

	static throwError(error, name): void {
		const trace = Util.resolveValidationErrorTrace([name]);
	
		Logger.error(error, trace);
	}

	static toPascalCase(input: string): string {
		return input
			.replace(new RegExp(/[-_]+/, 'g'), ' ')
			.replace(new RegExp(/[^\w\s]/, 'g'), '')
			.replace(
				new RegExp(/\s+(.)(\w*)/, 'g'),
				($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`
			)
			.replace(new RegExp(/\w/), s => s.toUpperCase());
	}
}
