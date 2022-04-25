import { Inhibitor } from './Inhibitor';
import { MemberPermissions } from './MemberPermissions';
import { MemberRoles } from './MemberRoles';
export default Inhibitor;
export * from './Inhibitor';
export * from './ChannelOnly';
export * from './ClientPermissions';
export * from './ClientRoles';
export * from './Nsfw';
export * from './Or';
export * from './UserOnly';
export * from './Confirm';
export * from './MemberPermissions';
export * from './MemberRoles';
/**
 * @description Use MemberPermissions instead of UserPermissions
 * @deprecated
 */
export declare const UserPermissions: typeof MemberPermissions;
/**
 * @description Use MemberRoles instead of UserRoles
 * @deprecated
 */
export declare const UserRoles: typeof MemberRoles;
//# sourceMappingURL=index.d.ts.map