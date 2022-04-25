import { Inhibitor } from './Inhibitor';
import type { CommandContext } from '../lib/structures/contexts/CommandContext';
import type { ComponentContext } from '../lib/structures/contexts/ComponentContext';
import { ConfirmOptions } from '../util/confirm';
export declare class Confirm extends Inhibitor {
    options?: ConfirmOptions;
    constructor(options?: ConfirmOptions);
    run(ctx: CommandContext | ComponentContext): Promise<boolean>;
}
//# sourceMappingURL=Confirm.d.ts.map