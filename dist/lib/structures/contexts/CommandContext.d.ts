import { Context, ContextOptions } from './Context';
import type { Command } from '../Command';
import type { CacheType, CommandInteraction, CommandInteractionOptionResolver, ContextMenuInteraction, GuildCacheMessage, InteractionDeferReplyOptions, InteractionReplyOptions, Message, MessagePayload, WebhookEditMessageOptions } from 'discord.js';
import type { GClient } from '../../GClient';
export interface CommandContextOptions<Cached extends CacheType = CacheType> extends ContextOptions<Cached> {
    interaction?: CommandInteraction | ContextMenuInteraction;
    message?: Message;
    command: Command;
    arguments: CommandInteractionOptionResolver<Cached>;
    deferReply: <Fetch extends boolean = boolean>(options?: InteractionDeferReplyOptions & {
        fetchReply?: Fetch;
    }) => Promise<Fetch extends true ? GuildCacheMessage<Cached> : void>;
    deleteReply: () => Promise<void>;
    editReply: (options: string | MessagePayload | WebhookEditMessageOptions) => Promise<GuildCacheMessage<Cached>>;
    fetchReply: () => Promise<GuildCacheMessage<Cached>>;
    followUp: (options: string | MessagePayload | InteractionReplyOptions) => Promise<GuildCacheMessage<Cached>>;
    reply: <Fetch extends boolean = boolean>(options?: (InteractionReplyOptions & {
        fetchReply?: Fetch;
    }) | string | MessagePayload | InteractionReplyOptions) => Promise<Fetch extends true ? GuildCacheMessage<Cached> : void>;
}
export declare class CommandContext<Cached extends CacheType = CacheType> extends Context<Cached> {
    [key: string]: any;
    interaction?: CommandInteraction | ContextMenuInteraction;
    message?: Message;
    readonly command: Command;
    readonly commandName: string;
    arguments: CommandInteractionOptionResolver<Cached>;
    deferred: boolean;
    replied: boolean;
    deferReply: <Fetch extends boolean = boolean>(options?: InteractionDeferReplyOptions & {
        fetchReply?: Fetch;
    }) => Promise<Fetch extends true ? GuildCacheMessage<Cached> : void>;
    deleteReply: () => Promise<void>;
    editReply: (options: string | MessagePayload | WebhookEditMessageOptions) => Promise<GuildCacheMessage<Cached>>;
    fetchReply: () => Promise<GuildCacheMessage<Cached>>;
    followUp: (options: string | MessagePayload | InteractionReplyOptions) => Promise<GuildCacheMessage<Cached>>;
    reply: <Fetch extends boolean = boolean>(options?: (InteractionReplyOptions & {
        fetchReply?: Fetch;
    }) | string | MessagePayload | InteractionReplyOptions) => Promise<Fetch extends true ? GuildCacheMessage<Cached> : void>;
    inGuild: () => this is CommandContext<'present'>;
    inCachedGuild: () => this is CommandContext<'cached'>;
    inRawGuild: () => this is CommandContext<'raw'>;
    constructor(client: GClient, options: CommandContextOptions<Cached>);
    safeReply<Fetch extends boolean = boolean>(options?: (InteractionReplyOptions & {
        fetchReply?: Fetch;
    }) | string | MessagePayload | InteractionReplyOptions): Promise<Fetch extends true ? GuildCacheMessage<Cached> : void>;
}
//# sourceMappingURL=CommandContext.d.ts.map