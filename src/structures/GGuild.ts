import { Guild } from 'discord.js';

export class GGuild {
    constructor() {
        Object.defineProperties(Guild.prototype, {
            getCommandPrefix: {
                value: async function() {
                    const prefix = await this.client.dispatcher.getGuildPrefix(this);
                    return prefix || this.client.options.commands.prefix;
                },
            },
            setCommandPrefix: {
                value: async function(prefix) {
                    const isSet = await this.client.dispatcher.setGuildPrefix(this, prefix);
                    this.client.emit('commandPrefixChange', this, prefix);
                    return isSet;
                },
            },
            getLanguage: {
                value: async function() {
                    const language = await this.client.dispatcher.getGuildLanguage(this);
                    return language || this.client.options.language;
                },
            },
            setLanguage: {
                value: async function(lang) {
                    const isSet = await this.client.dispatcher.setGuildLanguage(this, lang);
                    this.client.emit('guildLanguageChange', this, lang);
                    return isSet;
                },
            },
            getData: {
                value: async function(options = {}) {
                    const data = await this.client.dispatcher.getGuildData(this, options);
                    if (data) this.data = data;
                    return data;
                },
            },
            setData: {
                value: async function(data) {
                    if (!data) data = this.data;
                    const isSet = await this.client.dispatcher.setGuildData(this, data);
                    if (isSet) this.data = data;
                    return isSet;
                },
            },
        });
    }
}
