import { Collection } from 'discord.js';
import { Command } from './structures/Command';
import { Inhibitor } from './structures/Inhibitor';
export * from '@gcommands/components';
export * from '@gcommands/events';
export * from './base/GCommandsClient';
export * from './structures/Command';
export * from './structures/Inhibitor';
export { LanguageType, CommandType, ArgumentType, ChannelType } from './util/Constants';
declare module 'discord.js' {
    interface Guild {
        data: Record<string, unknown>;
        getData: (options?: {
            force?: boolean;
        }) => Promise<Record<string, unknown>>;
        setData: (options: object) => Promise<boolean>;
        getCommandPrefix: (options?: {
            force?: boolean;
        }) => Promise<string>;
        setCommandPrefix: (prefix: string) => Promise<boolean>;
        getLanguage: (options?: {
            force?: boolean;
        }) => Promise<string>;
        setLanguage: (language: string) => Promise<boolean>;
    }
    interface ClientEvents {
        selectMenu: [SelectMenuInteraction];
        clickButton: [ButtonInteraction];
        commandPrefixChange: [Guild, string];
        commandExecute: [{
            command: Command;
            member: GuildMember;
            channel: TextChannel;
            guild: Guild;
        }];
        commandError: [{
            command: Command;
            member: GuildMember;
            channel: TextChannel;
            guild: Guild;
            error: unknown;
        }];
        commandsLoaded: [Collection<string, Command>];
        commandNotFound: [string];
        inhibitorExecute: [{
            inhibitor: Inhibitor;
            member: GuildMember;
            channel: TextChannel;
            guild: Guild;
        }];
        inhibitorError: [{
            inhibitor: Inhibitor;
            member: GuildMember;
            channel: TextChannel;
            guild: Guild;
            error: unknown;
        }];
        inhibitorsLoaded: [Collection<string, Inhibitor>];
        log: [string];
        debug: [string];
        guildLanguageChange: [Guild, string];
        guildBoostLevelUp: [Guild, number, number];
        guildBoostLevelDown: [Guild, number, number];
        guildRegionUpdate: [Guild, string, string];
        guildBannerUpdate: [Guild, string, string];
        guildAfkChannelUpdate: [Guild, Channel, Channel];
        guildVanityURLUpdate: [Guild, string, string];
        guildFeaturesUpdate: [Guild, object, object];
        guildAcronymUpdate: [Guild, string, string];
        guildOwnerUpdate: [Guild, GuildMember, GuildMember];
        guildMaximumMembersUpdate: [Guild, number, number];
        guildPartnerUpdate: [Guild, boolean, boolean];
        guildVerifyUpdate: [Guild, boolean, boolean];
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
        guildMemberBoost: [GuildMember, number, number];
        guildMemberUnboost: [GuildMember, number, number];
        userAvatarUpdate: [GuildMember, string, string];
        userUsernameUpdate: [GuildMember, string, string];
        userDiscriminatorUpdate: [GuildMember, string, string];
        userFlagsUpdate: [GuildMember, string, string];
        rolePositionUpdate: [GuildMember, number, number];
        rolePermissionsUpdate: [GuildMember, number, number];
    }
}
