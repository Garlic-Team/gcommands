import type { AutocompleteContext } from './contexts/AutocompleteContext';
import type { ApplicationCommandOptionType } from 'discord-api-types/v9';
export declare enum ArgumentType {
    'SUB_COMMAND' = 1,
    'SUB_COMMAND_GROUP' = 2,
    'STRING' = 3,
    'INTEGER' = 4,
    'BOOLEAN' = 5,
    'USER' = 6,
    'CHANNEL' = 7,
    'ROLE' = 8,
    'MENTIONABLE' = 9,
    'NUMBER' = 10,
    'ATTACHMENT' = 11
}
export declare enum ChannelType {
    'GUILD_TEXT' = 0,
    'GUILD_VOICE' = 2,
    'GUILD_CATEGORY' = 4,
    'GUILD_NEWS' = 5,
    'GUILD_STORE' = 6,
    'GUILD_NEWS_THREAD' = 10,
    'GUILD_PUBLIC_THREAD' = 11,
    'GUILD_PRIVATE_THREAD' = 12,
    'GUILD_STAGE_VOICE' = 13
}
export interface ArgumentChoice {
    name: string;
    value: string;
}
export interface ArgumentOptions {
    name: string;
    description: string;
    type: ArgumentType | keyof typeof ArgumentType | ApplicationCommandOptionType | keyof typeof ApplicationCommandOptionType;
    required?: boolean;
    choices?: Array<ArgumentChoice>;
    arguments?: Array<Argument | ArgumentOptions>;
    /**
     * @deprecated Please use ArgumentOptions#arguments instead
     * @link https://garlic-team.js.org/docs/#/docs/gcommands/next/typedef/ArgumentOptions
     */
    options?: Array<Argument | ArgumentOptions>;
    channelTypes?: Array<ChannelType | keyof typeof ChannelType>;
    minValue?: number;
    maxValue?: number;
    run?: (ctx: AutocompleteContext) => any;
}
export declare class Argument {
    name: string;
    description: string;
    type: ArgumentType | keyof typeof ArgumentType;
    required?: boolean;
    choices?: Array<ArgumentChoice>;
    arguments?: Array<Argument>;
    /**
     * @deprecated Please use Argument#arguments instead
     * @link https://garlic-team.js.org/docs/#/docs/gcommands/next/typedef/ArgumentOptions
     */
    options?: Array<Argument>;
    channelTypes?: Array<ChannelType | keyof typeof ChannelType>;
    minValue?: number;
    maxValue?: number;
    run?: (ctx: AutocompleteContext) => any;
    constructor(options: ArgumentOptions);
    toJSON(): Record<string, any>;
}
//# sourceMappingURL=Argument.d.ts.map