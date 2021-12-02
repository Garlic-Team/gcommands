import discord, { Channel, Client, ClientEvents, Collector, Collection, Guild, GuildChannel, GuildMember, Message, MessageAttachment, MessageCollectorOptions, CollectorOptions, MessageEmbed, Snowflake, User, NewsChannel, TextChannel, DMChannel, ThreadChannel, MembershipStates, ClientOptions, CommandInteraction } from 'discord.js';
import InteractionEvent = require('../src/structures/InteractionEvent');
import { EventEmitter } from 'events';
import { Command, GCommandsDispatcher, GInteraction, MessageEditAndUpdateOptions } from '../src/index';
import Keyv = require('keyv');
type GuildLanguageTypes = 'english' | 'spanish' | 'portuguese' | 'russian' | 'german' | 'czech' | 'slovak' | 'turkish' | 'polish' | 'indonesian' | 'italian' | 'french';

declare module 'discord.js' {
  export * from '@gcommands/components';

  export interface Guild {
    data: {
      prefix: string,
      language: string,
      users: object,
    }

    getCommandPrefix(options: object): string;
    setCommandPrefix(prefix: string): boolean;
    getLanguage(options: object): string;
    setLanguage(language: GuildLanguageTypes): boolean;
    getData(options): object;
    setData(data): boolean;
  }

  export interface Guild extends discord.Guild {
    data: {
      prefix: string,
      language: string,
      users: object,
    }

    getCommandPrefix(options: object): string;
    setCommandPrefix(prefix: string): boolean;
    getLanguage(options: object): string;
    setLanguage(language: GuildLanguageTypes): boolean;
    getData(options): object;
    setData(data): boolean;
  }

  export interface Client {
    dispatcher: GCommandsDispatcher;
    database: Keyv;
    gcommands: Collection<string, file>
  }

  interface ClientEvents {
    selectMenu: [InteractionEvent];
    clickButton: [InteractionEvent];
    GInteraction: [GInteraction | InteractionEvent];
    commandPrefixChange: [Guild, string];
    commandExecute: [Command, GuildMember];
    commandError: [Command, GuildMember, String];
    commandsLoaded: [Collection<Command>];
    commandNotFound: [string]
    log: [string];
    debug: [string];

    guildLanguageChange: [Guild, string];
    guildBoostLevelUp: [Guild, Number, Number];
    guildBoostLevelDown: [Guild, Number, Number];
    guildRegionUpdate: [Guild, string, string];
    guildBannerUpdate: [Guild, string, string];
    guildAfkChannelUpdate: [Guild, Channel, Channel];
    guildVanityURLUpdate: [Guild, string, string];
    guildFeaturesUpdate: [Guild, object, object];
    guildAcronymUpdate: [Guild, string, string];
    guildOwnerUpdate: [Guild, GuildMember, GuildMember];
    guildMaximumMembersUpdate: [Guild, Number, Number];
    guildPartnerUpdate: [Guild, Boolean, Boolean];
    guildVerifyUpdate: [Guild, Boolean, Boolean];

    voiceChannelJoin: [Channel, VoiceState];
    voiceChannelLeave: [Channel, VoiceState];
    voiceChannelSwitch: [Channel, Channel, VoiceState];
    voiceChannelMute: [Channel, string];
    voiceChannelUnmute: [Channel, string];
    voiceChannelDeaf: [Channel, string];
    voiceChannelUndeaf: [Channel, string];
    voiceStreamingStart: [Channel, Channel];
    voiceStreamingStop: [Channel, Channel];

    guildMemberNicknameUpdate: [GuildMember, string, string];
    guildMemberAcceptShipScreening: [GuildMember];
    guildMemberBoost: [GuildMember, Number, Number];
    guildMemberUnboost: [GuildMember, Number, Number];

    userAvatarUpdate: [GuildMember, string, string];
    userUsernameUpdate: [GuildMember, string, string];
    userDiscriminatorUpdate: [GuildMember, string, string];
    userFlagsUpdate: [GuildMember, string, string];

    rolePositionUpdate: [GuildMember, Number, Number];
    rolePermissionsUpdate: [GuildMember, Number, Number];
  }

