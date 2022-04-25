import { Context, ContextOptions } from './Context';
import type { CacheType, GuildCacheMessage, InteractionDeferReplyOptions, InteractionDeferUpdateOptions, InteractionReplyOptions, MessageComponentInteraction, MessagePayload, WebhookEditMessageOptions } from 'discord.js';
import type { GClient } from '../../GClient';
import type { Component } from '../Component';
export interface ComponentContextOptions<Cached extends CacheType = CacheType> extends ContextOptions<Cached> {
    interaction: MessageComponentInteraction;
    component: Component;
    customId: string;
    arguments: Array<string>;
    values?: Array<string>;
    deferReply: <Fetch extends boolean = boolean>(options?: InteractionDeferReplyOptions & {
        fetchReply?: Fetch;
    }) => Promise<Fetch extends true ? GuildCacheMessage<Cached> : void>;
    deferUpdate: <Fetch extends boolean = boolean>(options?: InteractionDeferUpdateOptions & {
        fetchReply?: Fetch;
    }) => Promise<Fetch extends true ? GuildCacheMessage<Cached> : void>;
    deleteReply: () => Promise<void>;
    editReply: (options: string | MessagePayload | WebhookEditMessageOptions) => Promise<GuildCacheMessage<Cached>>;
    fetchReply: () => Promise<GuildCacheMessage<Cached>>;
    followUp: (options: string | MessagePayload | InteractionReplyOptions) => Promise<GuildCacheMessage<Cached>>;
    reply: <Fetch extends boolean = boolean>(options?: (InteractionReplyOptions & {
        fetchReply?: Fetch;
    }) | string | MessagePayload | InteractionReplyOptions) => Promise<Fetch extends true ? GuildCacheMessage<Cached> : void>;
    type: 'BUTTON' | 'SELECT_MENU';
}
export declare class ComponentContext<Cached extends CacheType = CacheType> extends Context<Cached> {
    interaction: MessageComponentInteraction;
    readonly component: Component;
    readonly componentName: string;
    readonly customId: string;
    arguments: Array<string>;
    values?: Array<string>;
    deferred: boolean;
    replied: boolean;
    deferReply: <Fetch extends boolean = boolean>(options?: InteractionDeferReplyOptions & {
        fetchReply?: Fetch;
    }) => Promise<Fetch extends true ? GuildCacheMessage<Cached> : void>;
    deferUpdate: <Fetch extends boolean = boolean>(options?: InteractionDeferUpdateOptions & {
        fetchReply?: Fetch;
    }) => Promise<Fetch extends true ? GuildCacheMessage<Cached> : void>;
    deleteReply: () => Promise<void>;
    editReply: (options: string | MessagePayload | WebhookEditMessageOptions) => Promise<GuildCacheMessage<Cached>>;
    fetchReply: () => Promise<GuildCacheMessage<Cached>>;
    followUp: (options: string | MessagePayload | InteractionReplyOptions) => Promise<GuildCacheMessage<Cached>>;
    reply: <Fetch extends boolean = boolean>(options?: (InteractionReplyOptions & {
        fetchReply?: Fetch;
    }) | string | MessagePayload | InteractionReplyOptions) => Promise<Fetch extends true ? GuildCacheMessage<Cached> : void>;
    inGuild: () => this is ComponentContext<'present'>;
    inCachedGuild: () => this is ComponentContext<'cached'>;
    inRawGuild: () => this is ComponentContext<'raw'>;
    constructor(client: GClient, options: ComponentContextOptions<Cached>);
    safeReply<Fetch extends boolean = boolean>(options?: (InteractionReplyOptions & {
        fetchReply?: Fetch;
    }) | string | MessagePayload | InteractionReplyOptions): Promise<Fetch extends true ? GuildCacheMessage<Cached> : void>;
}
//# sourceMappingURL=ComponentContext.d.ts.map