import { Inhibitor } from './Inhibitor';

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
export * as UserPermissions from './MemberPermissions';

/**
 * @description Use MemberRoles instead of UserRoles
 * @deprecated
 */
export * as UserRoles from './MemberRoles';
