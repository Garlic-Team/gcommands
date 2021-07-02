import { Client, Guild, Message } from 'discord.js';
import { InteractionEvent } from '../src/structures/InteractionEvent';
import { EventEmitter } from 'events';
type GuildLanguageTypes = 'english' | 'spanish' | 'portuguese' | 'russian' | 'german' | 'czech' | 'slovak' | 'turkish' | 'polish';

declare module 'discord.js' {
  interface ClientEvents {
    selectMenu: [InteractionEvent];
    clickButton: [InteractionEvent];
    commandPrefixChange: [Guild, string];

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
  export class GCommandsGuild extends Guild {
    public prefix: string;
    public language: string;

    public getCommandPrefix(cache?: boolean): Promise;
    public getLanguage(cache?: boolean): Promise;

    public setCommandPrefix(prefix: string): void;
    public setLanguage(language: GuildLanguageTypes): void;
  }

  export class InteractionEvent {
    constructor(client: Client, data: object)
    public selectMenuId: string;
    public valueId: string;
    public id: string;
    public version: number;
    public token: number;
    public discordID: number;
    public applicationID: number;
    public guild: Guild;
    public channel: Channel;
    public clicker: {
      member: GuildMember;
      user: User;
    }
    public message: Object;
    public replied: boolean;
    public deffered: boolean;

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

  export class ButtonCollector extends Collector<Snowflake, Message> {
    constructor(message: Object | Message, filter: Function, options: MessageCollectorOptions)
    private _handleChannelDeletion(channel: GuildChannel): void;
    private _handleGuildDeletion(guild: Guild): void;

    public channel: Channel;
    public options: MessageCollectorOptions;
    public received: number;

    public collect(message: Message): Snowflake;
    public dispose(message: Message): Snowflake;
    public endReason(): string;
  }

  export class SelectMenuCollector extends Collector<Snowflake, Message> {
    constructor(message: Object | Message, filter: Function, options: MessageCollectorOptions)
    private _handleChannelDeletion(channel: GuildChannel): void;
    private _handleGuildDeletion(guild: Guild): void;

    public channel: Channel;
    public options: MessageCollectorOptions;
    public received: number;

    public collect(message: Message): Snowflake;
    public dispose(message: Message): Snowflake;
    public endReason(): string;
  }

  export class MessageActionRow {
    constructor(data: MessageActionRow)
    public type: number;
    public components: object;

    public addComponent(component: MessageButton | MessageSelectMenu)
    public addComponents(...components: MessageButton[] | MessageSelectMenu[])
    public removeComponents(index: number, deleteCount: number, ...options: MessageButton[] | MessageSelectMenu[])
  }

  type MessageButtonStyle = 'green' | 'red' | 'gray' | 'blurple' | 'url'
  export class MessageButton {
    constructor(data: MessageButton)
    public style: MessageButtonStyle;
    public label: string;
    public url: string;
    public custom_id: string;
    public emoji: object;
    public type: number;
    public disabled: boolean;

    public setStyle(style: MessageButtonStyle): this;
    public setLabel(label: string): this;
    public setEmoji(emoji: string): this;
    public setURL(url: string): this;
    public setDisabled(disabled: boolean): this;
    public setID(id: number): this;
    public toJSON(): this;
  }

  export class MessageSelectMenu {
    constructor(data: MessageSelectMenu)
    public placeholder: string;
    public max_values: number;
    public min_values: number;
    public custom_id: string;
    public options: object;

    public setPlaceholder(placeholder: string): this;
    public setMaxValues(max: number): this;
    public setMinValues(min: number): this;
    public setID(id: number): this;
    public addOption(option: MessageSelectMenuOption)
    public addOptions(...options: MessageSelectMenuOption[])
    public removeOptions(index: number, deleteCount: number, ...options: MessageSelectMenuOption[])
    public toJSON(): this;
  }

  export class MessageSelectMenuOption {
    constructor(data: MessageButton)
    public label: string;
    public value: string;
    public description: string;
    public custom_id: string;
    public emoji: object;
    public default: boolean;

    public setLabel(label: string): this;
    public setValue(value: string): this;
    public setDescription(value: string): this;
    public setEmoji(emoji: string): this;
    public setDefault(disabled: boolean): this;
    public toJSON(): this;
  }

  export class GCommandsDispatcher {
    public client: Client;
    public client: {
      inhibitors: Collection;
      cooldowns: Collection;
    }

    public setGuildPrefix(guildId: Snowflake, prefix: string): void;
    public setGuildLanguage(guildId: Snowflake, language: GuildLanguageTypes): void;
    public getGuildPrefix(guildId: Snowflake): Promise;
    public getGuildLanguage(guildId: Snowflake): Promise;
    public getCooldown(guildId: Snowflake, userId: Snowflake, command: Collection): Promise;
    public addInhibitor(inhibitor: Function): void;
    public removeInhibitor(inhibitor: Function): void;

    public createButtonCollector(msg: Object | Message, filter: Function, options: Object);
    public createSelectMenuCollector(msg: Object | Message, filter: Function, options: Object);
    public awaitButtons(msg: Object | Message, filter: Function, options: Object);
    public awaitSelectMenus(msg: Object | Message, filter: Function, options: Object);
  }

  export class GCommandsBase extends EventEmitter {
    constructor();
  }

  export class GCommands extends GCommandsBase {
    constructor(client: Client, options: GCommandsOptions)

    public on<K extends keyof GEvents>(event: K, listener: (...args: GEvents[K]) => void): this;
    public on<S extends string | symbol>(
      event: Exclude<S, keyof GEvents>,
      listener: (...args: any[]) => void,
    ): this;
  }

  interface GEvents {
    debug: [string];
    log: [string];
  }

  interface GCommandsOptions {
    cmdDir: string;
    eventDir?: string;
    language: GuildLanguageTypes;
    unkownCommandMessage?: boolean;
    slash: {
    slash: string | boolean;
    prefix: string;
    }
    defaultCooldown?: string;
    database?: string;
  }
}