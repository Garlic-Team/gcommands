import * as fs from 'fs';
import * as path from 'path';
import * as ms from 'ms';
import { Routes } from 'discord-api-types/v9';
const base = 'https://discord.com/api/v9/';

import { Snowflake } from 'discord.js';
import hyttpo from 'hyttpo';

import { Command } from '../structures/Command';
import { GCommandsClient } from '../base/GCommandsClient';
import { Color } from '../structures/Color';
import { GError } from '../structures/GError';
import { InternalEvents, CommandType } from '../util/Constants';
import Util from '../util/util';

export class GCommandLoader {
    private client: GCommandsClient;
    private clientId: Snowflake;
    private dir: string;
    private autoCategory: boolean;
    private loadFromCache: boolean;
    private defaultType: Array<CommandType>;
    private allGlobalCommands;

    public constructor(client: GCommandsClient) {
        this.client = client;
        this.clientId = client.user.id;
        this.dir = this.client.options.loader.cmdDir;
        this.autoCategory = this.client.options.loader.autoCategory;
        this.loadFromCache = this.client.options.loader.loadFromCache;
        this.defaultType = this.client.options.commands.defaultType;
        this.allGlobalCommands = Util.__getAllCommands(this.client);

        this.client._applicationCommandsCache = [];

        this.load();
    }

    private async load() {
        await this.loadFiles(this.dir);

        await this.loadSlashCommands();
        await this.loadContextMenuCommands();
        await this.loadCommandPermissions();

        this.client.emit(InternalEvents.COMMANDS_LOADED, this.client.gcommands);
    }

    private async loadFiles(dir: string) {
        for await (const fsDirent of fs.readdirSync(dir, { withFileTypes: true })) {
            const rawFileName = fsDirent.name;
            const fileType = path.extname(rawFileName);
            const fileName = path.basename(rawFileName, fileType);

            if (fsDirent.isDirectory()) {
                await this.loadFiles(path.join(dir, rawFileName));
                continue;
            } else if (!['.js', '.ts'].includes(fileType)) { continue; }

            let file = await import(path.join(dir, rawFileName));
            if (file.default) file = file.default;
            else if (!file.name) file = Object.values(file)[0];

            if (Util.isClass(file)) {
                file = new file(this.client);
                if (!(file instanceof Command)) throw new GError('[COMMAND]', `Command ${fileName} doesnt belong in Commands.`);
            }

            file._path = `${dir}/${fileName}${fileType}`;
            if (this.autoCategory && !file.category) {
                const category = dir.replace(`${this.dir}/`, '');
                if (category && category !== this.dir) file.category = category.split('/').join(' ');
            }

            this.client.gcommands.set(file.name, file);
            if (file && file.aliases && Array.isArray(file.aliases)) file.aliases.forEach(alias => this.client.galiases.set(alias, file.name));
            this.client.emit(InternalEvents.LOG, new Color(`&d[GCommands] &aLoaded (File): &e➜   &3${fileName}`).getText());
        }
    }

