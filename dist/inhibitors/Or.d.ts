import { Inhibitor, InhibitorOptions } from './Inhibitor';
import type { CommandContext } from '../lib/structures/contexts/CommandContext';
import type { ComponentContext } from '../lib/structures/contexts/ComponentContext';
declare type InhibitorFunction = (ctx: CommandContext | ComponentContext) => boolean | any;
export interface OrOptions extends InhibitorOptions {
    inhibitors: Array<{
        run: InhibitorFunction;
    } | InhibitorFunction>;
}
export declare class Or extends Inhibitor {
    readonly inhibitors: Array<{
        run: InhibitorFunction;
    } | InhibitorFunction>;
    constructor(options: OrOptions);
    run(ctx: CommandContext | ComponentContext): Promise<boolean>;
}
export {};
//# sourceMappingURL=Or.d.ts.map