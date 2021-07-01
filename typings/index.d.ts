import { Channel, Client, Collection, Guild, GuildMember, Message, MessageCollectorOptions, Snowflake, User } from 'discord.js';
import { EventEmitter } from 'events';

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

    export default class Client extends BaseClient {
        constructor(options?: ClientOptions);
        private actions: object;
        private _eval(script: string): any;
        private _validateOptions(options?: ClientOptions): void;
        public testting: string;
        // GCommands
        public dispatcher: GCommandsDispatcher;
        // GCommands END

        public channels: ChannelManager;
        public readonly emojis: GuildEmojiManager;
        public guilds: GuildManager;
        public readyAt: Date | null;
        public readonly readyTimestamp: number | null;
        public shard: ShardClientUtil | null;
        public token: string | null;
        public readonly uptime: number | null;
        public user: ClientUser | null;
        public users: UserManager;
        public voice: ClientVoiceManager | null;
        public ws: WebSocketManager;
        public destroy(): void;
        public fetchApplication(): Promise<ClientApplication>;
        public fetchGuildPreview(guild: GuildResolvable): Promise<GuildPreview>;
        public fetchInvite(invite: InviteResolvable): Promise<Invite>;
        public fetchGuildTemplate(template: GuildTemplateResolvable): Promise<GuildTemplate>;
        public fetchVoiceRegions(): Promise<Collection<string, VoiceRegion>>;
        public fetchWebhook(id: Snowflake, token?: string): Promise<Webhook>;
        public generateInvite(options?: InviteGenerationOptions | PermissionResolvable): Promise<string>;
        public login(token?: string): Promise<string>;
        public sweepMessages(lifetime?: number): number;
        public toJSON(): object;
    
        public on<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;
        public on<S extends string | symbol>(
          event: Exclude<S, keyof ClientEvents>,
          listener: (...args: any[]) => void,
        ): this;
    
        public once<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;
        public once<S extends string | symbol>(
          event: Exclude<S, keyof ClientEvents>,
          listener: (...args: any[]) => void,
        ): this;
    
        public emit<K extends keyof ClientEvents>(event: K, ...args: ClientEvents[K]): boolean;
        public emit<S extends string | symbol>(event: Exclude<S, keyof ClientEvents>, ...args: any[]): boolean;
    
        public off<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;
        public off<S extends string | symbol>(
          event: Exclude<S, keyof ClientEvents>,
          listener: (...args: any[]) => void,
        ): this;
    
        public removeAllListeners<K extends keyof ClientEvents>(event?: K): this;
        public removeAllListeners<S extends string | symbol>(event?: Exclude<S, keyof ClientEvents>): this;
    }

    export default class Message extends Base {
      constructor(client: Client, data: object, channel: TextChannel | DMChannel | NewsChannel);
      private _edits: Message[];
      private patch(data: object): Message;
  
      public activity: MessageActivity | null;
      public application: ClientApplication | null;
      public attachments: Collection<Snowflake, MessageAttachment>;
      public author: User;
      public channel: TextChannel | DMChannel | NewsChannel;
      public readonly cleanContent: string;
      public content: string;
      public readonly createdAt: Date;
      public createdTimestamp: number;
      public readonly deletable: boolean;
      public deleted: boolean;
      public readonly editable: boolean;
      public readonly editedAt: Date | null;
      public editedTimestamp: number | null;
      public readonly edits: Message[];
      public embeds: MessageEmbed[];
      public readonly guild: Guild | null;
      public id: Snowflake;
      public readonly member: GuildMember | null;
      public mentions: MessageMentions;
      public nonce: string | null;
      public readonly partial: false;
      public readonly pinnable: boolean;
      public pinned: boolean;
      public reactions: ReactionManager;
      public system: boolean;
      public tts: boolean;
      public type: MessageType;
      public readonly url: string;
      public webhookID: Snowflake | null;
      public flags: Readonly<MessageFlags>;
      public reference: MessageReference | null;
      public awaitReactions(
        filter: CollectorFilter,
        options?: AwaitReactionsOptions,
      ): Promise<Collection<Snowflake, MessageReaction>>;
      public createReactionCollector(filter: CollectorFilter, options?: ReactionCollectorOptions): ReactionCollector;
      public delete(options?: { timeout?: number; reason?: string }): Promise<Message>;
      public edit(
        content: APIMessageContentResolvable | MessageEditOptions | MessageEmbed | APIMessage,
      ): Promise<Message>;
      public edit(content: StringResolvable, options: MessageEditOptions | MessageEmbed): Promise<Message>;
      public equals(message: Message, rawData: object): boolean;
      public fetchWebhook(): Promise<Webhook>;
      public crosspost(): Promise<Message>;
      public fetch(force?: boolean): Promise<Message>;
      public pin(options?: { reason?: string }): Promise<Message>;
      public react(emoji: EmojiIdentifierResolvable): Promise<MessageReaction>;
      public reply(
        content: APIMessageContentResolvable | (MessageOptions & { split?: false }) | MessageAdditions,
      ): Promise<Message>;
      public reply(options: MessageOptions & { split: true | SplitOptions }): Promise<Message[]>;
      public reply(options: MessageOptions | APIMessage): Promise<Message | Message[]>;
      public reply(
        content: StringResolvable,
        options: (MessageOptions & { split?: false }) | MessageAdditions,
      ): Promise<Message>;
      public reply(
        content: StringResolvable,
        options: MessageOptions & { split: true | SplitOptions },
      ): Promise<Message[]>;
      public reply(content: StringResolvable, options: MessageOptions): Promise<Message | Message[]>;
      public suppressEmbeds(suppress?: boolean): Promise<Message>;
      public toJSON(): object;
      public toString(): string;
      public unpin(options?: { reason?: string }): Promise<Message>;

      // GCommands
      public buttons(content: string, options: Object)
      public buttonsEdit(msgID: Snowflake, content: string, options: Object)
      public buttonsWithReply(content: string, options: Object)
      public edit(options: Object | String)
      public inlineReply(content: string, options: Object)

      public createButtonCollector(filter: Function, options: Object);
      public createSelectMenuCollector(filter: Function, options: Object);
      public awaitButtons(filter: Function, options: Object);
      public awaitSelectMenus(filter: Function, options: Object);
      // GCommands END
    }

    export default class Guild extends Base {
        constructor(client: Client, data: object);
        private _sortedRoles(): Collection<Snowflake, Role>;
        private _sortedChannels(channel: Channel): Collection<Snowflake, GuildChannel>;
        private _memberSpeakUpdate(user: Snowflake, speaking: boolean): void;

        // GCommands
        public prefix: string;
        // GCommands END
    
        public readonly afkChannel: VoiceChannel | null;
        public afkChannelID: Snowflake | null;
        public afkTimeout: number;
        public applicationID: Snowflake | null;
        public approximateMemberCount: number | null;
        public approximatePresenceCount: number | null;
        public available: boolean;
        public banner: string | null;
        public channels: GuildChannelManager;
        public readonly createdAt: Date;
        public readonly createdTimestamp: number;
        public defaultMessageNotifications: DefaultMessageNotifications | number;
        public deleted: boolean;
        public description: string | null;
        public discoverySplash: string | null;
        public embedChannel: GuildChannel | null;
        public embedChannelID: Snowflake | null;
        public embedEnabled: boolean;
        public emojis: GuildEmojiManager;
        public explicitContentFilter: ExplicitContentFilterLevel;
        public features: GuildFeatures[];
        public icon: string | null;
        public id: Snowflake;
        public readonly joinedAt: Date;
        public joinedTimestamp: number;
        public large: boolean;
        public maximumMembers: number | null;
        public maximumPresences: number | null;
        public readonly me: GuildMember | null;
        public memberCount: number;
        public members: GuildMemberManager;
        public mfaLevel: number;
        public name: string;
        public readonly nameAcronym: string;
        public readonly owner: GuildMember | null;
        public ownerID: Snowflake;
        public readonly partnered: boolean;
        public preferredLocale: string;
        public premiumSubscriptionCount: number | null;
        public premiumTier: PremiumTier;
        public presences: PresenceManager;
        public readonly publicUpdatesChannel: TextChannel | null;
        public publicUpdatesChannelID: Snowflake | null;
        public region: string;
        public roles: RoleManager;
        public readonly rulesChannel: TextChannel | null;
        public rulesChannelID: Snowflake | null;
        public readonly shard: WebSocketShard;
        public shardID: number;
        public splash: string | null;
        public readonly systemChannel: TextChannel | null;
        public systemChannelFlags: Readonly<SystemChannelFlags>;
        public systemChannelID: Snowflake | null;
        public vanityURLCode: string | null;
        public vanityURLUses: number | null;
        public verificationLevel: VerificationLevel;
        public readonly verified: boolean;
        public readonly voice: VoiceState | null;
        public readonly voiceStates: VoiceStateManager;
        public readonly widgetChannel: TextChannel | null;
        public widgetChannelID: Snowflake | null;
        public widgetEnabled: boolean | null;
        public addMember(user: UserResolvable, options: AddGuildMemberOptions): Promise<GuildMember>;
        public bannerURL(options?: ImageURLOptions): string | null;
        public createIntegration(data: IntegrationData, reason?: string): Promise<Guild>;
        public createTemplate(name: string, description?: string): Promise<GuildTemplate>;
        public delete(): Promise<Guild>;
        public discoverySplashURL(options?: ImageURLOptions): string | null;
        public edit(data: GuildEditData, reason?: string): Promise<Guild>;
        public equals(guild: Guild): boolean;
        public fetch(): Promise<Guild>;
        public fetchAuditLogs(options?: GuildAuditLogsFetchOptions): Promise<GuildAuditLogs>;
        public fetchBan(user: UserResolvable): Promise<{ user: User; reason: string }>;
        public fetchBans(): Promise<Collection<Snowflake, { user: User; reason: string }>>;
        public fetchEmbed(): Promise<GuildWidget>;
        public fetchIntegrations(options?: FetchIntegrationsOptions): Promise<Collection<string, Integration>>;
        public fetchInvites(): Promise<Collection<string, Invite>>;
        public fetchPreview(): Promise<GuildPreview>;
        public fetchTemplates(): Promise<Collection<GuildTemplate['code'], GuildTemplate>>;
        public fetchVanityCode(): Promise<string>;
        public fetchVanityData(): Promise<{ code: string; uses: number }>;
        public fetchVoiceRegions(): Promise<Collection<string, VoiceRegion>>;
        public fetchWebhooks(): Promise<Collection<Snowflake, Webhook>>;
        public fetchWidget(): Promise<GuildWidget>;
        public iconURL(options?: ImageURLOptions & { dynamic?: boolean }): string | null;
        public leave(): Promise<Guild>;
        public member(user: UserResolvable): GuildMember | null;
        public setAFKChannel(afkChannel: ChannelResolvable | null, reason?: string): Promise<Guild>;
        public setAFKTimeout(afkTimeout: number, reason?: string): Promise<Guild>;
        public setBanner(banner: Base64Resolvable | null, reason?: string): Promise<Guild>;
        public setChannelPositions(channelPositions: readonly ChannelPosition[]): Promise<Guild>;
        public setDefaultMessageNotifications(
          defaultMessageNotifications: DefaultMessageNotifications | number,
          reason?: string,
        ): Promise<Guild>;
        public setDiscoverySplash(discoverySplash: Base64Resolvable | null, reason?: string): Promise<Guild>;
        public setEmbed(embed: GuildWidgetData, reason?: string): Promise<Guild>;
        public setExplicitContentFilter(
          explicitContentFilter: ExplicitContentFilterLevel | number,
          reason?: string,
        ): Promise<Guild>;
        public setIcon(icon: Base64Resolvable | null, reason?: string): Promise<Guild>;
        public setName(name: string, reason?: string): Promise<Guild>;
        public setOwner(owner: GuildMemberResolvable, reason?: string): Promise<Guild>;
        public setPreferredLocale(preferredLocale: string, reason?: string): Promise<Guild>;
        public setPublicUpdatesChannel(publicUpdatesChannel: ChannelResolvable | null, reason?: string): Promise<Guild>;
        public setRegion(region: string, reason?: string): Promise<Guild>;
        public setRolePositions(rolePositions: readonly RolePosition[]): Promise<Guild>;
        public setRulesChannel(rulesChannel: ChannelResolvable | null, reason?: string): Promise<Guild>;
        public setSplash(splash: Base64Resolvable | null, reason?: string): Promise<Guild>;
        public setSystemChannel(systemChannel: ChannelResolvable | null, reason?: string): Promise<Guild>;
        public setSystemChannelFlags(systemChannelFlags: SystemChannelFlagsResolvable, reason?: string): Promise<Guild>;
        public setVerificationLevel(verificationLevel: VerificationLevel | number, reason?: string): Promise<Guild>;
        public setWidget(widget: GuildWidgetData, reason?: string): Promise<Guild>;
        public splashURL(options?: ImageURLOptions): string | null;
        public toJSON(): object;
        public toString(): string;

        // GCommands
        public getCommandPrefix(): string;
        public setCommandPrefix(prefix: string): void;

        public getLanguage(): string;
        public setLanguage(language: string): void;
        // GCommands END
    }
}

declare module 'gcommands' {
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
      public addComponents(component: Object)
      public removeComponents(index: number, deleteCount: number, option: Object)
    }

    export class MessageButton {
      constructor(data: MessageButton)
      public style: string;
      public label: string;
      public url: string;
      public custom_id: string;
      public emoji: object;
      public type: number;
      public disabled: boolean;

      public setStyle(style: string): this;
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
      public addOptions(option: Object)
      public removeOptions(index: number, deleteCount: number, option: Object)
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
        public setGuildLanguage(guildId: Snowflake, language: string): void;
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
        constructor(data: object)

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
}