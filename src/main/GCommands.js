const { promisify } = require('util');
const path = require('path');
const glob = promisify(require('glob'));
const Color = require("../color/Color");
const Events = require('./Events');
const { Collection, Structures, APIMessage } = require('discord.js');
const axios = require("axios");
const fs = require("fs");

module.exports = class GCommands {
    constructor(client, options = {}) {
        if (typeof client !== 'object') return console.log(new Color("&d[GCommands] &cNo discord.js client provided!",{json:false}).getText());
        if (!Object.keys(options).length) return console.log(new Color("&d[GCommands] &cNo default options provided!",{json:false}).getText());
        if(!options.cmdDir) return console.log(new Color("&d[GCommands] &cNo default options provided! (cmdDir)",{json:false}).getText());

        if(!client) console.log(new Color("&d[GCommands] &cNo discord.js client provided!"));

        this.client = client;

        this.client.commands = new Collection();
        this.client.aliases = new Collection();

        this.commands = new Collection();
        this.cooldowns = new Collection();

        this.cmdDir = options.cmdDir;
        this.mongodb = options.mongodb;

	this.client.categories = fs.readdirSync("./" + this.cmdDir + "/");
	    
        this.prefix = options.slash.prefix ? options.slash.prefix : undefined;
        this.slash = options.slash.slash ? options.slash.slash : false;
        this.cooldownMessage = options.cooldown.message ? options.cooldown.message : "Please wait {cooldown} more second(s) before reusing the \`{cmdname}\` command.";
        this.cooldownDefault = options.cooldown.default ? options.cooldown.default : 0;

        if(options.errorMessage) {
            this.errorMessage = options.errorMessage;
        }

        this.__loadCommands();
        
        Events.normalCommands(this.client, this.slash, this.commands, this.cooldowns, this.errorMessage, this.prefix)
        Events.slashCommands(this.client, this.slash, this.commands, this.cooldowns, this.errorMessage)
    }

    async __loadCommands() {
		fs.readdirSync("./" + this.cmdDir).forEach(dir => {
            const commands = fs.readdirSync(`./${this.cmdDir}/${dir}/`).filter(file => file.endsWith(".js"));

            for (let file of commands) {
                let pull = require("../" + this.cmdDir + "/" + dir + "/" + file);

                if (pull.name) {
                    this.commands.set(pull.name, pull);
                    this.client.commands.set(pull.name, pull);
                }

                if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => this.client.aliases.set(alias, pull.name));
            }
		});
        this.__deleteAllCmds();
    }

    async __createCommands() {
        var po = await this.__getAllCommands();

        let keys = Array.from(this.commands.keys());
        keys.forEach(async (cmdname) => {
            var options = [];
            var subCommandGroup = {};
            var subCommand = [];
            const cmd = this.commands.get(cmdname)

            if(cmd.subCommandGroup) {
                subCommandGroup = [
                    {
                        name: cmd.subCommandGroup,
                        description: cmd.subCommandGroup,
                        type: 2
                    }
                ]
            }

            if (cmd.expectedArgs && cmd.minArgs) {
                const split = cmd.expectedArgs
                  .substring(1, cmd.expectedArgs.length - 1)
                  .split(/[>\]] [<\[]/)

                for (let a = 0; a < split.length; ++a) {
                  const item = split[a]

                  options.push({
                    name: item.replace(/ /g, '-'),
                    description: item,
                    type: 3,
                    required: a < cmd.minArgs,
                  })
                }

                if(cmd.subCommand) {
                    cmd.subCommand.forEach(sc => {
                        var g = []
                        var optionsSplit = sc.split(";")[1]

                        if(optionsSplit) {
                            var split = optionsSplit
                                .substring(1, optionsSplit.length - 1)
                                .split(/[>\]] [<\[]/)

                            for (let a = 0; a < split.length; ++a) {
                                var item = split[a]

                                g.push({
                                    name: item.replace(/ /g, '-'),
                                    description: item,
                                    type: 3,
                                    required: a < cmd.minArgs,
                                })
                            }
                        }

                        subCommand.push({
                            name: sc.split(";")[0],
                            description: sc.split(";")[0],
                            type: 1,
                            options: g || []
                        })
                    })
                }

                if(cmd.subCommandGroup) {
                    subCommandGroup = [
                        {
                            name: subCommandGroup[0].name,
                            description: subCommandGroup[0].name,
                            type: subCommandGroup[0].type,
                            options: subCommand
                        }
                    ]
                }
            }

            try {
                var url = `https://discord.com/api/v8/applications/${this.client.user.id}/commands`;

                if(cmd.guildOnly) url = `https://discord.com/api/v8/applications/${this.client.user.id}/guilds/${cmd.guildOnly}/commands`;

                var cmdd = {
                    name: cmd.name,
                    description: cmd.description,
                    options: options || []
                }

                if(cmd.subCommandGroup && cmd.subCommand) {
                     cmdd = {
                        name: cmd.name,
                        description: cmd.description,
                        options: subCommandGroup || []
                    };
                } else {
                    cmdd = {
                        name: cmd.name,
                        description: cmd.description,
                        options: options || []
                    };
                }

                var config = {
                    method: "POST",
                    headers: {
                        Authorization: `Bot ${this.client.token}`,
                        "Content-Type": "application/json"
                    },
                    data: JSON.stringify(cmdd),
                    url,
                }

                axios(config).then((response) => {
                    console.log(new Color("&d[GCommands] &aLoaded: &e➜   &3" + cmd.name, {json:false}).getText());
                })
                .catch((error) => {
                    console.log(new Color("&d[GCommands] &cRequest failed! " + error, {json:false}).getText());

                    if(error.response) {
                        if(error.response.status == 429) {
                            setTimeout(() => {
                                this.__tryAgain(cmd, config)
                            }, 20000)
                        }
                    }
                })
            }catch(e) {
                console.log(e)
            }
        })
    }

    async __tryAgain(cmd, config) {
        axios(config).then((response) => {
            console.log(new Color("&d[GCommands] &aLoaded: &e➜   &3" + cmd.name, {json:false}).getText());
        })
        .catch((error) => {
            console.log(new Color("&d[GCommands] &cRequest failed! " + error, {json:false}).getText());

            if(error.response) {
                if(error.response.status == 429) {
                    setTimeout(() => {
                        this.__tryAgain(cmd, config)
                    }, 20000)
                }
            }
        })
    }

    async __deleteAllCmds() {
        var allcmds = await this.__getAllCommands();
        if(!this.slash) {
            allcmds.forEach(fo => {
                this.__deleteCmd(fo.id)
            })
        }

        var nowCMDS = [];

        let keys = Array.from(this.commands.keys());
        keys.forEach(cmdname => {
            nowCMDS.push(cmdname)
        })

        allcmds.forEach(fo => {
            var f = nowCMDS.some(v => fo.name.toLowerCase().includes(v.toLowerCase()))

            if(!f) {
                this.__deleteCmd(fo.id)
            }
        })

        this.__createCommands();
    }

    async __deleteCmd(commandId) {
        const app = this.client.api.applications(this.client.user.id)

        await app.commands(commandId).delete()
    }

    async __getAllCommands() {
        const app = this.client.api.applications(this.client.user.id)
        return await app.commands.get()
    }
}

