const Color = require("../structures/Color")

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
        if(this.client.database.type == "mongodb") {
            var mongoose = require("mongoose")
            mongoose.connect(this.client.database.url, { useNewUrlParser: true, useUnifiedTopology: true })
                .then((connection) => {
                    console.log(new Color("&d[GCommands] &aMongodb loaded!",{json:false}).getText());
                    this.client.database.working = true;
                    return true;
                })
                .catch((e) => {
                    console.log(new Color("&d[GCommands] &cMongodb url is not valid.",{json:false}).getText());
                    this.client.database.working = false;
                    return false;
                })
        }
        else if(this.client.database.type == "sqlite") {
            var sqliteDb = require("quick.db")
            this.client.database.working = true;
            this.client.database.sqlite = sqliteDb;
        } else if(this.client.database.type == "mariadb") {
            var mariaDb = require("quick-mariadb");
            this.client.database.working = true;
            this.client.database.mariadb = mariaDb;
            this.client.database.mariadbOptions = {
                host: this.client.database.host,
                user: this.client.database.username,
                password: this.client.database.password,
                database: this.client.database.databaseName,
                port: this.client.database.port
            }
        }

        this.__guildConfig()
    }

    async __guildConfig() {
        for(let guild of this.client.guilds.cache) {
            guild.prefix = this.client.dispatcher.getGuildPrefix(guild.id, false);
        }

        this.client.on("guildCreate", (guild) => {guild.prefix = this.client.dispatcher.getGuildPrefix(guild.id, false)})
    }
}

module.exports = GDatabaseLoader;