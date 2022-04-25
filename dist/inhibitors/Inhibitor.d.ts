import type { CommandContext } from '../lib/structures/contexts/CommandContext';
import type { ComponentContext } from '../lib/structures/contexts/ComponentContext';
export interface InhibitorOptions {
    message?: string | ((ctx: CommandContext | ComponentContext) => string);
    ephemeral?: boolean;
}
export declare class Inhibitor {
    protected readonly message: string | ((ctx: CommandContext | ComponentContext) => string);
    protected readonly ephemeral: boolean;
    constructor(options?: InhibitorOptions);
    protected resolveMessage(ctx: CommandContext | ComponentContext): string | void;
}
//# sourceMappingURL=Inhibitor.d.ts.map