  interface PartialTextBasedChannelFields {
    createButtonCollector(msg: Object | Message, filter: Function, options: Object);
    createSelectMenuCollector(msg: Object | Message, filter: Function, options: Object);
    awaitButtons(msg: Object | Message, filter: Function, options: Object);
    awaitSelectMenus(msg: Object | Message, filter: Function, options: Object);
  }
}

declare module 'gcommands' {
  export class GInteraction {
    public type: number;
    public token: number;
    public discordId: number;
    public version: number;
    public applicationId: number;
    public guild: Guild;
    public channel: TextChannel | NewsChannel | DMChannel | ThreadChannel;
    public author: User;
    public member: GuildMember;
    public replied: boolean;

    public edit(options: Object): void;
    public defer(ephemeral: boolean): void;
    public think(ephemeral: boolean): void;

    reply: {
      send(result: Object): void;
      edit(result: Object): void;
    }
  }

  export class Color {
    constructor(text: string, options: object)
    public text: string;
    public json: object;

    public getText(): string | object;
    public getRGB(): string | object;
  }

  export class CommandOptionsBuilder {
    constructor(data: CommandOptions)
    private setup(data: CommandOptions)

    public name: string;
    public contextMenuName: String;
    public description: string;
    public cooldown: string;
    public args: Array<CommandArgsOption>;
    public alwaysObtain: boolean;
    public clientRequiredPermissions: String | Array<string>;
    public userRequiredPermissions: String | Array<string>;
    public userRequiredRoles: String | Array<Snowflake>;
    public userOnly: Snowflake | Array<Snowflake>;
    public channelOnly: Snowflake | Array<Snowflake>;
    public channelTextOnly: Boolean;
    public channelNewsOnly: Boolean;
    public channelThreadOnly: Boolean;
    public allowDm: Boolean;
    public guildOnly: Snowflake | Array<Snowflake>;
    public nsfw: boolean;
    public aliases: Array<string>;
    public category: string;
    public usage: string;
    public slash: GCommandsOptionsCommandsSlash;
    public context: GCommandsOptionsCommandsContext;
    public type: Array<CommandType>;

    public setName(name: string): CommandOptionsBuilder;
    public setContextMenuName(name: string): CommandOptionsBuilder;
    public setDescription(description: string): CommandOptionsBuilder;
    public setCooldown(cooldown: string): CommandOptionsBuilder;
    public addArg(arg: CommandArgsOption): CommandOptionsBuilder;
    public addArgs(args: Array<CommandArgsOption>): CommandOptionsBuilder;
    public setAlwaysObtain(alwaysObtain: boolean): CommandOptionsBuilder;
    public setClientRequiredPermissions(permissions: string | Array<string>): CommandOptionsBuilder;
    public setUserRequiredPermissions(permissions: string | Array<string>): CommandOptionsBuilder;
    public setUserRequiredRoles(permissions: string | Array<Snowflake>): CommandOptionsBuilder;
    public setUserOnly(userOnly: Snowflake | Array<Snowflake>): CommandOptionsBuilder;
    public setChannelOnly(channelOnly: Snowflake | Array<Snowflake>): CommandOptionsBuilder;
    public setChannelTextOnly(channelTextOnly: Boolean): CommandOptionsBuilder;
    public setChannelNewsOnly(channelNewsOnly: Boolean): CommandOptionsBuilder;
    public setChannelThreadOnly(channelThreadOnly: Boolean): CommandOptionsBuilder;
    public setAllowDm(allowDm: Boolean): CommandOptionsBuilder;
    public setGuildOnly(guildOnly: Snowflake | Array<Snowflake>): CommandOptionsBuilder;
    public setNsfw(nsfw: Boolean): CommandOptionsBuilder;
    public setAliases(aliases: Array<string>): CommandOptionsBuilder;
    public setCategory(category: string): CommandOptionsBuilder;
    public setUsage(usage: string): CommandOptionsBuilder;
    public setSlash(slash: GCommandsOptionsCommandsSlash): CommandOptionsBuilder;
    public setContext(context: GCommandsOptionsCommandsContext): CommandOptionsBuilder;
    public setType(type: Array<CommandType>): CommandOptionsBuilder;
    public toJSON(): CommandOptionsBuilder;
  }

