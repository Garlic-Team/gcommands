import {BaseContext, BaseContextOptions} from './BaseContext';
import {
	CacheType,
	CommandInteraction,
	ContextMenuInteraction,
	GuildCacheMessage,
	InteractionDeferReplyOptions,
	InteractionReplyOptions,
	Message,
	MessagePayload,
	WebhookEditMessageOptions
} from 'discord.js';
import {APIMessage} from 'discord-api-types/v9';
import {GClient} from '../GClient';
import {Command} from './Command';
import {ArgumentResolver} from './ArgumentResolver';

export interface CommandContextOptions extends BaseContextOptions {
	interaction?: CommandInteraction | ContextMenuInteraction;
	message?: Message;
	command: Command;
	commandName: string;
	arguments: ArgumentResolver;
	reply: (options: string | MessagePayload | InteractionReplyOptions) => Promise<Message | APIMessage | GuildCacheMessage<CacheType> | void>;
	editReply: (options: string | MessagePayload | WebhookEditMessageOptions) => Promise<Message | APIMessage>;
	deleteReply: () => Promise<void>;
	followUp: (options: string | MessagePayload | InteractionReplyOptions) => Promise<Message | APIMessage | void>;
	deferReply: (options?: InteractionDeferReplyOptions) => Promise<Message | APIMessage | void>;
}

export class CommandContext extends BaseContext {
	public readonly interaction?: CommandInteraction | ContextMenuInteraction;
	public readonly message?: Message;
	public readonly command: Command;
	public readonly commandName: string;
	public readonly arguments: ArgumentResolver;
	public reply: (options: string | MessagePayload | InteractionReplyOptions) => Promise<Message | APIMessage | GuildCacheMessage<CacheType> | void>;
	public editReply?: (options: string | MessagePayload | WebhookEditMessageOptions) => Promise<Message | APIMessage>;
	public deleteReply?: () => Promise<void>;
	public followUp: (options: string | MessagePayload | InteractionReplyOptions) => Promise<Message | APIMessage | void>;
	public deferReply?: (options?: InteractionDeferReplyOptions) => Promise<Message | APIMessage | void>;

	constructor(client: GClient, options: CommandContextOptions) {
		super(client, options);
	}

	public static createWithInteraction(interaction: CommandInteraction | ContextMenuInteraction, command: Command): CommandContext {
		let replied = false;
		return new this(interaction.client as GClient, {
			...(super.createBaseWithInteraction(interaction)),
			interaction: interaction,
			command: command,
			commandName: command.name,
			arguments: new ArgumentResolver(interaction.options.data),
			reply: async (options) => {
				if (!replied) return await interaction.reply(options);
				else {
					replied = true;
					return await interaction.editReply(options);
				}
			},
			editReply: interaction.editReply.bind(interaction),
			deleteReply: interaction.deleteReply.bind(interaction),
			followUp: interaction.followUp.bind(interaction),
			deferReply: (options) => {
				replied = true;
				return interaction.deferReply(options);
			},
		});
	}

	public static createWithMessage(message: Message, command: Command, args: Array<any>): CommandContext {
		let replied: Message;
		return new this(message.client as GClient, {
			message: message,
			command: command,
			commandName: command.name,
			arguments: new ArgumentResolver(args),
			guild: message.guild,
			guildId: message.guild.id,
			member: message.member,
			memberPermissions: message.member.permissions,
			user: message.author,
			username: message.author.username,
			userId: message.author.id,
			channel: message.channel,
			channelId: message.channel.id,
			createdAt: message.createdAt,
			createdTimestamp: message.createdTimestamp,
			reply: async (options) => {
				const msg = await message.reply(options);

				replied = msg;

				return msg;
			},
			editReply: async (options) => {
				const msg = await replied.edit(options);

				replied = msg;

				return msg;
			},
			deleteReply: async () => {
				await replied.delete();
			},
			followUp: message.reply.bind(message),
			deferReply: () => {
				return undefined;
			}
		});
	}
}
