import {GClient} from '../../GClient';
import {
	CacheType,
	CacheTypeReducer,
	Guild,
	GuildMember,
	GuildTextBasedChannel,
	Snowflake,
	TextBasedChannel,
	User
} from 'discord.js';
import {APIInteractionGuildMember} from 'discord-api-types/v9';

export interface ContextOptions<Cached extends CacheType = CacheType> {
	channel: CacheTypeReducer<Cached,
		GuildTextBasedChannel | null,
		GuildTextBasedChannel | null,
		GuildTextBasedChannel | null,
		TextBasedChannel | null>;
	createdAt: Date;
	createdTimestamp: number;
	guild: CacheTypeReducer<Cached, Guild, null>;
	guildId: CacheTypeReducer<Cached, Snowflake>;
	member: CacheTypeReducer<Cached, GuildMember, APIInteractionGuildMember>;
	user: User;
}

export class Context<Cached extends CacheType = CacheType> {
	public readonly client: GClient;
	public readonly channel: CacheTypeReducer<Cached,
		GuildTextBasedChannel | null,
		GuildTextBasedChannel | null,
		GuildTextBasedChannel | null,
		TextBasedChannel | null>;
	public channelId: Snowflake | null;
	public readonly createdAt: Date;
	public readonly createdTimestamp: number;
	public readonly guild: CacheTypeReducer<Cached, Guild, null>;
	public guildId: CacheTypeReducer<Cached, Snowflake>;
	public member: CacheTypeReducer<Cached, GuildMember, APIInteractionGuildMember>;
	public user: User;
	public userId: Snowflake;
	public memberPermissions: CacheTypeReducer<Cached, Readonly<Permissions>>;

	constructor(client: GClient, options: ContextOptions<Cached>) {
		this.client = client;
		this.channel = options.channel;
		this.channelId = options.channel.id;
		this.createdAt = options.createdAt;
		this.createdTimestamp = options.createdTimestamp;
		this.guild = options.guild;
		this.guildId = options.guildId;
		this.member = options.member;
		this.user = options.user;
		this.userId = options.user.id;
		// @ts-expect-error Discord.js messed something up here
		this.memberPermissions = options.member?.permissions;
	}

	public inGuild(): this is Context<'present'> {
		return Boolean(this.guildId && this.member);
	}

	public inCachedGuild(): this is Context<'cached'> {
		return Boolean(this.guild && this.member);
	}

	public inRawGuild(): this is Context<'raw'> {
		return Boolean(this.guildId && !this.guild && this.member);
	}
}
