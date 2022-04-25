import type { PermissionResolvable } from 'discord.js';
import { Inhibitor, InhibitorOptions } from './Inhibitor';
import type { CommandContext } from '../lib/structures/contexts/CommandContext';
import type { ComponentContext } from '../lib/structures/contexts/ComponentContext';
export interface MemberPermissionsOptions extends InhibitorOptions {
    permissions: Array<PermissionResolvable>;
}
export declare class MemberPermissions extends Inhibitor {
    readonly permissions: Array<PermissionResolvable>;
    constructor(options: MemberPermissionsOptions);
    run(ctx: CommandContext | ComponentContext): boolean | any;
}
//# sourceMappingURL=MemberPermissions.d.ts.map