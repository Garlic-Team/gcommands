import { Argument, ArgumentType } from '../Argument';
import { MessageArgumentTypeBase } from './base';

export class IntegerType extends MessageArgumentTypeBase {
	value;

	validate(content: string): boolean {
		if (Number.isInteger(Number(content))) {
			this.value = content;
			return true;
		}
		else return false;
	}

	resolve(argument: Argument) {
		return {
			...argument.toJSON(),
			type: ArgumentType[argument.type],
			value: this.value
		};
	}
}