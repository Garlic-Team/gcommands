import type { Guild } from 'discord.js';
import { Argument, ArgumentType } from '../Argument';
import { MessageArgumentTypeBase } from './base';
export declare class ChannelType extends MessageArgumentTypeBase {
    value: any;
    guild: Guild;
    constructor(guild: Guild);
    validate(content: string): boolean;
    resolve(argument: Argument): {
        type: string | ArgumentType;
        channel: import("discord.js").GuildBasedChannel;
    };
}
//# sourceMappingURL=Channel.d.ts.map