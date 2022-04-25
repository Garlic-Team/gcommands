import type { Client, Guild } from 'discord.js';
import { Argument, ArgumentType } from '../Argument';
import { MessageArgumentTypeBase } from './base';
export declare class UserType extends MessageArgumentTypeBase {
    value: any;
    guild: Guild;
    client: Client;
    constructor(guild: Guild);
    validate(content: string): boolean;
    resolve(argument: Argument): {
        type: string | ArgumentType;
        user: import("discord.js").User;
        member: import("discord.js").GuildMember;
    };
}
//# sourceMappingURL=User.d.ts.map