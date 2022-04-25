import type { GClient } from '../../GClient';
import type { CacheType, CacheTypeReducer, Guild, GuildMember, GuildTextBasedChannel, Permissions, Snowflake, TextBasedChannel, User } from 'discord.js';
import type { APIInteractionGuildMember } from 'discord-api-types/v9';
import type { CommandContext } from './CommandContext';
import type { AutocompleteContext } from './AutocompleteContext';
import type { ComponentContext } from './ComponentContext';
export interface ContextOptions<Cached extends CacheType = CacheType> {
    channel: CacheTypeReducer<Cached, GuildTextBasedChannel | null, GuildTextBasedChannel | null, GuildTextBasedChannel | null, TextBasedChannel | null>;
    createdAt: Date;
    createdTimestamp: number;
    guild: CacheTypeReducer<Cached, Guild, null>;
    guildId: CacheTypeReducer<Cached, Snowflake>;
    member: CacheTypeReducer<Cached, GuildMember, APIInteractionGuildMember>;
    memberPermissions: CacheTypeReducer<Cached, Readonly<Permissions>>;
    user: User;
}
export declare class Context<Cached extends CacheType = CacheType> {
    private readonly _cacheType;
    readonly client: GClient;
    readonly channel: CacheTypeReducer<Cached, GuildTextBasedChannel | null, GuildTextBasedChannel | null, GuildTextBasedChannel | null, TextBasedChannel | null>;
    channelId: Snowflake | null;
    readonly createdAt: Date;
    readonly createdTimestamp: number;
    readonly guild: CacheTypeReducer<Cached, Guild, null>;
    guildId: CacheTypeReducer<Cached, Snowflake>;
    member: CacheTypeReducer<Cached, GuildMember, APIInteractionGuildMember>;
    user: User;
    userId: Snowflake;
    memberPermissions: CacheTypeReducer<Cached, Readonly<Permissions>>;
    type: 'COMMAND' | 'BUTTON' | 'SELECT_MENU' | 'AUTOCOMPLETE';
    constructor(client: GClient, options: ContextOptions<Cached>);
    inGuild(): this is Context<'present'>;
    inCachedGuild(): this is Context<'cached'>;
    inRawGuild(): this is Context<'raw'>;
    isCommand(): this is CommandContext;
    isAutocomplete(): this is AutocompleteContext;
    isComponent(): this is ComponentContext;
    isButton(): this is ComponentContext;
    isSelectMenu(): this is ComponentContext;
}
//# sourceMappingURL=Context.d.ts.map