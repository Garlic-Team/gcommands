import { uid } from './uid';

export function customId(name: string, ...args: Array<string | number>) {
	return `${name}${args[0] ? `-${args.join('-')}` : ''}-${uid()}`;
}