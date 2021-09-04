const Color = require('../structures/Color'), { Events, ApplicationCommandTypesRaw } = require('../util/Constants');
const axios = require('axios');
const fs = require('fs');
const ms = require('ms');
const { isClass, __deleteCmd, __getAllCommands } = require('../util/util');
const Command = require('../commands/base');

/**
 * The GCommandLoader class
 */
class GCommandLoader {
    /**
     * The GCommandLoader class
     * @param {GCommands} GCommandsClient
     */
    constructor(GCommandsClient) {
        /**
         * GCommandsClient
         * @type {GCommands}
        */
        this.GCommandsClient = GCommandsClient;

        /**
         * Client
         * @type {Client}
        */
        this.client = this.GCommandsClient.client;

        /**
         * CmdDir
         * @type {string}
        */
        this.cmdDir = this.GCommandsClient.cmdDir;

        /**
         * All Global Commands
         * @type {Object}
        */
        this._allGlobalCommands = __getAllCommands(this.client);

        this.client._applicationCommandsCache = [];

        this.__loadCommandFiles();
    }

    /**
     * Internal method to loadCommandFiles
     * @returns {void}
     * @private
     */
     async __loadCommandFiles() {
        for await (let file of (await fs.readdirSync(`${__dirname}/../../../../${this.cmdDir}`))) {
            const fileName = file.split('.').reverse()[1] || file;
            const fileType = file.split('.').reverse()[0];

            if (!['js','ts'].includes(fileType)) {
                await this.__loadCommandCategoryFiles(file);
                continue;
            }

            file = await require(`../../../../${this.cmdDir}${file}`);
            if (isClass(file)) {
                file = await new file(this.client);
                if (!(file instanceof Command)) return console.log(new Color(`&d[GCommands] &cCommand ${fileName} doesnt belong in Commands.`).getText());
            }

            file._path = `../../../../${this.cmdDir}/${fileName}.${fileType}`;

            this.client.gcommands.set(file.name, file);
            if (file && file.aliases && Array.isArray(file.aliases)) file.aliases.forEach(alias => this.client.galiases.set(alias, file.name));
            this.GCommandsClient.emit(Events.LOG, new Color(`&d[GCommands] &aLoaded (File): &e➜   &3${fileName}`, { json: false }).getText());
        }

        this.__loadSlashCommands();
        this.__loadContextMenuCommands();
    }

    /**
     * Internal method to loadCommandCategoryFiles
     * @returns {void}
     * @private
     */
    async __loadCommandCategoryFiles(categoryFolder) {
        for await (let file of (await fs.readdirSync(`${__dirname}/../../../../${this.cmdDir}${categoryFolder}`))) {
            const fileName = file.split('.').reverse()[1];
            const fileType = file.split('.').reverse()[0];

            file = await require(`../../../../${this.cmdDir}${categoryFolder}/${file}`);
            if (isClass(file)) {
                file = await new file(this.client);
                if (!(file instanceof Command)) return console.log(new Color(`&d[GCommands] &cCommand ${fileName} doesnt belong in Commands.`).getText());
            }

            file._path = `../../../../${this.cmdDir}${categoryFolder}/${fileName}.${fileType}`;

            this.client.gcommands.set(file.name, file);
            if (file && file.aliases && Array.isArray(file.aliases)) file.aliases.forEach(alias => this.client.galiases.set(alias, file.name));
            this.GCommandsClient.emit(Events.LOG, new Color(`&d[GCommands] &aLoaded (File): &e➜   &3${fileName}`, { json: false }).getText());
        }
    }

    /**
     * Internal method to loadSlashCommands
     * @returns {void}
     * @private
     */
    async __loadSlashCommands() {
        if (String(this.client.slash) === 'false') return;

        let keys = Array.from(this.client.gcommands.keys());
        this.__deleteNonExistCommands(keys);

        for (const commandName of keys) {
            const cmd = this.client.gcommands.get(commandName);
            if (String(cmd.slash) === 'false') return;

            if (cmd.expectedArgs) cmd.args = cmd.expectedArgs;

            let url = `https://discord.com/api/v9/applications/${this.client.user.id}/commands`;
            if (cmd.guildOnly) url = `https://discord.com/api/v9/applications/${this.client.user.id}/guilds/${cmd.guildOnly}/commands`;

            let ifAlready;
            if (cmd.guildOnly) ifAlready = (await __getAllCommands(this.client, cmd.guildOnly)).filter(c => c.name === cmd.name && c.type === 1);
            else ifAlready = (await this._allGlobalCommands).filter(c => c.name === cmd.name && c.type === 1);

            if (ifAlready.length > 0 && ifAlready[0].description === cmd.description && ifAlready[0].args === cmd.args) {
                this.GCommandsClient.emit(Events.LOG, new Color(`&d[GCommands] &aLoaded from cache (Slash): &e➜   &3${cmd.name}`, { json: false }).getText());
                continue;
            }

            let config = {
                method: 'POST',
                headers: {
                    Authorization: `Bot ${this.client.token}`,
                    'Content-Type': 'application/json',
                },
                data: {
                    name: cmd.name,
                    description: cmd.description,
                    options: cmd.args || [],
                    type: 1,
                },
                url,
            };

            axios(config).then(() => {
                this.GCommandsClient.emit(Events.LOG, new Color(`&d[GCommands] &aLoaded (Slash): &e➜   &3${cmd.name}`, { json: false }).getText());
            })
            .catch(error => {
                this.GCommandsClient.emit(Events.LOG, new Color(`&d[GCommands] ${error.response.status === 429 ? `&aWait &e${ms(error.response.data.retry_after * 1000)}` : ''} &c${error} &e(${cmd.name})`, { json: false }).getText());

                if (error.response) {
                    if (error.response.status === 429) {
                        setTimeout(() => {
                            this.__tryAgain(cmd, config, 'Slash');
                        }, (error.response.data.retry_after) * 1000);
                    } else {
                        this.GCommandsClient.emit(Events.DEBUG, new Color([
                            '&a----------------------',
                            '  &d[GCommands Debug] &3',
                            `&aCode: &b${error.response.data.code}`,
                            `&aMessage: &b${error.response.data.message}`,
                            '&a----------------------',
                        ]).getText());
                    }
                }
            });
        }
    }

