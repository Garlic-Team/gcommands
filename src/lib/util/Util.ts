/* eslint-disable max-len */
import type {
	Client,
	CommandInteractionOption,
	ApplicationCommandType,
} from 'discord.js';
import { Logger } from './logger/Logger';
import type { GClient } from '../GClient';
import { Plugins } from '../managers/PluginManager';
import type { CommandContext } from '../structures/contexts/CommandContext';
import type { ComponentContext } from '../structures/contexts/ComponentContext';
import type { CommandInhibitor } from '../structures/Command';
import type { ComponentInhibitor } from '../structures/Component';

/**
 * Includes many useful functions
 */
export class Util extends null {
	/**
	 * Converts [CommandInteractionOptionResolver](https://discord.js.org/#/docs/discord.js/stable/class/CommandInteractionOptionResolver) to an array
	 * @param {import('discord.js').CommandInteractionOptionResolver[]} options The options to convert
	 * @deprecated We don't support arguments in object
	 * @returns {string[]}
	 */
	static argumentsToArray(options: CommandInteractionOption[]): string[] {
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
	 * Converts [CommandInteractionOptionResolver](https://discord.js.org/#/docs/discord.js/stable/class/CommandInteractionOptionResolver) to an object
	 * @param {import('discord.js').CommandInteractionOptionResolver[]} options The options to convert
	 * @deprecated We don't support arguments in object
	 * @returns {any}
	 */
	static argumentsToObject(options: CommandInteractionOption[]): any {
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
	 * Check if the type is a sub command or sub command group
	 * @param {ApplicationCommandType} type The type to check
	 * @deprecated We don't support arguments in object/array. Use [CommandInteractionOptionResolveer](https://discord.js.org/#/docs/discord.js/stable/class/CommandInteractionOptionResolver)
	 * @returns {boolean}
	 */
	static checkIfSubOrGroup(type: ApplicationCommandType): boolean {
		// Why? Because discord.js v14 (:
		return !![
			'SUB_COMMAND',
			'SUB_COMMAND_GROUP',
			'Subcommand',
			'SubcommandGroup',
		].includes(type);
	}

	/**
	 * Check if the input is a class
	 * @param {any} input The input to check
	 * @returns {boolean}
	 */
	static isClass(input: any): boolean {
		return (
			typeof input === 'function' &&
			typeof input.prototype === 'object' &&
			input.toString().substring(0, 5) === 'class'
		);
	}

	/**
	 * Converts option names from camelCase to snake_case
	 * @param {Object<string, string>} options The options to convert
	 * @deprecated This method is no longer used anywhere
	 * @returns {Object<string, string>}
	 */
	static resolveArgumentOptions(
		options: [key: string, value: string],
	): [key: string, value: string] {
		for (const [key, value] of Object.entries(options)) {
			const option = key.match(/[A-Z]/g)?.[0]
				? key.replace(
						key?.match(/[A-Z]/g)?.[0],
						`_${key?.match(/[A-Z]/g)?.[0]?.toLowerCase()}`,
				  )
				: key;

			if (option !== key) {
				delete options[key];

				options[option] = value;
			}
		}

		return options;
	}

	/**
	 * The method that resolves the file for directoryLoader
	 * @param {any} file The file that will be resolved
	 * @param {string} fileType The file type
	 * @returns {any}
	 */
	static resolveFile(file: any, fileType: string): any {
		if (fileType === '.ts') return file.default || Object.values(file)[0];
		if (fileType === '.js') {
			if (this.isClass(file)) return file;
			else return Object.values(file)[0];
		}

		return file;
	}

	/**
	 * The method that converts a string to a boolean
	 * @param {string} text The text to convert
	 * @deprecated This method is no longer used anywhere
	 * @returns
	 */
	static stringToBoolean(text: string): boolean {
		const regex = /^\s*(true|1|on)\s*$/i;
		return regex.test(text);
	}

	/**
	 * The method that solves the error validation trace
	 * @param {any[]} array
	 * @returns
	 */
	static resolveValidationErrorTrace(array: any[]): string {
		array = array.filter(item => typeof item === 'string');
		return `(${array.join(' -> ') || 'unknown'})`;
	}

	/**
	 * The method that modifies numbers and adds `0` before numbers that are less than 10
	 * @param {number} number The number to modify
	 * @returns {string}
	 */
	static pad(number: number): string {
		return (number < 10 ? '0' : '') + number;
	}

	/**
	 * The method that throws an error to the console
	 * @param {string} error  The error to throw
	 * @param {string} name  The name of the class or file path that threw the error
	 */
	static throwError(error, name): void {
		const trace = Util.resolveValidationErrorTrace([name]);

		Logger.error(error, trace);
	}

	/**
	 * The method that converts case to PascalCase
	 * @param {string} text The text to convert
	 * @deprecated This method is no longer used anywhere
	 * @returns {string}
	 */
	static toPascalCase(text: string): string {
		return text
			.replace(new RegExp(/[-_]+/, 'g'), ' ')
			.replace(new RegExp(/[^\w\s]/, 'g'), '')
			.replace(
				new RegExp(/\s+(.)(\w*)/, 'g'),
				($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`,
			)
			.replace(new RegExp(/\w/), s => s.toUpperCase());
	}

	/**
	 * The method that runs command or component inhibitor
	 * @param {CommandContext|ComponentContext} ctx The context to run the inhibitor on
	 * @param {CommandInhibitor|ComponentInhibitor} inhibitor The inhibitor to run
	 * @returns
	 */
	static async runInhibitor(
		ctx: CommandContext | ComponentContext,
		inhibitor: CommandInhibitor | ComponentInhibitor,
	) {
		let result;
		if (typeof inhibitor === 'function') {
			// @ts-expect-error Duplication
			result = await Promise.resolve(inhibitor(ctx)).catch(error => {
				Logger.error(
					typeof error.code !== 'undefined' ? error.code : '',
					error.message,
				);
				if (error.stack) Logger.trace(error.stack);
			});
		} else if (typeof inhibitor.run === 'function') {
			// @ts-expect-error Duplication
			result = await Promise.resolve(inhibitor.run(ctx)).catch(error => {
				Logger.error(
					typeof error.code !== 'undefined' ? error.code : '',
					error.message,
				);
				if (error.stack) Logger.trace(error.stack);
			});
		}

		if (result !== true) return false;
		return true;
	}

	/**
	 * The method that uses `@gcommands/plugin-language` to get a message in a specific language
	 * @param {string} value The value to get
	 * @param {{client: import('discord.js').Client | import('../GClient').GClient}} client The client to get the default response
	 * @returns {Promise<string>}
	 */
	static async getResponse(
		value: string,
		interaction: { client: Client | GClient },
	): Promise<string> {
		const languagePlugin = Plugins.get('@gcommands/plugin-language');

		if (languagePlugin) {
			const { LanguageManager } = await import('@gcommands/plugin-language');

			const text = LanguageManager.__(interaction, value);
			if (text) return text;
		}

		return (interaction.client as GClient).responses[value];
	}
}
