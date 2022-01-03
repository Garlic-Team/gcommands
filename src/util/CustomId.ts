import {uid} from './uid';

export function CustomId(name: string, ...args: Array<string | number>) {
	return `${name}${args[0] ? `-${args.join('-')}` : ''}-${uid()}`;
}