    private async loadSlashCommands() {
        const keys = Array.from(this.client.gcommands.keys());
        this.deleteNonExistCommands(keys);

        for (const commandName of keys) {
            const cmd = this.client.gcommands.get(commandName);

            let url = `${base}${Routes.applicationCommands(this.clientId)}`;

            const loadSlashCommand = async (guildOnly?: Snowflake) => {
                if (this.loadFromCache) {
                    let ifAlready;
                    if (guildOnly) ifAlready = (await Util.__getAllCommands(this.client, guildOnly)).filter(c => c.name === cmd.name && c.type === 1);
                    else ifAlready = (await this.allGlobalCommands).filter(c => c.name === cmd.name && c.type === 1);

                    if (ifAlready.length > 0 && ((ifAlready[0].default_permission === false && ((Object.values(cmd)[10] || Object.values(cmd)[12]) !== undefined)) || (ifAlready[0].default_permission === true && ((Object.values(cmd)[10] || Object.values(cmd)[12]) === undefined))) && ifAlready[0].description === cmd.description && JSON.stringify(comparable(cmd.args)) === JSON.stringify(comparable(ifAlready[0].options))) { // eslint-disable-line max-len
                        this.client.emit(InternalEvents.LOG, new Color(`&d[GCommands] &aLoaded from cache (Slash): &e➜   &3${cmd.name}`).getText());
                        return;
                    }
                }

                const config = {
                    method: 'POST',
                    headers: {
                        Authorization: `Bot ${this.client.token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: cmd.name,
                        description: cmd.description,
                        options: cmd.args || [],
                        type: 1,
                        default_permission: guildOnly ? (Object.values(cmd)[10] || Object.values(cmd)[12]) === undefined : true,
                        channel_types: cmd.channelTypeOnly || null,
                    }),
                    url,
                };

                hyttpo.request(config)
                    .then(() => this.client.emit(InternalEvents.LOG, new Color(`&d[GCommands] &aLoaded (Slash): &e➜   &3${cmd.name}`).getText()))
                    .catch(error => {
                        this.client.emit(InternalEvents.LOG, new Color(`&d[GCommands] ${error?.status === 429 ? `&aWait &e${ms(error.data.retry_after * 1000)}` : ''} &c${error.status} ${error.data.message} &e(${cmd.name})`).getText());

                        if (error) {
                            if (error.status === 429) {
                                setTimeout(() => {
                                    this.tryAgain(cmd, config, 'Slash');
                                }, (error.data.retry_after) * 1000);
                            } else {
                                this.client.emit(InternalEvents.DEBUG, new Color([
                                    '&a----------------------',
                                    '  &d[GCommands Debug] &3',
                                    `&aCode: &b${error.data.code}`,
                                    `&aMessage: &b${error.data.message}`,
                                    '',
                                    `${error.data.errors ? '&aErrors:' : '&a----------------------'}`,
                                ]).getText());

                                if (error.data.errors) {
                                    Util.getAllObjects(this.client, error.data.errors);

                                    this.client.emit(InternalEvents.DEBUG, new Color([
                                        `&a----------------------`,
                                    ]).getText());
                                }
                            }
                        }
                    });
            };

            if (cmd.guildOnly) {
                if (typeof cmd.guildOnly === 'string') {
                    url = `${base}${Routes.applicationGuildCommands(this.clientId, cmd.guildOnly)}`;
                    await loadSlashCommand(cmd.guildOnly);
                } else {
                    for (const guildOnly of cmd.guildOnly) {
                        if (!guildOnly) {
                            await loadSlashCommand();
                            continue;
                        }
                        url = `${base}${Routes.applicationGuildCommands(this.clientId, guildOnly)}`;
                        await loadSlashCommand(guildOnly);
                    }
                }
            } else { await loadSlashCommand(); }
        }
    }

    async loadContextMenuCommands() {
        const keys = Array.from(this.client.gcommands.keys());

        for (const commandName of keys) {
            const cmd = this.client.gcommands.get(commandName);
            if (![CommandType.MESSAGE_CONTEXT_MENU, CommandType.USER_CONTEXT_MENU].includes(cmd.type)) continue;
            if (![CommandType.MESSAGE_CONTEXT_MENU, CommandType.USER_CONTEXT_MENU].includes(cmd.type) && String(this.client.context) === 'false') continue;

            let url = `${base}${Routes.applicationCommands(this.clientId)}`;
            const loadContextMenu = async (guildOnly?: string) => {
                if (this.client.loadFromCache) {
                    let ifAlready;
                    if (guildOnly) ifAlready = (await Util.__getAllCommands(this.client, guildOnly)).filter(c => c.name === cmd.name && [2, 3].includes(c.type));
                    else ifAlready = (await this.allGlobalCommands).filter(c => c.name === cmd.name && [2, 3].includes(c.type));

                    if (ifAlready.length > 0 && ifAlready[0].name === cmd.name) {
                        this.client.emit(InternalEvents.LOG, new Color(`&d[GCommands] &aLoaded from cache (Context Menu): &e➜   &3${cmd.name}`, { json: false }).getText());
                        return;
                    }
                }

                const config = {
                    method: 'POST',
                    headers: {
                        Authorization: `Bot ${this.client.token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: cmd.contextMenuName || cmd.name,
                        type: type === 4 ? 2 : type,
                    }),
                    url,
                };

                hyttpo.request(config).then(() => {
                    this.client.emit(InternalEvents.LOG, new Color(`&d[GCommands] &aLoaded (Context Menu (user)): &e➜   &3${cmd.name}`, { json: false }).getText());
                    if (type === 4) {
                        config.data = JSON.parse(config.data);
                        config.data.type = 3;
                        config.data = JSON.stringify(config.data);
                        this.tryAgain(cmd, config, 'Context Menu (message)');
                    }
                })
                    .catch(error => {
                        this.client.emit(InternalEvents.LOG, new Color(`&d[GCommands] ${error?.status === 429 ? `&aWait &e${ms(error.data.retry_after * 1000)}` : ''} &c${error} &e(${cmd.name})`, { json: false }).getText());

                        if (error) {
                            if (error.status === 429) {
                                setTimeout(() => {
                                    this.tryAgain(cmd, config, 'Context Menu');
                                }, (error.data.retry_after) * 1000);
                            } else {
                                this.client.emit(InternalEvents.DEBUG, new Color([
                                    '&a----------------------',
                                    '  &d[GCommands Debug] &3',
                                    `&aCode: &b${error.data.code}`,
                                    `&aMessage: &b${error.data.message}`,
                                    '',
                                    `${error.data.errors ? '&aErrors:' : '&a----------------------'}`,
                                ]).getText());

                                if (error.data.errors) {
                                    Util.getAllObjects(this.client, error.data.errors);

                                    this.client.emit(InternalEvents.DEBUG, new Color([
                                        `&a----------------------`,
                                    ]).getText());
                                }
                            }
                        }
                    });
            };

            if (cmd.guildOnly) {
                for (const guildOnly of cmd.guildOnly) {
                    if (!guildOnly) {
                        await loadContextMenu();
                        continue;
                    }

                    url = `${base}${Routes.applicationGuildCommands(this.clientId, guildOnly)}`;
                    await loadContextMenu();
                }
            } else {
                await loadContextMenu();
            }
        }
    }

