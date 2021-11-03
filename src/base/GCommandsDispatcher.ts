import { Collection, User, Team, Guild, Snowflake } from 'discord.js';
import * as ms from 'ms';

import { Command } from '../structures/Command';
import { GCommandsClient } from './GCommandsClient';

export class GCommandsDispatcher {
    private client: GCommandsClient;
    private caseSensitiveCommands: boolean;
    private inhibitors: Set<() => boolean>;
    private cooldowns: Collection<string, Collection<string, string>>;
    public owners: Collection<string, User>;

    public constructor(client: GCommandsClient) {
        this.client = client;
        this.caseSensitiveCommands = client.options.caseSensitiveCommands;
        this.inhibitors = new Set();
        this.cooldowns = new Collection();
        this.owners = new Collection();


        setImmediate(() => {
            this.client.on('ready', () => {
                this.fetchOwners();
            });
        });
    }
    private async fetchOwners(): Promise<void> {
        const application = await this.client.application.fetch();
        if (application.owner === null) return;

        if (application.owner instanceof Team) {
            application.owner.members.forEach(member => this.owners.set(member.user.id, member.user));
        } else { this.owners.set(application.owner.id, application.owner); }
    }

    public async getGuildData(guild: Guild, options?: { force?: boolean }): Promise<Record<string, unknown>> {
        if (!this.client.database) return;
        if (guild.data && !options.force) return guild.data;

        try {
            const data = await this.client.database.get(`guild_${guild.id}`) || {};

            return data;
        // eslint-disable-next-line no-useless-return
        } catch { return; }
    }
    public async setGuildData(guild: Guild, data: object): Promise<boolean> {
        if (!this.client.database) return;
        if (!data) return;

        try {
            await this.client.database.set(`guild_${guild.id}`, data);

            return true;
        // eslint-disable-next-line no-useless-return
        } catch { return; }
    }
    public async setGuildPrefix(guild: Guild, prefix: string): Promise<boolean> {
        if (!this.client.database) return;
        if (!prefix) return;

        try {
            const data = await guild.getData();

            data.prefix = prefix;

            const isSet = await guild.setData(data);

            return isSet;
        // eslint-disable-next-line no-useless-return
        } catch { return; }
    }
    public async getGuildPrefix(guild: Guild, options?: { force?: boolean }): Promise<string> {
        if (!this.client.database) return;
        if (guild.data?.prefix && !options.force) return String(guild.data.prefix);

        try {
            const data = await guild.getData({ force: true });

            if (data?.prefix) return String(data.prefix);
        // eslint-disable-next-line no-useless-return
        } catch { return; }
    }
    public async setGuildLanguage(guild: Guild, language: string): Promise<boolean> {
        if (!this.client.database) return;
        if (!language) return;

        try {
            const data = await guild.getData();

            data.language = language;

            const isSet = await guild.setData(data);

            return isSet;
        // eslint-disable-next-line no-useless-return
        } catch { return; }
    }
    public async getGuildLanguage(guild: Guild, options?: { force?: boolean }): Promise<string> {
        if (!this.client.database) return;
        if (guild.data?.language && !options.force) return String(guild.data.language);

        try {
            const data = await guild.getData({ force: true });

            if (data?.language) return String(data.language);
        // eslint-disable-next-line no-useless-return
        } catch { return; }
    }
    public async getCooldown(userId: Snowflake, guild: Guild, command: Command): Promise<{ cooldown: boolean, wait?: string }> {
        if (this.owners.has(userId)) return { cooldown: false };
        const now = Date.now();

        let cooldown;
        if (typeof command.cooldown === 'string') cooldown = ms(command.cooldown);
        else cooldown = ms(this.client.options.defaultCooldown);

        if (cooldown < 1800000 || !this.client.database) {
            if (!this.cooldowns.has(command.name)) this.cooldowns.set(command.name, new Collection());

            const timestamps = this.cooldowns.get(command.name);

            if (timestamps.has(userId)) {
                const expirationTime = timestamps.get(userId);

                if (Number(now) > Number(expirationTime)) {
                    timestamps.delete(userId);
                } else {
                    const timeLeft = ms(Number(expirationTime) - now);
                    return { cooldown: true, wait: timeLeft };
                }
            }
            timestamps.set(userId, (now + cooldown));
            return { cooldown: false };
        } else if (this.client.database) {
            const data = await guild.getData();

            if (!data.users) data.users = {};
            if (!data.users[userId]) data.users[userId] = {};
            if (!data.users[userId]?.cooldowns) data.users[userId].cooldowns = {};

            const cooldowns = data.users[userId].cooldowns;

            if (cooldowns[command.name]) {
                const expirationTime = cooldowns[command.name];

                if (now > expirationTime) {
                    delete cooldowns[command.name];
                } else {
                    const timeLeft = ms(expirationTime - now);
                    return { cooldown: true, wait: timeLeft };
                }
            }
            cooldowns[command.name] = (now + cooldown);
            await guild.setData(data);
            return { cooldown: false };
        }
    }
    public getCommand(name: string): Command {
        let command = this.client.gcommands.get(this.caseSensitiveCommands ? name : name.toLowerCase());
        if (!command) {
            const alias = this.client.galiases.get(this.caseSensitiveCommands ? name : name.toLowerCase());
            if (alias) command = this.client.gcommands.get(alias);
        }
        return command;
    }
}
