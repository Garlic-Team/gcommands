const Color = require('../structures/Color'), GError = require('../structures/GError'), { Events, ApplicationCommandTypesRaw } = require('../util/Constants');
const { default: hyttpo } = require('hyttpo');
const path = require('path');
const fs = require('fs');
const ms = require('ms');
const { isClass, __deleteCmd, __getAllCommands, comparable, getAllObjects } = require('../util/util');
const Command = require('../structures/Command');
/**
 * The loader for command files, slash commands, context menu's and permissions
 * @private
 */
class GCommandLoader {
    /**
     * @param {GCommandsClient} client
     * @constructor
     */
    constructor(client) {
        /**
         * The client
         * @type {GCommandsClient}
        */
        this.client = client;

        /**
         * The path to the command files
         * @type {string}
        */
        this.cmdDir = this.client.cmdDir;

        /**
         * Whether auto category is enabled
         * @type {boolean}
        */
        this.autoCategory = this.client.autoCategory;

        /**
         * All the global commands of the application
         * @type {Object}
        */
        this._allGlobalCommands = __getAllCommands(this.client);

        this.client._applicationCommandsCache = [];

        this.__load();
    }

    /**
     * Internal method to load everything
     * @returns {void}
     */
    async __load() {
        await this.__loadFiles(this.cmdDir);

        await this.__loadSlashCommands();
        await this.__loadContextMenuCommands();
        await this.__loadCommandPermissions();

        this.client.emit(Events.COMMANDS_LOADED, this.client.gcommands);
    }

    /**
     * Internal method to load files
     * @returns {void}
     */
    async __loadFiles(dir) {
        for await (const fsDirent of fs.readdirSync(dir, { withFileTypes: true })) {
            let file = fsDirent.name;
            const fileType = path.extname(file);
            const fileName = path.basename(file, fileType);

            if (fsDirent.isDirectory()) {
                await this.__loadFiles(path.join(dir, file));
                continue;
            } else if (!['.js', '.ts'].includes(fileType)) { continue; }

            file = require(path.join(dir, file));
            if (isClass(file)) {
                file = new file(this.client);
                if (!(file instanceof Command)) throw new GError('[COMMAND]', `Command ${fileName} doesnt belong in Commands.`);
            }

            file._path = `${dir}/${fileName}${fileType}`;
            if (this.autoCategory && !file.category) {
                const category = dir.replace(`${this.cmdDir}/`, '');
                if (category && category !== this.cmdDir) file.category = category.split('/').join(' ');
            }

            this.client.gcommands.set(file.name, file);
            if (file && file.aliases && Array.isArray(file.aliases)) file.aliases.forEach(alias => this.client.galiases.set(alias, file));
            this.client.emit(Events.LOG, new Color(`&d[GCommands] &aLoaded (File): &e➜   &3${fileName}`, { json: false }).getText());
        }
    }