  export class CommandArgsOptionBuilder {
    constructor(data: CommandArgsOption);
    private setup(data: CommandArgsOption);

    public name: String;
    public description: String;
    public type: String;
    public prompt: String;
    public channelTypes: Array<ArgumentChannelTypes>;
    public required: Boolean;
    public choices: Array;
    public options: Array<CommandArgsOption>;

    public setName(name: String): CommandArgsOptionBuilder;
    public setDescription(description: String): CommandArgsOptionBuilder;
    public setType(type: CommandType): CommandArgsOptionBuilder;
    public setPrompt(prompt: String): CommandArgsOptionBuilder;
    public setRequired(required: Boolean): CommandArgsOptionBuilder;
    public setChannelTypes(channelTypes: Array<ArgumentChannelTypes>): CommandArgsOptionBuilder;
    public addChoice(choice: CommandArgsChoice): CommandArgsOptionBuilder;
    public addChoices(choices: Array<CommandArgsChoice>): CommandArgsOptionBuilder;
    public addOption(option: CommandArgsOption): CommandArgsOptionBuilder;
    public addOptions(options: Array<CommandArgsOption>): CommandArgsOptionBuilder;
    public toJSON(): CommandArgsOptionBuilder;
  }

  export class CommandArgsChoiceBuilder {
    constructor(data: CommandArgsChoice);
    private setup(data: CommandArgsChoice);

    public name: String;
    public value: any;

    public setName(name: String): CommandArgsChoiceBuilder;
    public setValue(value: any): CommandArgsChoiceBuilder;
    public toJSON(): CommandArgsChoiceBuilder;
  }

  export enum ArgumentType {
    SUB_COMMAND,
    SUB_COMMAND_GROUP,
    STRING,
    INTEGER,
    BOOLEAN,
    USER,
    CHANNEL,
    ROLE,
    MENTIONABLE,
    NUMBER
  }

  export enum CommandType {
    SLASH,
    CONTEXT_USER,
    CONTEXT_MESSAGE,
    MESSAGE
  }

  export class GCommandsDispatcher {
    public client: Client & {
      inhibitors: Collection<Function, Function>;
      cooldowns: Collection<string, Collection>;
    }

    public setGuildPrefix(guildId: Snowflake, prefix: string): void;
    public setGuildLanguage(guildId: Snowflake, language: GuildLanguageTypes): void;
    public getGuildPrefix(guildId: Snowflake): string;
    public getGuildLanguage(guildId: Snowflake): string;
    public getCooldown(guildId: Snowflake, userId: Snowflake, command: Collection): string;
    public addInhibitor(inhibitor: Function): void;
    public removeInhibitor(inhibitor: Function): void;

    public createButtonCollector(msg: Object | Message, filter: Function, options: Object);
    public createSelectMenuCollector(msg: Object | Message, filter: Function, options: Object);
    public awaitButtons(msg: Object | Message, filter: Function, options: Object);
    public awaitSelectMenus(msg: Object | Message, filter: Function, options: Object);
  }

  export class GCommands extends EventEmitter {
    constructor(client: Client, options: GCommandsOptions)

    public on<K extends keyof GEvents>(event: K, listener: (...args: GEvents[K]) => void): this;
    public on<S extends string | symbol>(
      event: Exclude<S, keyof GEvents>,
      listener: (...args: any[]) => void,
    ): this;
  }

  export class GCommandsClient extends Client {
    constructor(options: GCommandsOptions | ClientOptions)

    public on<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;
    public on<S extends string | symbol>(
      event: Exclude<S, keyof ClientEvents>,
      listener: (...args: any[]) => void,
    ): this;
  }

  export class Command {
    constructor(client: Client, options: CommandOptions)

    public name: string;
    public contextMenuName: string;
    public description: string;
    public cooldown: string;
    public args: Array<CommandArgsOptions>;
    public alwaysObtain: boolean;
    public clientRequiredPermissions: String | Array<string>;
    public userRequiredPermissions: String | Array<string>;
    public userRequiredRoles: String | Array<Snowflake>;
    public userOnly: Snowflake | Array<Snowflake>;
    public channelOnly: Snowflake | Array<Snowflake>;
    public channelTextOnly: Boolean;
    public channelNewsOnly: Boolean;
    public channelThreadOnly: Boolean;
    public allowDm: Boolean;
    public guildOnly: Snowflake | Array<Snowflake>;
    public nsfw: boolean;
    public aliases: Array<string>;
    public category: string;
    public usage: string;
    public slash: GCommandsOptionsCommandsSlash;
    public context: GCommandsOptionsCommandsContext;
    public type: Array<CommandType>;

