import type {
	CacheType,
	CommandInteraction,
	CommandInteractionOptionResolver,
	ContextMenuCommandInteraction,
	GuildCacheMessage,
	InteractionDeferReplyOptions,
	InteractionReplyOptions,
	Message,
	MessagePayload,
	WebhookEditMessageOptions,
} from 'discord.js';
import { Context, ContextOptions } from './Context';
import type { GClient } from '../../GClient';
import type { Command } from '../Command';

export interface CommandContextOptions<Cached extends CacheType = CacheType>
	extends ContextOptions<Cached> {
	interaction?: CommandInteraction | ContextMenuCommandInteraction;
	message?: Message;
	command: Command;
	arguments: CommandInteractionOptionResolver<Cached>;
	deferReply: <Fetch extends boolean = boolean>(
		options?: InteractionDeferReplyOptions & { fetchReply?: Fetch },
	) => Promise<Fetch extends true ? GuildCacheMessage<Cached> : void>;
	deleteReply: () => Promise<void>;
	editReply: (
		options: string | MessagePayload | WebhookEditMessageOptions,
	) => Promise<GuildCacheMessage<Cached>>;
	fetchReply: () => Promise<GuildCacheMessage<Cached>>;
	followUp: (
		options: string | MessagePayload | InteractionReplyOptions,
	) => Promise<GuildCacheMessage<Cached>>;
	reply: <Fetch extends boolean = boolean>(
		options?:
			| (InteractionReplyOptions & { fetchReply?: Fetch })
			| string
			| MessagePayload
			| InteractionReplyOptions,
	) => Promise<Fetch extends true ? GuildCacheMessage<Cached> : void>;
}

export class CommandContext<
	Cached extends CacheType = CacheType,
> extends Context<Cached> {
	[key: string]: any;
	public interaction?: CommandInteraction | ContextMenuCommandInteraction;
	public message?: Message;
	public readonly command: Command;
	public readonly commandName: string;
	public arguments: CommandInteractionOptionResolver<Cached>;
	public deferred = false;
	public replied = false;
	public deferReply: <Fetch extends boolean = boolean>(
		options?: InteractionDeferReplyOptions & { fetchReply?: Fetch },
	) => Promise<Fetch extends true ? GuildCacheMessage<Cached> : void>;
	public deleteReply: () => Promise<void>;
	public editReply: (
		options: string | MessagePayload | WebhookEditMessageOptions,
	) => Promise<GuildCacheMessage<Cached>>;
	public fetchReply: () => Promise<GuildCacheMessage<Cached>>;
	public followUp: (
		options: string | MessagePayload | InteractionReplyOptions,
	) => Promise<GuildCacheMessage<Cached>>;
	public reply: <Fetch extends boolean = boolean>(
		options?:
			| (InteractionReplyOptions & { fetchReply?: Fetch })
			| string
			| MessagePayload
			| InteractionReplyOptions,
	) => Promise<Fetch extends true ? GuildCacheMessage<Cached> : void>;
	public inGuild: () => this is CommandContext<'raw' | 'cached'>;
	public inCachedGuild: () => this is CommandContext<'cached'>;
	public inRawGuild: () => this is CommandContext<'raw'>;

	constructor(client: GClient, options: CommandContextOptions<Cached>) {
		super(client, options);
		this.interaction = options.interaction;
		this.message = options.message;
		this.command = options.command;
		this.commandName = options.command.name;
		this.arguments = options.arguments;
		this.deferReply = async opt => {
			const message = await options.deferReply(opt);
			this.deferred = true;
			return message;
		};
		this.deleteReply = options.deleteReply;
		this.editReply = options.editReply;
		this.fetchReply = options.fetchReply;
		this.followUp = options.followUp;
		this.reply = async opt => {
			const message = await options.reply(opt);
			this.replied = true;
			return message;
		};
		this.type = 'COMMAND';
	}

	public safeReply<Fetch extends boolean = boolean>(
		options?:
			| (InteractionReplyOptions & { fetchReply?: Fetch })
			| string
			| MessagePayload
			| InteractionReplyOptions,
	): Promise<Fetch extends true ? GuildCacheMessage<Cached> : void> {
		return this.deferred ||
			this.replied ||
			this.interaction?.deferred ||
			this.interaction?.replied
			? this.editReply(options)
			: this.reply(options);
	}
}
