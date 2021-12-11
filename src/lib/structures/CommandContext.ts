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
	arguments: ArgumentResolver;
	guild?: Guild;
	guildId?: Snowflake;
	channel: TextChannel;
	channelId: Snowflake;
	member?: GuildMember;
	memberPermissions?: Permissions;
	user: User;
	userId: Snowflake;
	reply: (options: string | MessagePayload | InteractionReplyOptions) => Promise<Message | APIMessage | void>;
	editReply: (options: string | MessagePayload | WebhookEditMessageOptions) => Promise<Message | APIMessage>;
	deleteReply: () => Promise<void>;
	followUp: (options: string | MessagePayload | InteractionReplyOptions) => Promise<Message | APIMessage | void>;
	deferReply: (options?: InteractionDeferReplyOptions) => Promise<Message | APIMessage | void>;
}

export class CommandContext {
	public client: GClient;
	public interaction?: CommandInteraction | ContextMenuInteraction;
	public guild?: Guild;
	public guildId?: Snowflake;
	public channel: TextChannel;
	public channelId: Snowflake;
	public member?: GuildMember;
	public memberPermissions?: Permissions;
	public user: User;
	public userId: Snowflake;
	public commandName: string;
	public command: Command;
	public arguments: ArgumentResolver;
	public reply: (options: string | MessagePayload | InteractionReplyOptions) => Promise<Message | APIMessage | void>;
	public editReply: (options: string | MessagePayload | WebhookEditMessageOptions) => Promise<Message | APIMessage>;
	public deleteReply: () => Promise<void>;
	public followUp: (options: string | MessagePayload | InteractionReplyOptions) => Promise<Message | APIMessage | void>;
	public deferReply: (options?: InteractionDeferReplyOptions) => Promise<Message | APIMessage | void>;

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
}