    public run(options: CommandRunOptions): void;
  }

  export class Event {
    constructor(client: Client, options: EventOptions)

    public name: string;
    public once: boolean;
    public ws: boolean;

    public run(client: Client, ...args): void;
  }

  export class EventOptionsBuilder {
    constructor(data: EventOptions);
    private setup(data: EventOptions);

    public name: String;
    public once: Boolean;
    public ws: Boolean;

    public setName(): EventOptionsBuilder;
    public setOnce(): EventOptionsBuilder;
    public setWs(): EventOptionsBuilder;
    public toJSON(): EventOptionsBuilder;
  }

  interface GEvents {
    debug: [string];
    log: [string];
  }

  interface GInteractionInteraction {
    name: string;
    options: Array<object>,
    id: number;
  }

  interface InteractionEventClicker {
    member: GuildMember;
    user: User;
    id: Snowflake;
  }

  interface GCommandsOptions {
    language: GuildLanguageTypes;
    loader: {
      cmdDir: string;
      eventDir?: string;
      autoCategory?: boolean;
    }
    arguments?: {
      deletePrompt?: boolean;
      deleteInput?: boolean;
    }
    commands: {
      slash: GCommandsOptionsCommandsSlash;
      context?: GCommandsOptionsCommandsContext;
      prefix?: string;
      loadFromCache?: boolean;
    },
    caseSensitiveCommands?: boolean;
    caseSensitivePrefixes?: boolean;
    defaultCooldown?: string;
    database?: string;
  }

  interface CommandRunOptions {
    client: Client;
    interaction: CommandInteraction;
    member: GuildMember;
    message: Message;
    guild: Guild;
    channel: TextChannel | NewsChannel;
    args: CommandInteractionOptionResolver;
    objectArgs: Object;

    respond(options: string | GPayloadOptions): void;
    edit(options: string | GPayloadOptions): void;
    followUp(options: string | GPayloadOptions): void;
  }

  interface CommandArgsOptions {
    name: string;
    description: string;
    type: ArgumentType;
    prompt?: string;
    required?: boolean;
    choices?: CommandArgsChoice[];
    options?: CommandArgsOptions;
    channel_types?: ArgumentChannelTypes[];
  }

  interface CommandArgsChoice {
    name: string;
    value: string;
  }

  interface CommandOptions {
    name: string;
    contextMenuName?: string;
    description: string;
    cooldown?: string;
    args?: Array<Object>;
    userRequiredPermissions?: Array<string> | String;
    userRequiredRoles?: Array<Snowflake> | String;
    clientRequiredPermissions?: Array<string> | String;
    userOnly?: Array<Snowflake> | Snowflake;
    channelOnly?: Array<Snowflake> | Snowflake;
    guildOnly?: Array<Snowflake> | Snowflake;
    nsfw?: boolean;
    aliases?: Array<string>;
    category?: string;
    usage?: string;
    channelTextOnly?: boolean;
    channelNewsOnly?: boolean;
    channelThreadOnly?: boolean;
    slash?: GCommandsOptionsCommandsSlash;
    context?: GCommandsOptionsCommandsContext;
  }

  type GCommandsOptionsCommandsSlash = 'both' | 'slash' | 'message' | 'false';
  type GCommandsOptionsCommandsContext = 'both' | 'user' | 'message' | 'false';
  type ArgumentChannelTypes = 'DM' | 'GUILD_TEXT' | 'GUILD_VOICE' | 'GUILD_CATEGORY' | 'GUILD_NEWS' | 'GUILD_STORE' | 'GUILD_NEWS_THREAD' | 'GUILD_PUBLIC_THREAD' | 'GUILD_PRIVATE_THREAD' | 'GUILD_STAGE_VOICE';

  interface EventOptions {
    name: string;
    once: boolean;
    ws: boolean;
  }
}
