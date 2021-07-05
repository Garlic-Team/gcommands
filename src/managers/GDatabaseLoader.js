const Color = require("../structures/Color")
const ifDjsV13 = require("../util/updater").checkDjsVersion("13")

class GDatabaseLoader {
    constructor(GCommandsClient) {
        this.GCommandsClient = GCommandsClient;
        this.client = this.GCommandsClient.client;

        this.__loadDB()
    }

    /**
     * Internal method to dbLoad
     * @returns {boolean}
     * @private
     */
    async __loadDB() {
        let dbType = this.GCommandsClient.database;
        if(!dbType) this.client.database = undefined;
        else { 
            const Keyv = require('keyv');
            this.client.database = new Keyv(dbType)
        }

        this.__guildConfig()
    }

    async __guildConfig() {
        this.client.guilds.cache.forEach(async (guild) => {
            let prefix = await this.client.dispatcher.getGuildPrefix(guild.id, false), language = await this.client.dispatcher.getGuildLanguage(guild.id, false)
            guild.prefix = prefix;
            guild.language = language;

            if(ifDjsV13) {
                guild.getCommandPrefix = async(cache = true) => this.client.dispatcher.getGuildPrefix(guild.id, cache);
                guild.setCommandPrefix = async(prefix) => {
                    this.client.dispatcher.setGuildPrefix(guild.id, prefix);
                    this.client.emit('commandPrefixChange', guild, guild.prefix);
                }

                guild.getLanguage = async(cache = true) => this.client.dispatcher.getGuildLanguage(guild.id, cache);
                guild.setLanguage = async(prefix) => {
                    this.client.dispatcher.setGuildLanguage(guild.id, lang);
                    this.client.emit('guildLanguageChange', guild, guild.language);
                }
            }
        })

        this.client.on("guildCreate", (guild) => {
            guild.prefix = this.client.dispatcher.getGuildPrefix(guild.id, false)
            guild.language = this.client.dispatcher.getGuildLanguage(guild.id, false)

            if(ifDjsV13) {
                guild.getCommandPrefix = async(cache = true) => this.client.dispatcher.getGuildPrefix(guild.id, cache);
                guild.setCommandPrefix = async(prefix) => {
                    this.client.dispatcher.setGuildPrefix(guild.id, prefix);
                    this.client.emit('commandPrefixChange', guild, guild.prefix);
                }

                guild.getLanguage = async(cache = true) => this.client.dispatcher.getGuildLanguage(guild.id, cache);
                guild.setLanguage = async(prefix) => {
                    this.client.dispatcher.setGuildLanguage(guild.id, lang);
                    this.client.emit('guildLanguageChange', guild, guild.language);
                }
            }
        })
    }
}

module.exports = GDatabaseLoader;