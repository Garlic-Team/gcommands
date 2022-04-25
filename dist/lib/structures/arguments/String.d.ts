import { Argument, ArgumentType } from '../Argument';
import { MessageArgumentTypeBase } from './base';
export declare class StringType extends MessageArgumentTypeBase {
    value: any;
    validate(content: string): boolean;
    resolve(argument: Argument): {
        type: string | ArgumentType;
        value: any;
    };
}
//# sourceMappingURL=String.d.ts.map