import type { Client } from 'discord.js';
import type { GClient } from '../GClient';
import { Plugins } from '../managers/PluginManager';

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

	static pad(number: number): string {
		return (number < 10 ? '0' : '') + number;
	}

	static async getResponse(value: string, interaction: { client: Client | GClient }) {
		const languagePlugin = Plugins.get('@gcommands/plugin-language');

		if (languagePlugin) {
			const { LanguageManager } = await import('@gcommands/plugin-language');

			const text = LanguageManager.__(interaction, value);
			if (text) return text;
		}

		return (interaction.client as GClient).responses[value];
	}
}
