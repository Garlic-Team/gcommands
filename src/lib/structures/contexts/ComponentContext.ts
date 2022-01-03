import {Context, ContextOptions} from './Context';
import {
	CacheType,
	GuildCacheMessage,
	InteractionDeferReplyOptions,
	InteractionDeferUpdateOptions,
	InteractionReplyOptions,
	MessagePayload,
	WebhookEditMessageOptions
} from 'discord.js';
import {GClient} from '../../GClient';
import {Component} from '../Component';

export interface ComponentContextOptions<Cached extends CacheType = CacheType> extends ContextOptions<Cached> {
	component: Component;
	arguments: Array<string>;
	values?: Array<string>;
	deferReply: <Fetch extends boolean = boolean>(options?: InteractionDeferReplyOptions & { fetchReply?: Fetch }) => Promise<Fetch extends true ? GuildCacheMessage<Cached> : void>;
	deferUpdate: <Fetch extends boolean = boolean>(options?: InteractionDeferUpdateOptions & { fetchReply?: Fetch }) => Promise<Fetch extends true ? GuildCacheMessage<Cached> : void>;
	deleteReply: () => Promise<void>;
	editReply: (options: string | MessagePayload | WebhookEditMessageOptions) => Promise<GuildCacheMessage<Cached>>;
	fetchReply: () => Promise<GuildCacheMessage<Cached>>;
	followUp: (options: string | MessagePayload | InteractionReplyOptions) => Promise<GuildCacheMessage<Cached>>;
	reply: <Fetch extends boolean = boolean>(options?: InteractionReplyOptions & { fetchReply?: Fetch } | string | MessagePayload | InteractionReplyOptions) => Promise<Fetch extends true ? GuildCacheMessage<Cached> : void>;
}

export class ComponentContext<Cached extends CacheType = CacheType> extends Context<Cached> {
	public readonly component: Component;
	public readonly componentName: string;
	public arguments: Array<string>;
	public values?: Array<string>;
	public deferred = false;
	public replied = false;
	public deferReply: <Fetch extends boolean = boolean>(options?: InteractionDeferReplyOptions & { fetchReply?: Fetch }) => Promise<Fetch extends true ? GuildCacheMessage<Cached> : void>;
	public deferUpdate: <Fetch extends boolean = boolean>(options?: InteractionDeferUpdateOptions & { fetchReply?: Fetch }) => Promise<Fetch extends true ? GuildCacheMessage<Cached> : void>;
	public deleteReply: () => Promise<void>;
	public editReply: (options: string | MessagePayload | WebhookEditMessageOptions) => Promise<GuildCacheMessage<Cached>>;
	public fetchReply: () => Promise<GuildCacheMessage<Cached>>;
	public followUp: (options: string | MessagePayload | InteractionReplyOptions) => Promise<GuildCacheMessage<Cached>>;
	public reply: <Fetch extends boolean = boolean>(options?: InteractionReplyOptions & { fetchReply?: Fetch } | string | MessagePayload | InteractionReplyOptions) => Promise<Fetch extends true ? GuildCacheMessage<Cached> : void>;

	constructor(client: GClient, options: ComponentContextOptions<Cached>) {
		super(client, options);
		this.component = options.component;
		this.componentName = options.component.name;
		this.arguments = options.arguments;
		this.values = options.values;
		this.deferReply = async (opt) => {
			const message = await options.deferReply(opt);
			this.deferred = true;
			return message;
		};
		this.deferUpdate = async (opt) => {
			const message = await options.deferUpdate(opt);
			this.deferred = true;
			return message;
		};
		this.deleteReply = options.deleteReply;
		this.editReply = options.editReply;
		this.fetchReply = options.fetchReply;
		this.followUp = options.followUp;
		this.reply = async (opt) => {
			const message = await options.reply(opt);
			this.replied = true;
			return message;
		};
	}

	public inGuild(): this is ComponentContext<'present'> {
		return super.inGuild();
	}

	public inCachedGuild(): this is ComponentContext<'cached'> {
		return super.inCachedGuild();
	}

	public inRawGuild(): this is ComponentContext<'raw'> {
		return super.inRawGuild();
	}
}
