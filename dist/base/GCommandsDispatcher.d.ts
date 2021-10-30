import { Collection, User, Guild, Snowflake } from 'discord.js';
import { Command } from '../structures/Command';
import { GCommandsClient } from './GCommandsClient';
export declare class GCommandsDispatcher {
    private client;
    private inhibitors;
    private cooldowns;
    owners: Collection<string, User>;
    constructor(client: GCommandsClient);
    private fetchOwners;
    getGuildData(guild: Guild, options?: {
        force?: boolean;
    }): Promise<Record<string, unknown>>;
    setGuildData(guild: Guild, data: object): Promise<boolean>;
    setGuildPrefix(guild: Guild, prefix: string): Promise<boolean>;
    getGuildPrefix(guild: Guild, options?: {
        force?: boolean;
    }): Promise<string>;
    setGuildLanguage(guild: Guild, language: string): Promise<boolean>;
    getGuildLanguage(guild: Guild, options?: {
        force?: boolean;
    }): Promise<string>;
    getCooldown(userId: Snowflake, guild: Guild, command: Command): Promise<{
        cooldown: boolean;
        wait?: undefined;
    } | {
        cooldown: boolean;
        wait: any;
    }>;
    addInhibitor(inhibitor: any): boolean | void;
    removeInhibitor(inhibitor: any): boolean | void;
}