    /**
     * Internal method to loadContextMenuCommands
     * @returns {void}
     * @private
     */
    async __loadContextMenuCommands() {
        if (String(this.client.context) === 'false') return;

        let keys = Array.from(this.client.gcommands.keys());

        for (const commandName of keys) {
            const cmd = this.client.gcommands.get(commandName);
            if (String(cmd.context) === 'false') return;

            if (cmd.expectedArgs) cmd.args = cmd.expectedArgs;

            let url = `https://discord.com/api/v9/applications/${this.client.user.id}/commands`;
            if (cmd.guildOnly) url = `https://discord.com/api/v9/applications/${this.client.user.id}/guilds/${cmd.guildOnly}/commands`;

            let ifAlready;
            if (cmd.guildOnly) ifAlready = (await __getAllCommands(this.client, cmd.guildOnly)).filter(c => c.name === cmd.name && [2, 3].includes(c.type));
            else ifAlready = (await this._allGlobalCommands).filter(c => c.name === cmd.name && [2, 3].includes(c.type));

            if (ifAlready.length > 0 && ifAlready[0].name === cmd.name) {
                this.GCommandsClient.emit(Events.LOG, new Color(`&d[GCommands] &aLoaded from cache (Context Menu): &e➜   &3${cmd.name}`, { json: false }).getText());
                continue;
            }

            let type = cmd.context ? ApplicationCommandTypesRaw[cmd.context] : ApplicationCommandTypesRaw[this.client.context];
            let config = {
                method: 'POST',
                headers: {
                    Authorization: `Bot ${this.client.token}`,
                    'Content-Type': 'application/json',
                },
                data: {
                    name: cmd.name,
                    type: type === 4 ? 2 : type,
                },
                url,
            };

            axios(config).then(() => {
                this.GCommandsClient.emit(Events.LOG, new Color(`&d[GCommands] &aLoaded (Context Menu (user)): &e➜   &3${cmd.name}`, { json: false }).getText());
                if (type === 4) {
                    config.data = JSON.parse(config.data);
                    config.data.type = 3;
                    config.data = JSON.stringify(config.data);
                    this.__tryAgain(cmd, config, 'Context Menu (message)');
                }
            })
            .catch(error => {
                this.GCommandsClient.emit(Events.LOG, new Color(`&d[GCommands] ${error.response.status === 429 ? `&aWait &e${ms(error.response.data.retry_after * 1000)}` : ''} &c${error} &e(${cmd.name})`, { json: false }).getText());

                if (error.response) {
                    if (error.response.status === 429) {
                        setTimeout(() => {
                            this.__tryAgain(cmd, config, 'Context Menu');
                        }, (error.response.data.retry_after) * 1000);
                    } else {
                        this.GCommandsClient.emit(Events.DEBUG, new Color([
                            '&a----------------------',
                            '  &d[GCommands Debug] &3',
                            `&aCode: &b${error.response.data.code}`,
                            `&aMessage: &b${error.response.data.message}`,
                            '&a----------------------',
                        ]).getText());
                    }
                }
            });
        }
    }

    /**
     * Internal method to tryAgain
     * @returns {void}
     * @private
    */
    __tryAgain(cmd, config, type) {
        axios(config).then(() => {
            this.GCommandsClient.emit(Events.LOG, new Color(`&d[GCommands] &aLoaded (${type}): &e➜   &3${cmd.name}`, { json: false }).getText());
        })
        .catch(error => {
            this.GCommandsClient.emit(Events.LOG, new Color(`&d[GCommands] ${error.response.status === 429 ? `&aWait &e${ms(error.response.data.retry_after * 1000)}` : ''} &c${error} &e(${cmd.name})`, { json: false }).getText());

            if (error.response) {
                if (error.response.status === 429) {
                    setTimeout(() => {
                        this.__tryAgain(cmd, config, type);
                    }, (error.response.data.retry_after) * 1000);
                }
            }
        });
    }

    /**
     * Internal method to deleteNonExistCommands
     * @returns {void}
     * @private
     */
    async __deleteNonExistCommands(commandFiles) {
        let allSlashCommands = await __getAllCommands(this.client);
        if (!allSlashCommands || allSlashCommands.length < 0) return;

        if (String(this.client.slash) === 'false') allSlashCommands.forEach(cmd => __deleteCmd(this.client, cmd.id));

        for (let slashCmd of allSlashCommands) {
            if (!commandFiles.some(c => slashCmd.name === c)) __deleteCmd(this.client, slashCmd.id);
            if (this.client.gcommands.get(slashCmd.name) && String(this.client.gcommands.get(slashCmd.name).slash) === 'false') __deleteCmd(this.client, slashCmd.id);
        }

        console.log(new Color('&d[GCommands TIP] &3Are guild commands not deleted when you delete them? Use this site for remove &ehttps://gcommands-slash-gui.netlify.app/').getText());
    }
}

module.exports = GCommandLoader;
