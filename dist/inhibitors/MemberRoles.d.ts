import { Inhibitor, InhibitorOptions } from './Inhibitor';
import type { CommandContext } from '../lib/structures/contexts/CommandContext';
import type { ComponentContext } from '../lib/structures/contexts/ComponentContext';
import type { Snowflake } from 'discord.js';
export interface MemberRolesOptions extends InhibitorOptions {
    ids?: Array<Snowflake>;
    getIds?(ctx: CommandContext | ComponentContext): Array<Snowflake>;
    requireAll?: boolean;
}
export declare class MemberRoles extends Inhibitor {
    ids?: Array<Snowflake>;
    readonly requireAll?: boolean;
    getIds?(ctx: CommandContext | ComponentContext): Array<Snowflake>;
    constructor(options: MemberRolesOptions);
    run(ctx: CommandContext | ComponentContext): boolean | any;
}
//# sourceMappingURL=MemberRoles.d.ts.map