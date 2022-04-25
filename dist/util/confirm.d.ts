import type { CommandContext } from '../lib/structures/contexts/CommandContext';
import type { ComponentContext } from '../lib/structures/contexts/ComponentContext';
export interface ConfirmOptions {
    message?: string | ((ctx: CommandContext | ComponentContext) => string);
    time?: number;
    ephemeral?: boolean;
    button?: {
        label?: string;
        style?: 'DANGER' | 'SUCCESS' | 'PRIMARY' | 'SECONDARY';
        emoji?: string;
    };
}
export declare function confirm(ctx: CommandContext | ComponentContext, options?: ConfirmOptions): Promise<boolean>;
//# sourceMappingURL=confirm.d.ts.map