import type { Snowflake } from 'discord.js';
import type { CommandContext } from '../lib/structures/contexts/CommandContext';
import type { ComponentContext } from '../lib/structures/contexts/ComponentContext';
import { Inhibitor, InhibitorOptions } from './Inhibitor';
export interface UserOnlyOptions extends InhibitorOptions {
    ids: Array<Snowflake>;
    getIds?(ctx: CommandContext | ComponentContext): Array<Snowflake>;
}
export declare class UserOnly extends Inhibitor {
    ids: Array<Snowflake>;
    getIds?(ctx: CommandContext | ComponentContext): Array<Snowflake>;
    constructor(options: UserOnlyOptions);
    run(ctx: CommandContext | ComponentContext): boolean | any;
}
//# sourceMappingURL=UserOnly.d.ts.map