    /**
     * Internal method to load command permissions
     * @returns {void}
     */
    async loadCommandPermissions() {
        const keys = Array.from(this.client.gcommands.keys());

        for (const commandName in keys) {
            const cmd = this.client.gcommands.get(keys[commandName]);

            if ((Object.values(cmd)[10] || Object.values(cmd)[12]) === undefined) continue;

            const loadCommandPermission = async apiCommands => {
                for (const apiCommand of apiCommands) {
                    if (![1].includes(apiCommand.type)) continue;

                    let url;
                    const loadApiCmd = async () => {
                        const finalData = [];

                        if (cmd.userRequiredRoles) {
                            if (!Array.isArray(cmd.userRequiredRoles)) cmd.userRequiredRoles = [cmd.userRequiredRoles];

                            for await (const roleId of cmd.userRequiredRoles) {
                                finalData.push({
                                    id: roleId,
                                    type: 1,
                                    permission: true,
                                });
                            }
                        }

                        if (cmd.userOnly) {
                            if (!Array.isArray(cmd.userOnly)) cmd.userOnly = [cmd.userOnly];

                            for await (const userId of cmd.userOnly) {
                                finalData.push({
                                    id: userId,
                                    type: 2,
                                    permission: true,
                                });
                            }
                        }

                        const config = {
                            method: 'PUT',
                            headers: {
                                Authorization: `Bot ${this.client.token}`,
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                permissions: finalData,
                            }),
                            url,
                        };

                        hyttpo.request(config).then(() => this.client.emit(InternalEvents.LOG, new Color(`&d[GCommands] &aLoaded (Permission): &e➜   &3${cmd.name}`, { json: false }).getText()))
                            .catch(error => {
                                this.client.emit(InternalEvents.LOG, new Color(`&d[GCommands] ${error?.status === 429 ? `&aWait &e${ms(error.data.retry_after * 1000)}` : ''} &c${error} &e(${cmd.name})`, { json: false }).getText());

                                if (error) {
                                    if (error.status === 429) {
                                        setTimeout(() => {
                                            this.tryAgain(cmd, config, 'Permission');
                                        }, (error.data.retry_after) * 1000);
                                    } else {
                                        this.client.emit(InternalEvents.DEBUG, new Color([
                                            '&a----------------------',
                                            '  &d[GCommands Debug] &3',
                                            `&aCode: &b${error.data.code}`,
                                            `&aMessage: &b${error.data.message}`,
                                            '',
                                            `${error.data.errors ? '&aErrors:' : '&a----------------------'}`,
                                        ]).getText());

                                        if (error.data.errors) {
                                            Util.getAllObjects(this.client, error.data.errors);

                                            this.client.emit(InternalEvents.DEBUG, new Color([
                                                `&a----------------------`,
                                            ]).getText());
                                        }
                                    }
                                }
                            });
                    };

                    if (cmd.guildOnly) {
                        for (const gOnly of cmd.guildOnly) {
                            if (gOnly) url = `${base}${Routes.applicationCommandPermissions(this.client.user.id, gOnly, apiCommand.id)}`;
                            await loadApiCmd();
                        }
                    }
                }
            };

            if (cmd.guildOnly) {
                for (const guildOnly of cmd.guildOnly) {
                    if (!guildOnly) {
                        const apiCommandsNoGuild = (await this.allGlobalCommands).filter(c => c.name === cmd.name);

                        await loadCommandPermission(apiCommandsNoGuild);
                        continue;
                    }

                    const apiCommands = (await Util.__getAllCommands(this.client, guildOnly)).filter(c => c.name === cmd.name);
                    await loadCommandPermission(apiCommands);
                }
            } else {
                const apiCommands = (await this.allGlobalCommands).filter(c => c.name === cmd.name);
                await loadCommandPermission(apiCommands);
            }
        }
    }

    /**
     * Internal method to try loading again
     * @returns {void}
    */
    tryAgain(cmd, config, type) {
        hyttpo.request(config).then(() => this.client.emit(InternalEvents.LOG, new Color(`&d[GCommands] &aLoaded (${type}): &e➜   &3${cmd.name}`, { json: false }).getText()))
            .catch(error => {
                this.client.emit(InternalEvents.LOG, new Color(`&d[GCommands] ${error?.status === 429 ? `&aWait &e${ms(error.data.retry_after * 1000)}` : ''} &c${error} &e(${cmd.name})`, { json: false }).getText());

                if (error && error.status === 429) {
                    setTimeout(() => {
                        this.tryAgain(cmd, config, type);
                    }, (error.data.retry_after) * 1000);
                }
            });
    }

    /**
     * Internal method to delete non existent commands
     * @returns {void}
     */
    async deleteNonExistCommands(commandFiles) {
        if (!this.client.deleteNonExistent) return;

        const deleteAllGlobalCommands = async () => {
            const allSlashCommands = await Util.__getAllCommands(this.client);
            if (!allSlashCommands || allSlashCommands.length < 0) return;

            for (const slashCmd of allSlashCommands) {
                if (!commandFiles.some(c => slashCmd.name === c)) Util.__deleteCmd(this.client, slashCmd.id);
                else if (this.client.gcommands.get(slashCmd.name) && ['false', 'message'].includes(String(this.client.gcommands.get(slashCmd.name).slash))) Util.__deleteCmd(this.client, slashCmd.id);
                else if (!this.client.gcommands.get(slashCmd.name).slash && ['false', 'message'].includes(String(this.client.slash))) Util.__deleteCmd(this.client, slashCmd.id);
                else continue;
                this.client.emit(InternalEvents.LOG, new Color(`&d[GCommands] &aDeleted: &e➜   &3${slashCmd.name}`, { json: false }).getText());
            }
        };

        const deleteAllGuildCommands = async () => {
            const guilds = this.client.guilds.cache.map(guild => guild.id);
            for (const guild of guilds) {
                const allGuildSlashCommands = await Util.__getAllCommands(this.client, guild);
                if (!allGuildSlashCommands || allGuildSlashCommands.length < 0) return;

                for (const slashCmd of allGuildSlashCommands) {
                    if (!commandFiles.some(c => slashCmd.name === c)) Util.__deleteCmd(this.client, slashCmd.id, guild);
                    else if (this.client.gcommands.get(slashCmd.name) && ['false', 'message'].includes(String(this.client.gcommands.get(slashCmd.name).slash))) Util.__deleteCmd(this.client, slashCmd.id, guild);
                    else if (!this.client.gcommands.get(slashCmd.name).slash && ['false', 'message'].includes(String(this.client.slash))) Util.__deleteCmd(this.client, slashCmd.id, guild);
                    else continue;
                    this.client.emit(InternalEvents.LOG, new Color(`&d[GCommands] &aDeleted (guild: ${guild}): &e➜   &3${slashCmd.name}`, { json: false }).getText());
                }
            }
        };
        await deleteAllGlobalCommands();
        await deleteAllGuildCommands();
    }
}
