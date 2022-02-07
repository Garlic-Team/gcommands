import { Argument, ArgumentType } from '../Argument';
import { MessageArgumentTypeBase } from './base';

const truthy = new Set(['true', 't', 'yes', 'y', 'on', 'enable', 'enabled', '1', '+']);
const falsy = new Set(['false', 'f', 'no', 'n', 'off', 'disable', 'disabled', '0', '-']);

export class BooleanType extends MessageArgumentTypeBase {
	value;

	validate(content: string): boolean {
		const yes = truthy.has(content.toLowerCase());
		const no = falsy.has(content.toLowerCase());

		if (!yes && !no) return false;
		else {
			this.value = yes ? true : false;
			return true;
		}
	}

	resolve(argument: Argument) {
		return {
			...argument.toJSON(),
			type: ArgumentType[argument.type],
			value: this.value
		};
	}
}