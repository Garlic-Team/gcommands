import { MessageArgumentTypeBase } from './base';
import { Argument, ArgumentType } from '../Argument';

export class NumberType extends MessageArgumentTypeBase {
	value;

	validate(content: string): boolean {
		if (!isNaN(Number(content))) {
			this.value = content;
			return true;
		} else {
			return false;
		}
	}

	resolve(argument: Argument) {
		return {
			...argument.toJSON(),
			type: ArgumentType[argument.type],
			value: this.value,
		};
	}
}
