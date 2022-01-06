import {GClient} from '../../GClient';
import {
	CacheType,
	CacheTypeReducer,
	Guild,
	GuildMember,
	GuildTextBasedChannel,
	Permissions,
	Snowflake,
	TextBasedChannel,
	User
} from 'discord.js';
import {APIInteractionGuildMember} from 'discord-api-types/v9';
import { CommandContext } from './CommandContext';
import { AutocompleteContext } from './AutocompleteContext';
import { ComponentContext } from './ComponentContext';

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
	public type: 'COMMAND' | 'BUTTON' | 'SELECT_MENU' | 'AUTOCOMPLETE';

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

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public getDatabase<Database>(_: Database): Database {
		return this.client.options.database;
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

	public isCommand(): this is CommandContext {
		return Boolean(this.type === 'COMMAND');
	}

	public isAutocomplete(): this is AutocompleteContext {
		return Boolean(this.type === 'AUTOCOMPLETE');
	}

	public isComponent(): this is ComponentContext {
		return Boolean(this.type === 'BUTTON' || this.type === 'SELECT_MENU');
	}

	public isButton(): this is ComponentContext {
		return Boolean(this.type === 'BUTTON');
	}

	public isSelectMenu(): this is ComponentContext {
		return Boolean(this.type === 'SELECT_MENU');
	}
}
