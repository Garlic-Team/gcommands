import type { PermissionResolvable } from 'discord.js';
import { Inhibitor, InhibitorOptions } from './Inhibitor';
import type { CommandContext } from '../lib/structures/contexts/CommandContext';
import type { ComponentContext } from '../lib/structures/contexts/ComponentContext';
export interface ClientPermissionsOptions extends InhibitorOptions {
    permissions: Array<PermissionResolvable>;
}
export declare class ClientPermissions extends Inhibitor {
    readonly permissions: Array<PermissionResolvable>;
    constructor(options: ClientPermissionsOptions);
    run(ctx: CommandContext | ComponentContext): boolean | any;
}
//# sourceMappingURL=ClientPermissions.d.ts.map