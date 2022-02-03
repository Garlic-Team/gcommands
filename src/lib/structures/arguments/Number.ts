import { Argument, ArgumentType } from '../Argument';

export class NumberType {
    value;

    validate(content: string) {
        if (!isNaN(Number(content))) {
            this.value = content;
            return true
        }
        else return false;
    }

    resolve(argument: Argument) {
        return {
            ...argument.toJSON(),
            type: ArgumentType[argument.type],
            value: this.value
        }
    }
}