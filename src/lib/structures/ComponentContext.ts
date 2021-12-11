import {
	Guild,
	GuildMember,
	InteractionDeferReplyOptions,
	InteractionReplyOptions,
	Message,
	MessageComponentInteraction,
	MessagePayload,
	Permissions,
	Snowflake,
	TextChannel,
	User,
	WebhookEditMessageOptions
} from 'discord.js';
import {APIMessage} from 'discord-api-types/v9';
import {GClient} from '../GClient';
import {Component} from './Component';

export interface ComponentContextOptions {
	interaction?: MessageComponentInteraction;
	customId: string;
	arguments: Array<string>;
	values: Array<any>;
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

export class ComponentContext {
	public readonly client: GClient;
	public readonly interaction?: MessageComponentInteraction;
	public readonly arguments: Array<string>;
	public readonly customId: string;
	public readonly guild?: Guild;
	public readonly guildId?: Snowflake;
	public readonly channel: TextChannel;
	public readonly channelId: Snowflake;
	public readonly member?: GuildMember;
	public readonly memberPermissions?: Permissions;
	public readonly user: User;
	public readonly username: string;
	public readonly userId: Snowflake;
	public readonly componentName: string;
	public readonly component: Component;
	public readonly values: Array<any>;
	public reply: (options: string | MessagePayload | InteractionReplyOptions) => Promise<Message | APIMessage | void>;
	public editReply: (options: string | MessagePayload | WebhookEditMessageOptions) => Promise<Message | APIMessage>;
	public deleteReply: () => Promise<void>;
	public followUp: (options: string | MessagePayload | InteractionReplyOptions) => Promise<Message | APIMessage | void>;
	public deferReply: (options?: InteractionDeferReplyOptions) => Promise<Message | APIMessage | void>;

	protected constructor(client: GClient, component: Component, options: ComponentContextOptions) {
		this.client = client;

		this.componentName = component.name;
		this.component = component;

		Object.assign(this, options);
	}

	public static createWithInteraction(interaction: MessageComponentInteraction, component: Component, args: Array<string>): ComponentContext {
		return new this(interaction.client as GClient, component, {
			interaction: interaction,
			customId: interaction.customId,
			arguments: args,
			values: interaction.isSelectMenu() ? interaction.values : undefined,
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
}
