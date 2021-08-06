const Color = require('../structures/Color'), { Events } = require('../util/Constants')
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
         * client
         * @type {Client}
        */
        this.client = this.GCommandsClient.client;

        /**
         * cmdDir
         * @type {string}
        */
        this.cmdDir = this.GCommandsClient.cmdDir;

        this.__loadCommandFiles();
    }

    /**
     * Internal method to loadCommandFiles
     * @returns {void}
     * @private
     */
     async __loadCommandFiles() {
        for await(let file of (await fs.readdirSync(`${__dirname}/../../../../${this.cmdDir}`))) {
            const fileName = file.split('.').reverse()[1]
            const fileType = file.split('.').reverse()[0]

            if(!['js','ts'].includes(fileType)) {
                this.__loadCommandCategoryFiles(file); 
                continue;
            }

            file = await require(`../../../../${this.cmdDir}${file}`);
            if(isClass(file)) {
                file = await new file(this.client);
                if(!(file instanceof Command)) return console.log(new Color(`&d[GCommands] &cCommand ${fileName} doesnt belong in Commands.`).getText());
            }

            this.client.gcommands.set(file.name, file);
            if(file && file.aliases && Array.isArray(file.aliases)) file.aliases.forEach(alias => this.client.galiases.set(alias, file.name));
            this.GCommandsClient.emit(Events.LOG, new Color('&d[GCommands] &aLoaded (File): &e➜   &3' + fileName, {json:false}).getText());
        }

        this.__loadSlashCommands();
    }

    /**
     * Internal method to loadCommandCategoryFiles
     * @returns {void}
     * @private
     */
    async __loadCommandCategoryFiles(categoryFolder) {
        for(let file of (await fs.readdirSync(`${__dirname}/../../../../${this.cmdDir}${categoryFolder}`))) {
            const fileName = file.split('.').reverse()[1]

            file = await require(`../../../../${this.cmdDir}${categoryFolder}/${file}`);
            if(isClass(file)) {
                file = await new file(this.client);
                if(!(file instanceof Command)) return console.log(new Color(`&d[GCommands] &cCommand ${fileName} doesnt belong in Commands.`).getText());
            }

            this.client.gcommands.set(file.name, file);
            if(file && file.aliases && Array.isArray(file.aliases)) file.aliases.forEach(alias => this.client.galiases.set(alias, file.name));
            this.GCommandsClient.emit(Events.LOG, new Color('&d[GCommands] &aLoaded (File): &e➜   &3' + fileName, {json:false}).getText());
        }
    }

    /**
     * Internal method to loadSlashCommands
     * @returns {void}
     * @private
     */
    __loadSlashCommands() {
        let keys = Array.from(this.client.gcommands.keys());
        this.__deleteNonExistCommands(keys);

        for(const commandName of keys) {
            const cmd = this.client.gcommands.get(commandName);
            if(String(cmd.slash) === 'false') return;

            if(cmd.expectedArgs) cmd.args = cmd.expectedArgs;

            let url = `https://discord.com/api/v9/applications/${this.client.user.id}/commands`;
            if(cmd.guildOnly) url = `https://discord.com/api/v9/applications/${this.client.user.id}/guilds/${cmd.guildOnly}/commands`;

            let config = {
                method: 'POST',
                headers: {
                    Authorization: `Bot ${this.client.token}`,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    name: cmd.name,
                    description: cmd.description,
                    options: cmd.args || []
                }), 
                url,
            }

            axios(config).then(() => {
                this.GCommandsClient.emit(Events.LOG, new Color('&d[GCommands] &aLoaded: &e➜   &3' + cmd.name, {json:false}).getText());
            })
            .catch((error) => {
                this.GCommandsClient.emit(Events.LOG, new Color(`&d[GCommands] ${error.response.status === 429 ? '&aWait &e' + ms(error.response.data['retry_after'] * 1000) : ''} &c${error} &e(${cmd.name})`, {json:false}).getText());

                if(error.response) {
                    if(error.response.status === 429) {
                        setTimeout(() => {
                            this.__tryAgain(cmd, config)
                        }, (error.response.data['retry_after']) * 1000)
                    } else {
                        this.GCommandsClient.emit(Events.DEBUG, new Color([
                            '&a----------------------',
                            '  &d[GCommands Debug] &3',
                            '&aCode: &b' + error.response.data.code,
                            '&aMessage: &b' + error.response.data.message,
                            '&a----------------------'
                        ]).getText()) 
                    }
                }
            })
        }
    }

    /**
     * Internal method to tryAgain
     * @returns {void}
     * @private
    */
    __tryAgain(cmd, config) {
        axios(config).then(() => {
            this.GCommandsClient.emit(Events.LOG, new Color('&d[GCommands] &aLoaded: &e➜   &3' + cmd.name, {json:false}).getText());
        })
        .catch((error) => {
            this.GCommandsClient.emit(Events.LOG, new Color(`&d[GCommands] ${error.response.status === 429 ? '&aWait &e' + ms(error.response.data['retry_after'] * 1000) : ''} &c${error} &e(${cmd.name})`, {json:false}).getText());
            
            if(error.response) {
                if(error.response.status === 429) {
                    setTimeout(() => {
                        this.__tryAgain(cmd, config)
                    }, (error.response.data['retry_after']) * 1000)
                }
            }
        })
    }


    /**
     * Internal method to deleteNonExistCommands
     * @returns {void}
     * @private
     */
    async __deleteNonExistCommands(commandFiles) {
        let allSlashCommands = await __getAllCommands(this.client);
        if(!allSlashCommands || allSlashCommands.length < 0) return;

        if(String(this.client.slash) === 'false') allSlashCommands.forEach(cmd => __deleteCmd(this.client, cmd.id));

        for(let slashCmd of allSlashCommands) {
            if(!commandFiles.some(c => slashCmd.name === c)) __deleteCmd(this.client, slashCmd.id);
            if(this.client.gcommands.get(slashCmd.name) && String(this.client.gcommands.get(slashCmd.name).slash) === 'false') __deleteCmd(this.client, slashCmd.id);
        }

        console.log(new Color('&d[GCommands TIP] &3Are guild commands not deleted when you delete them? Use this site for remove &ehttps://gcommands-slash-gui.netlify.app/').getText())
    }
}

module.exports = GCommandLoader;
