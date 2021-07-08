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
    }
}

module.exports = GDatabaseLoader;