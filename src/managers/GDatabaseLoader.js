const cmdUtils = require('../util/cmdUtils'), Color = require("../structures/Color"), Events = require("../util/Constants")
const axios = require("axios");
const fs = require("fs");

class GDatabaseLoader {
    constructor(GCommandsClient) {
        this.GCommandsClient = GCommandsClient;
        this.client = this.GCommandsClient.client;

        //this.cmdDir = this.GCommandsClient.cmdDir;

        //this.__loadCommands()
    }
}

module.exports = GDatabaseLoader;