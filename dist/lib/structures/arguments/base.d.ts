import type { Guild } from 'discord.js';
import { Argument, ArgumentType } from '../Argument';
import type { AttachmentType } from './Attachment';
import type { BooleanType } from './Boolean';
import type { ChannelType } from './Channel';
import type { IntegerType } from './Integer';
import type { MentionableType } from './Mentionable';
import type { NumberType } from './Number';
import type { RoleType } from './Role';
import type { StringType } from './String';
import type { UserType } from './User';
export declare type MessageArgumentTypes = BooleanType | ChannelType | IntegerType | MentionableType | NumberType | RoleType | StringType | UserType | AttachmentType;
export declare class MessageArgumentTypeBase {
    validate(content: string): boolean;
    resolve(argument: Argument): void;
    static createArgument(type: ArgumentType | keyof typeof ArgumentType, guild: Guild): Promise<AttachmentType | BooleanType | ChannelType | IntegerType | MentionableType | NumberType | RoleType | StringType | UserType>;
}
//# sourceMappingURL=base.d.ts.map