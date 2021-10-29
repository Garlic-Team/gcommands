import { Collection, User, Team, Guild } from 'discord.js';

import { GCommandsClient } from './GCommandsClient';

export class GCommandsDispatcher {
    private client: GCommandsClient;
    private inhibitors: Set<() => boolean>;
    private cooldowns: Collection<string, Collection<string, string>>;
    public owners: Collection<string, User>;

    public constructor(client: GCommandsClient) {
        this.client = client;
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
        } catch { return false; }
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
}
