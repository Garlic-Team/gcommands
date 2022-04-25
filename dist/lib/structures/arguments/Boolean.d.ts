import { Argument, ArgumentType } from '../Argument';
import { MessageArgumentTypeBase } from './base';
export declare class BooleanType extends MessageArgumentTypeBase {
    value: any;
    validate(content: string): boolean;
    resolve(argument: Argument): {
        type: string | ArgumentType;
        value: any;
    };
}
//# sourceMappingURL=Boolean.d.ts.map