import { uid } from './uid';

/**
 * The method that generates custom id.
 * @param {String} name The name of the customId.
 * @param {string[] | number[]} args The arguments to pass to the customId.
 * @returns
 */
export function customId(name: string, ...args: string[] | number[]) {
	return `${name}${args[0] ? `-${args.join('-')}` : ''}-${uid()}`;
}
