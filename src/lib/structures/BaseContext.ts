import {Guild, GuildMember, Interaction, Permissions, Snowflake, TextBasedChannel, User} from 'discord.js';
import {GClient} from '../GClient';

export interface BaseContextOptions {
	guild?: Guild;
	guildId?: Snowflake;
	member?: GuildMember;
	memberPermissions?: Permissions;
	user: User;
	username: string;
	userId: Snowflake;
	channel: TextBasedChannel;
	channelId: Snowflake;
	createdAt: Date;
	createdTimestamp: number;
}

export class BaseContext {
	public readonly client: GClient;
	public readonly guild?: Guild;
	public readonly guildId?: Snowflake;
	public readonly member?: GuildMember;
	public readonly memberPermissions?: Permissions;
	public readonly user: User;
	public readonly username: string;
	public readonly userId: Snowflake;
	public readonly channel: TextBasedChannel;
	public readonly channelId: Snowflake;
	public readonly createdAt: Date;
	public readonly createdTimestamp: number;

	protected constructor(client: GClient, options: BaseContextOptions) {
		this.client = client;

		Object.assign(this, options);
	}

	static createBaseWithInteraction(interaction: Interaction) {
		return new this(interaction.client as GClient, {
			guild: interaction.guild,
			guildId: interaction.guildId,
			member: interaction.member as GuildMember,
			memberPermissions: interaction.memberPermissions,
			user: interaction.user,
			username: interaction.user.username,
			userId: interaction.user.id,
			channel: interaction.channel,
			channelId: interaction.channelId,
			createdAt: interaction.createdAt,
			createdTimestamp: interaction.createdTimestamp,
		});
	}

	public inGuild(): this is BaseContext & { readonly guildId: Snowflake, readonly member: GuildMember, readonly memberPermissions: Permissions } {
		return Boolean(this.guildId && this.member);
	}

	public inCachedGuild(): this is BaseContext & { readonly guild: Guild, readonly guildId: Snowflake, readonly member: GuildMember, readonly memberPermissions: Permissions } {
		return Boolean(this.guild && this.member);
	}
}