    /**
     * Internal method to loadSlashCommands
     * @returns {void}
     */
    async __loadSlashCommands() {
        const keys = Array.from(this.client.gcommands.keys());
        this.__deleteNonExistCommands(keys);

        for (const commandName of keys) {
            const cmd = this.client.gcommands.get(commandName);
            if (['false', 'message'].includes(String(cmd.slash))) continue;
            if (!cmd.slash && ['false', 'message'].includes(String(this.client.slash))) continue;

            let url = `https://discord.com/api/v9/applications/${this.client.user.id}/commands`;

            const loadSlashCommand = async guildOnly => {
                if (this.client.loadFromCache) {
                    let ifAlready;
                    if (guildOnly) ifAlready = (await __getAllCommands(this.client, guildOnly)).filter(c => c.name === cmd.name && c.type === 1);
                    else ifAlready = (await this._allGlobalCommands).filter(c => c.name === cmd.name && c.type === 1);

                    if (ifAlready.length > 0 && ((ifAlready[0].default_permission === false && ((Object.values(cmd)[10] || Object.values(cmd)[12]) !== undefined)) || (ifAlready[0].default_permission === true && ((Object.values(cmd)[10] || Object.values(cmd)[12]) === undefined))) && ifAlready[0].description === cmd.description && JSON.stringify(comparable(cmd.args)) === JSON.stringify(comparable(ifAlready[0].options))) { // eslint-disable-line max-len
                        this.client.emit(Events.LOG, new Color(`&d[GCommands] &aLoaded from cache (Slash): &e➜   &3${cmd.name}`, { json: false }).getText());
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
                        channel_types: cmd.channel_types || null,
                    }),
                    url,
                };

                hyttpo.request(config)
                    .then(() => this.client.emit(Events.LOG, new Color(`&d[GCommands] &aLoaded (Slash): &e➜   &3${cmd.name}`, { json: false }).getText()))
                    .catch(error => {
                        this.client.emit(Events.LOG, new Color(`&d[GCommands] ${error?.status === 429 ? `&aWait &e${ms(error.data.retry_after * 1000)}` : ''} &c${error.status} ${error.data.message} &e(${cmd.name})`, { json: false }).getText());

                        if (error) {
                            if (error.status === 429) {
                                setTimeout(() => {
                                    this.__tryAgain(cmd, config, 'Slash');
                                }, (error.data.retry_after) * 1000);
                            } else {
                                this.client.emit(Events.DEBUG, new Color([
                                    '&a----------------------',
                                    '  &d[GCommands Debug] &3',
                                    `&aCode: &b${error.data.code}`,
                                    `&aMessage: &b${error.data.message}`,
                                    '',
                                    `${error.data.errors ? '&aErrors:' : '&a----------------------'}`,
                                ]).getText());

                                if (error.data.errors) {
                                    getAllObjects(this.client, error.data.errors);

                                    this.client.emit(Events.DEBUG, new Color([
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
                        await loadSlashCommand();
                        continue;
                    }

                    url = `https://discord.com/api/v9/applications/${this.client.user.id}/guilds/${guildOnly}/commands`;
                    await loadSlashCommand(guildOnly);
                }
            } else { await loadSlashCommand(); }
        }
    }

    /**
     * Internal method to load context menu's
     * @returns {void}
     */
    async __loadContextMenuCommands() {
        const keys = Array.from(this.client.gcommands.keys());

        for (const commandName of keys) {
            const cmd = this.client.gcommands.get(commandName);
            if (String(cmd.context) === 'false') continue;
            if (!cmd.context && String(this.client.context) === 'false') continue;

            let url = `https://discord.com/api/v9/applications/${this.client.user.id}/commands`;
            const loadContextMenu = async guildOnly => {
                if (this.client.loadFromCache) {
                    let ifAlready;
                    if (guildOnly) ifAlready = (await __getAllCommands(this.client, guildOnly)).filter(c => c.name === cmd.name && [2, 3].includes(c.type));
                    else ifAlready = (await this._allGlobalCommands).filter(c => c.name === cmd.name && [2, 3].includes(c.type));

                    if (ifAlready.length > 0 && ifAlready[0].name === cmd.name) {
                        this.client.emit(Events.LOG, new Color(`&d[GCommands] &aLoaded from cache (Context Menu): &e➜   &3${cmd.name}`, { json: false }).getText());
                        return;
                    }
                }

                const type = cmd.context ? ApplicationCommandTypesRaw[cmd.context] : ApplicationCommandTypesRaw[this.client.context];
                const config = {
                    method: 'POST',
                    headers: {
                        Authorization: `Bot ${this.client.token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: cmd.contextMenuName !== 'undefined' ? cmd.contextMenuName : cmd.name,
                        type: type === 4 ? 2 : type,
                    }),
                    url,
                };

                hyttpo.request(config).then(() => {
                    this.client.emit(Events.LOG, new Color(`&d[GCommands] &aLoaded (Context Menu (user)): &e➜   &3${cmd.name}`, { json: false }).getText());
                    if (type === 4) {
                        config.data = JSON.parse(config.data);
                        config.data.type = 3;
                        config.data = JSON.stringify(config.data);
                        this.__tryAgain(cmd, config, 'Context Menu (message)');
                    }
                })
                    .catch(error => {
                        this.client.emit(Events.LOG, new Color(`&d[GCommands] ${error?.status === 429 ? `&aWait &e${ms(error.data.retry_after * 1000)}` : ''} &c${error} &e(${cmd.name})`, { json: false }).getText());

                        if (error) {
                            if (error.status === 429) {
                                setTimeout(() => {
                                    this.__tryAgain(cmd, config, 'Context Menu');
                                }, (error.data.retry_after) * 1000);
                            } else {
                                this.client.emit(Events.DEBUG, new Color([
                                    '&a----------------------',
                                    '  &d[GCommands Debug] &3',
                                    `&aCode: &b${error.data.code}`,
                                    `&aMessage: &b${error.data.message}`,
                                    '',
                                    `${error.data.errors ? '&aErrors:' : '&a----------------------'}`,
                                ]).getText());

                                if (error.data.errors) {
                                    getAllObjects(this.client, error.data.errors);

                                    this.client.emit(Events.DEBUG, new Color([
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

                    url = `https://discord.com/api/v9/applications/${this.client.user.id}/guilds/${guildOnly}/commands`;
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
    async __loadCommandPermissions() {
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

                        hyttpo.request(config).then(() => this.client.emit(Events.LOG, new Color(`&d[GCommands] &aLoaded (Permission): &e➜   &3${cmd.name}`, { json: false }).getText()))
                            .catch(error => {
                                this.client.emit(Events.LOG, new Color(`&d[GCommands] ${error?.status === 429 ? `&aWait &e${ms(error.data.retry_after * 1000)}` : ''} &c${error} &e(${cmd.name})`, { json: false }).getText());

                                if (error) {
                                    if (error.status === 429) {
                                        setTimeout(() => {
                                            this.__tryAgain(cmd, config, 'Permission');
                                        }, (error.data.retry_after) * 1000);
                                    } else {
                                        this.client.emit(Events.DEBUG, new Color([
                                            '&a----------------------',
                                            '  &d[GCommands Debug] &3',
                                            `&aCode: &b${error.data.code}`,
                                            `&aMessage: &b${error.data.message}`,
                                            '',
                                            `${error.data.errors ? '&aErrors:' : '&a----------------------'}`,
                                        ]).getText());

                                        if (error.data.errors) {
                                            getAllObjects(this.client, error.data.errors);

                                            this.client.emit(Events.DEBUG, new Color([
                                                `&a----------------------`,
                                            ]).getText());
                                        }
                                    }
                                }
                            });
                    };

                    if (cmd.guildOnly) {
                        for (const gOnly of cmd.guildOnly) {
                            if (gOnly) url = `https://discord.com/api/v9/applications/${this.client.user.id}/guilds/${gOnly}/commands/${apiCommand.id}/permissions`;
                            await loadApiCmd();
                        }
                    }
                }
            };

            if (cmd.guildOnly) {
                for (const guildOnly of cmd.guildOnly) {
                    if (!guildOnly) {
                        const apiCommandsNoGuild = (await this._allGlobalCommands).filter(c => c.name === cmd.name);

                        await loadCommandPermission(apiCommandsNoGuild);
                        continue;
                    }

                    const apiCommands = (await __getAllCommands(this.client, guildOnly)).filter(c => c.name === cmd.name);
                    await loadCommandPermission(apiCommands, guildOnly);
                }
            } else {
                const apiCommands = (await this._allGlobalCommands).filter(c => c.name === cmd.name);
                await loadCommandPermission(apiCommands);
            }
        }
    }

    /**
     * Internal method to try loading again
     * @returns {void}
    */
    __tryAgain(cmd, config, type) {
        hyttpo.request(config).then(() => this.client.emit(Events.LOG, new Color(`&d[GCommands] &aLoaded (${type}): &e➜   &3${cmd.name}`, { json: false }).getText()))
            .catch(error => {
                this.client.emit(Events.LOG, new Color(`&d[GCommands] ${error?.status === 429 ? `&aWait &e${ms(error.data.retry_after * 1000)}` : ''} &c${error} &e(${cmd.name})`, { json: false }).getText());

                if (error && error.status === 429) {
                    setTimeout(() => {
                        this.__tryAgain(cmd, config, type);
                    }, (error.data.retry_after) * 1000);
                }
            });
    }

    /**
     * Internal method to delete non existent commands
     * @returns {void}
     */
    async __deleteNonExistCommands(commandFiles) {
        if (!this.client.deleteNonExistent) return;
        const deleteAllGlobalCommands = async () => {
            const allSlashCommands = await __getAllCommands(this.client);
            if (!allSlashCommands || allSlashCommands.length < 0) return;

            for (const slashCmd of allSlashCommands) {
                if (!commandFiles.some(c => slashCmd.name === c)) __deleteCmd(this.client, slashCmd.id);
                else if (this.client.gcommands.get(slashCmd.name) && ['false', 'message'].includes(String(this.client.gcommands.get(slashCmd.name).slash))) __deleteCmd(this.client, slashCmd.id);
                else if (!this.client.gcommands.get(slashCmd.name).slash && ['false', 'message'].includes(String(this.client.slash))) __deleteCmd(this.client, slashCmd.id);
                else continue;
                this.client.emit(Events.LOG, new Color(`&d[GCommands] &aDeleted: &e➜   &3${slashCmd.name}`, { json: false }).getText());
            }
        };
        const deleteAllGuildCommands = async () => {
            const guilds = this.client.guilds.cache.map(guild => guild.id);
            for (const guild of guilds) {
                const allGuildSlashCommands = await __getAllCommands(this.client, guild);
                if (!allGuildSlashCommands || allGuildSlashCommands.length < 0) return;

                for (const slashCmd of allGuildSlashCommands) {
                    if (!commandFiles.some(c => slashCmd.name === c)) __deleteCmd(this.client, slashCmd.id, guild);
                    else if (this.client.gcommands.get(slashCmd.name) && ['false', 'message'].includes(String(this.client.gcommands.get(slashCmd.name).slash))) __deleteCmd(this.client, slashCmd.id, guild);
                    else if (!this.client.gcommands.get(slashCmd.name).slash && ['false', 'message'].includes(String(this.client.slash))) __deleteCmd(this.client, slashCmd.id, guild);
                    else continue;
                    this.client.emit(Events.LOG, new Color(`&d[GCommands] &aDeleted (guild: ${guild}): &e➜   &3${slashCmd.name}`, { json: false }).getText());
                }
            }
        };
        await deleteAllGlobalCommands();
        await deleteAllGuildCommands();
    }
}

module.exports = GCommandLoader;
