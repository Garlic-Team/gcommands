class GDatabaseLoader {
    constructor(GCommandsClient) {
        this.GCommandsClient = GCommandsClient;
        this.client = this.GCommandsClient.client;
        this.shardClusterName = this.GCommandsClient.shardClusterName
        this.__loadDB()
    }

    /**
     * Internal method to dbLoad
     * @returns {boolean}
     * @private
     */
    __loadDB() {
        let dbType = this.GCommandsClient.database;
        if(!dbType) this.client.database = undefined;
        else { 
            const Keyv = require('keyv');
            this.client.database = new Keyv(dbType)
        }

        this.__guildConfig()
    }

    /**
     * Internal method to guildConfig
     * @returns {void}
     * @private
     */
    async __guildConfig() {
        let allShardsWithGuilds = await this.__getAllGuilds();

        for (let allGuilds of allShardsWithGuilds) {
            for (let guild of allGuilds) {
                let prefix = await this.client.dispatcher.getGuildPrefix(guild[1].id, false), language = await this.client.dispatcher.getGuildLanguage(guild[1].id, false);

                guild[1].prefix = prefix;
                guild[1].language = language;
    
                guild[1].getCommandPrefix = async(cache = true) => this.client.dispatcher.getGuildPrefix(guild[1].id, cache);
                guild[1].setCommandPrefix = async(prefix) => {
                    this.client.dispatcher.setGuildPrefix(guild[1].id, prefix);
                    this.client.emit('commandPrefixChange', guild[1], prefix);
                }

                guild[1].getLanguage = async(cache = true) => this.client.dispatcher.getGuildLanguage(guild[1].id, cache);
                guild[1].setLanguage = async(lang) => {
                    this.client.dispatcher.setGuildLanguage(guild[1].id, lang);
                    this.client.emit('guildLanguageChange', guild[1], lang);
                }
            }
        }

        this.client.on("guildCreate", async(guild) => {
            let prefix = await this.client.dispatcher.getGuildPrefix(guild.id, false), language = await this.client.dispatcher.getGuildLanguage(guild.id, false);

            guild.prefix = prefix;
            guild.language = language;

            guild.getCommandPrefix = async(cache = true) => this.client.dispatcher.getGuildPrefix(guild.id, cache);
            guild.setCommandPrefix = async(prefix) => {
                this.client.dispatcher.setGuildPrefix(guild.id, prefix);
                this.client.emit('commandPrefixChange', guild, guild.prefix);
            }

            guild.getLanguage = async(cache = true) => this.client.dispatcher.getGuildLanguage(guild.id, cache);
            guild.setLanguage = async(lang) => {
                this.client.dispatcher.setGuildLanguage(guild.id, lang);
                this.client.emit('guildLanguageChange', guild, guild.language);
            }
        })
    }

    /**
     * Internal method to getAllGuilds
     * @returns {Array}
     * @private
     */
    async __getAllGuilds() {
        let ifShards = await eval(`this.client.${this.shardClusterName}`);
        if(ifShards == null) return [this.client.guilds.cache];

        let inhibit = await eval(`this.client.${this.shardClusterName}.fetchClientValues("guilds.cache")`);
        return inhibit;
    }
}

module.exports = GDatabaseLoader;