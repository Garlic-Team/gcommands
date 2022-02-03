import { Argument, ArgumentType } from '../Argument';

export class StringType {
    value;

    validate(content: string) {
        if (typeof content === 'string') {
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