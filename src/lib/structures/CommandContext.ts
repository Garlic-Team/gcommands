import {
	CommandInteraction,
	ContextMenuInteraction,
	Guild,
	GuildMember,
	InteractionDeferReplyOptions,
	InteractionReplyOptions,
	Message,
	MessagePayload,
	Permissions,
	Snowflake,
	TextChannel,
	User,
	WebhookEditMessageOptions
} from 'discord.js';
import {APIMessage} from 'discord-api-types/v9';
import {GClient} from '../GClient';
import {Command} from './Command';
import {ArgumentResolver} from './ArgumentResolver';

export interface CommandContextOptions {
	interaction?: CommandInteraction | ContextMenuInteraction;
	message?: Message;
	arguments: ArgumentResolver;
	guild?: Guild;
	guildId?: Snowflake;
	channel: TextChannel;
	channelId: Snowflake;
	member?: GuildMember;
	memberPermissions?: Permissions;
	user: User;
	username: string;
	userId: Snowflake;
	reply: (options: string | MessagePayload | InteractionReplyOptions) => Promise<Message | APIMessage | void>;
	editReply: (options: string | MessagePayload | WebhookEditMessageOptions) => Promise<Message | APIMessage>;
	deleteReply: () => Promise<void>;
	followUp: (options: string | MessagePayload | InteractionReplyOptions) => Promise<Message | APIMessage | void>;
	deferReply: (options?: InteractionDeferReplyOptions) => Promise<Message | APIMessage | void>;
}

export class CommandContext {
	public readonly client: GClient;
	public readonly interaction?: CommandInteraction | ContextMenuInteraction;
	public readonly message?: Message;
	public readonly guild?: Guild;
	public readonly guildId?: Snowflake;
	public readonly channel: TextChannel;
	public readonly channelId: Snowflake;
	public readonly member?: GuildMember;
	public readonly memberPermissions?: Permissions;
	public readonly user: User;
	public readonly username: string;
	public readonly userId: Snowflake;
	public readonly commandName: string;
	public readonly command: Command;
	public readonly arguments: ArgumentResolver;
	public reply: (options: string | MessagePayload | InteractionReplyOptions) => Promise<Message | APIMessage | void>;
	public editReply?: (options: string | MessagePayload | WebhookEditMessageOptions) => Promise<Message | APIMessage>;
	public deleteReply?: () => Promise<void>;
	public followUp: (options: string | MessagePayload | InteractionReplyOptions) => Promise<Message | APIMessage | void>;
	public deferReply?: (options?: InteractionDeferReplyOptions) => Promise<Message | APIMessage | void>;

	protected constructor(client: GClient, command: Command, options: CommandContextOptions) {
		this.client = client;

		this.commandName = command.name;
		this.command = command;

		Object.assign(this, options);
	}

	public static createWithInteraction(interaction: CommandInteraction | ContextMenuInteraction, command: Command): CommandContext {
		return new this(interaction.client as GClient, command, {
			interaction: interaction,
			arguments: new ArgumentResolver(interaction.options.data),
			guild: interaction.guild,
			guildId: interaction.guildId,
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			channel: interaction.channel,
			channelId: interaction.channelId,
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			member: interaction.member,
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			memberPermissions: interaction.memberPermissions,
			user: interaction.user,
			username: interaction.user.username,
			userId: interaction.user.id,
			reply: interaction.reply.bind(interaction),
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			editReply: interaction.editReply.bind(interaction),
			deleteReply: interaction.deleteReply.bind(interaction),
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			followUp: interaction.followUp.bind(interaction),
			deferReply: interaction.deferReply.bind(interaction),
		});
	}

	public static createWithMessage(message: Message, args: Array<string> | Array<object>, command: Command): CommandContext {

		let replied: Message;
		return new this(message.client as GClient, command, {
			message: message,
			arguments: new ArgumentResolver(args),
			guild: message.guild,
			guildId: message.guildId,
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			channel: message.channel,
			channelId: message.channelId,
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			member: message.member,
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			memberPermissions: message.member.permissions,
			user: message.author,
			username: message.author.username,
			userId: message.author.id,
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
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
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			followUp: message.reply.bind(message),
			deferReply: () => {
				return undefined;
			}
		});
	}
}