class MessageStructure extends Structures.get("Message") {
    async buttons(content, options) {
        if (!options.buttons) {
            options.buttons = [];
        }

        if(!options.allowedMentions) {
            options.allowedMentions = { parse: ["users", "roles", "everyone"] };
        }

        if (!Array.isArray(options.buttons)) {
            return console.log(new Color("&d[GCommands] &cThe buttons must be array.",{json:false}).getText());
        }

        var buttons = [];
        var styles = ['blupurple', 'grey', 'green', 'red', 'url'];

        options.buttons.forEach((x, i) => {
            if (!x.style) x.style = 'blupurple';

            if (!styles.includes(x.style)) {
                return console.log(new Color(`&d[GCommands] &c#${i} button has invalid style, recived ${x.style}`,{json:false}).getText());
            }

            if (!x.label) {
                return console.log(new Color(`&d[GCommands] &c#${i} don't has label!`,{json:false}).getText());
            }

            if (typeof (x.label) !== 'string') x.label = String(x.label);

            if (x.style === 'url') {
                if (!x.url) {
                    return console.log(new Color(`&d[GCommands] &cIf the button style is "url", you must provide url`,{json:false}).getText());
                }
            } else {
                if (!x.id) {
                    return console.log(new Color(`&d[GCommands] &cIf the button style is not "url", you must provide custom id`,{json:false}).getText());
                }
            }

            var style;

            if (x.style === 'blupurple') {
                style = 1;
            } else if (x.style === 'grey') {
                style = 2;
            } else if (x.style === 'green') {
                style = 3;
            } else if (x.style === 'red') {
                style = 4;
            } else if (x.style === 'url') {
                style = 5;
            }

            var data = {
                type: 2,
                style: style,
                label: x.label,
                custom_id: x.id || null,
                url: x.url || null
            }

            buttons.push(data);
        })

        options.buttons === null;

        this.client.ws.on('INTERACTION_CREATE', async (data) => {
            let typeStyles = {
                1: 'blupurple',
                2: 'grey',
                3: 'green',
                4: 'red',
                5: 'url'
            };

            await this.client.channels.cache.get(data.channel_id).messages.fetch();

            var message;
            try {
                message = await this.client.channels.cache.get(data.channel_id).messages.cache.get(data.message.id);
            } catch(e) {
                message = await this.client.channels.cache.get(data.channel_id)
            }

            var clicker = await this.client.guilds.cache.get(data.guild_id).members.cache.get(data.member.user.id);

            this.client.emit('clickButton', {
                version: data.version,
                type: data.type,
                style: typeStyles[data.type],
                token: data.token,
                id: data.data.custom_id,
                discordId: data.id,
                applicationId: data.application_id,
                clicker: clicker,
                message
            })
        });

        this.client.api.channels[this.channel.id].messages.post({
            headers: {
            "Content-Type": 'applications/json'
            },
            data: {
                allowed_mentions: options.allowedMentions,
                content: content,
                components: [
                    {
                        type: 1,
                        components: buttons
                    }
                ],
                options,
                embed: options.embed || null
            }
        });
    }

