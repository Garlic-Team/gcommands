import {Context, ContextOptions} from './Context';
import {Command} from '../Command';
import {
	CacheType,
	CommandInteraction,
	CommandInteractionOptionResolver,
	ContextMenuInteraction,
	GuildCacheMessage,
	InteractionDeferReplyOptions,
	InteractionReplyOptions,
	Message,
	MessagePayload,
	WebhookEditMessageOptions
} from 'discord.js';
import {GClient} from '../../GClient';

type ArgumentsType<Cached extends CacheType = CacheType> = Omit<CommandInteractionOptionResolver<Cached>, | 'getMessage' | 'getFocused' | 'getMentionable' | 'getRole' | 'getNumber' | 'getInteger' | 'getString' | 'getChannel' | 'getBoolean' | 'getSubcommandGroup' | 'getSubcommand'>

export interface CommandContextOptions<Cached extends CacheType = CacheType> extends ContextOptions<Cached> {
	interaction?: CommandInteraction | ContextMenuInteraction;
	message?: Message;
	command: Command;
	arguments: ArgumentsType;
	deferReply: <Fetch extends boolean = boolean>(options?: InteractionDeferReplyOptions & { fetchReply?: Fetch }) => Promise<Fetch extends true ? GuildCacheMessage<Cached> : void>;
	deleteReply: () => Promise<void>;
	editReply: (options: string | MessagePayload | WebhookEditMessageOptions) => Promise<GuildCacheMessage<Cached>>;
	fetchReply: () => Promise<GuildCacheMessage<Cached>>;
	followUp: (options: string | MessagePayload | InteractionReplyOptions) => Promise<GuildCacheMessage<Cached>>;
	reply: <Fetch extends boolean = boolean>(options?: InteractionReplyOptions & { fetchReply?: Fetch } | string | MessagePayload | InteractionReplyOptions) => Promise<Fetch extends true ? GuildCacheMessage<Cached> : void>;
}

export class CommandContext<Cached extends CacheType = CacheType> extends Context<Cached> {
	public interaction?: CommandInteraction | ContextMenuInteraction;
	public message?: Message;
	public readonly command: Command;
	public readonly commandName: string;
	public arguments: ArgumentsType;
	public deferred = false;
	public replied = false;
	public deferReply: <Fetch extends boolean = boolean>(options?: InteractionDeferReplyOptions & { fetchReply?: Fetch }) => Promise<Fetch extends true ? GuildCacheMessage<Cached> : void>;
	public deleteReply: () => Promise<void>;
	public editReply: (options: string | MessagePayload | WebhookEditMessageOptions) => Promise<GuildCacheMessage<Cached>>;
	public fetchReply: () => Promise<GuildCacheMessage<Cached>>;
	public followUp: (options: string | MessagePayload | InteractionReplyOptions) => Promise<GuildCacheMessage<Cached>>;
	public reply: <Fetch extends boolean = boolean>(options?: InteractionReplyOptions & { fetchReply?: Fetch } | string | MessagePayload | InteractionReplyOptions) => Promise<Fetch extends true ? GuildCacheMessage<Cached> : void>;

	constructor(client: GClient, options: CommandContextOptions<Cached>) {
		super(client, options);
		this.interaction = options.interaction;
		this.message = options.message;
		this.command = options.command;
		this.commandName = options.command.name;
		this.arguments = options.arguments;
		this.deferReply = async (opt) => {
			const message = await options.deferReply(opt);
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
		this.type = 'COMMAND';
	}
}