    async inlineReply(content, options) {
        const mentionRepliedUser = typeof ((options || content || {}).allowedMentions || {}).repliedUser === "undefined" ? true : ((options || content).allowedMentions).repliedUser;
        delete ((options || content || {}).allowedMentions || {}).repliedUser;

        const apiMessage = content instanceof APIMessage ? content.resolveData() : APIMessage.create(this.channel, content, options).resolveData();
        Object.assign(apiMessage.data, { message_reference: { message_id: this.id } });

        if (!apiMessage.data.allowed_mentions || Object.keys(apiMessage.data.allowed_mentions).length === 0)
        apiMessage.data.allowed_mentions = { parse: ["users", "roles", "everyone"] };
        if (typeof apiMessage.data.allowed_mentions.replied_user === "undefined")
        Object.assign(apiMessage.data.allowed_mentions, { replied_user: mentionRepliedUser });

        if (Array.isArray(apiMessage.data.content)) {
            return Promise.all(apiMessage.split().map(x => {
                x.data.allowed_mentions = apiMessage.data.allowed_mentions;
                return x;
            }).map(this.inlineReply.bind(this)));
        }

        const { data, files } = await apiMessage.resolveFiles();
        return this.client.api.channels[this.channel.id].messages
            .post({ data, files })
            .then(d => this.client.actions.MessageCreate.handle(d).message);
    }

    async buttonsWithReply(content, options) {
        if (!options.buttons) {
            options.buttons = [];
        }

        if(!options.allowedMentions) {
            options.allowedMentions = { parse: ["users", "roles", "everyone"] };
        }

        if (!Array.isArray(options.buttons)) {
            return console.log(new Color("&d[GCommands] &cThe buttons must be array.",{json:false}).getText());
        }

        var buttons = [];
        var styles = ['blupurple', 'grey', 'green', 'red', 'url'];

        options.buttons.forEach((x, i) => {
            if (!x.style) x.style = 'blupurple';

            if (!styles.includes(x.style)) {
                return console.log(new Color(`&d[GCommands] &c#${i} button has invalid style, recived ${x.style}`,{json:false}).getText());
            }

            if (!x.label) {
                return console.log(new Color(`&d[GCommands] &c#${i} don't has label!`,{json:false}).getText());
            }

            if (typeof (x.label) !== 'string') x.label = String(x.label);

            if (x.style === 'url') {
                if (!x.url) {
                    return console.log(new Color(`&d[GCommands] &cIf the button style is "url", you must provide url`,{json:false}).getText());
                }
            } else {
                if (!x.id) {
                    return console.log(new Color(`&d[GCommands] &cIf the button style is not "url", you must provide custom id`,{json:false}).getText());
                }
            }

            var style;

            if (x.style === 'blupurple') {
                style = 1;
            } else if (x.style === 'grey') {
                style = 2;
            } else if (x.style === 'green') {
                style = 3;
            } else if (x.style === 'red') {
                style = 4;
            } else if (x.style === 'url') {
                style = 5;
            }

            var data = {
                type: 2,
                style: style,
                label: x.label,
                custom_id: x.id || null,
                url: x.url || null
            }

            buttons.push(data);
        })

        options.buttons === null;

        this.client.ws.on('INTERACTION_CREATE', async (data) => {
            let typeStyles = {
                1: 'blupurple',
                2: 'grey',
                3: 'green',
                4: 'red',
                5: 'url'
            };

            await this.client.channels.cache.get(data.channel_id).messages.fetch();

            var message;
            try {
                message = await this.client.channels.cache.get(data.channel_id).messages.cache.get(data.message.id);
            } catch(e) {
                message = await this.client.channels.cache.get(data.channel_id)
            }

            var clicker = await this.client.guilds.cache.get(data.guild_id).members.cache.get(data.member.user.id);

            this.client.emit('clickButton', {
                version: data.version,
                type: data.type,
                style: typeStyles[data.type],
                token: data.token,
                id: data.data.custom_id,
                discordId: data.id,
                applicationId: data.application_id,
                clicker: clicker,
                message
            })
        });

        this.client.api.channels[this.channel.id].messages.post({
            headers: {
            "Content-Type": 'applications/json'
            },
            data: {
                allowed_mentions: options.allowedMentions,
                content: content,
                components: [
                    {
                        type: 1,
                        components: buttons
                    }
                ],
                message_reference: {
                    message_id: this.channel.lastMessageID
                },
                options,
                embed: options.embed || null
            }
        });
    }
}

Structures.extend("Message", () => MessageStructure);
