const { Collection } = require("discord.js");
const Color = require("../structures/Color"), { Events } = require("../util/Constants");
const path = require('path');
const fs = require('fs');
const Event = require("../structures/Event");
const { isClass } = require("../util/util");

/**
 * The GEventLoader class
 */
class GEventLoader {

    /**
     * Creates new GEventLoader instance
     * @param {DiscordClient} client 
     * @param {GEventLoaderOptions} options 
    */
    constructor(GCommandsClient, options = {}) {
        if(!GCommandsClient.client) GCommandsClient = { client: GCommandsClient }
        if (typeof GCommandsClient.client !== 'object') return console.log(new Color("&d[GCommands EVENTS] &cNo discord.js client provided!",{json:false}).getText());

        /**
         * GEventLoader options
         * @type {GEventLoaderOptions}
         * @property {String} eventDir
        */

        this.GCommandsClient = GCommandsClient;
        this.eventDir = this.GCommandsClient.eventDir ? this.GCommandsClient.eventDir : options.eventDir;
        this.client = GCommandsClient.client;
        this.client.events = new Collection();

        if(!this.eventDir) return;
        this.__loadEventFiles();
    }

    /**
     * Internal method to loadEventsFiles
     * @returns {void}
     * @private
    */
    async __loadEventFiles() {
        await fs.readdirSync(`${__dirname}/../../../../${this.eventDir}`).forEach(async(dir) => {
            var file;
            var fileName = dir.split(".").reverse()[1]
            var fileType = dir.split(".").reverse()[0]
            if(fileType == "js" || fileType == "ts") {
                try {
                    let finalFile;

                    file = await require(`../../../../${this.eventDir}${dir}`);
                    if (isClass(file)) {
                        finalFile = new file(this.client)
                        if(!(finalFile instanceof Event)) return console.log(new Color(`&d[GEvents] &cEvent ${fileName} doesnt belong in Events.`).getText())
                    } else finalFile = file;

                    this.client.events.set(finalFile.name, finalFile);
                    this.GCommandsClient.emit(Events.LOG, new Color("&d[GEvents] &aLoaded (File): &e➜   &3" + fileName, {json:false}).getText());
                } catch(e) {
                    this.GCommandsClient.emit(Events.DEBUG, new Color("&d[GEvents Debug] "+e).getText());
                    this.GCommandsClient.emit(Events.LOG, new Color("&d[GEvents] &cCan't load " + fileName).getText());
                }
            } else {
                fs.readdirSync(`${this.eventDir}${dir}`).forEach(async(eventFile) => {
                    var file2;
                    var fileName2 = eventFile.split(".").reverse()[1];
                    try {
                        let finalFile2;

                        file2 = await require(`../../../../${this.eventDir}${dir}/${cmdFile}`);
                        if (isClass(file)) {
                            finalFile2 = new file2(this.client)
                            if(!(finalFile2 instanceof Event)) return console.log(new Color(`&d[GEvents] &cEvent ${fileName2} doesnt belong in Events.`).getText());
                        } else finalFile2 = file2;

                        this.client.events.set(finalFile2.name, finalFile2);
                        this.GCommandsClient.emit(Events.LOG, new Color("&d[GEvents] &aLoaded (File): &e➜   &3" + fileName2, {json:false}).getText());
                    } catch(e) {
                        this.GCommandsClient.emit(Events.DEBUG, new Color("&d[GEvents Debug] "+e).getText());
                        this.GCommandsClient.emit(Events.LOG, new Color("&d[GEvents] &cCan't load " + fileName2).getText());
                    }
                })
            }
        })

        await this.__loadEvents()
    }

    /**
     * Internal method to loadEvents
     * @returns {void}
     * @private
    */
    async __loadEvents() {
        this.client.events.forEach(event => {
            if(event.name == "ready") return event.run(this.client);

            if (event.once) {
                this.client.once(event.name, (...args) => event.run(this.client, ...args));
            } else {
                this.client.on(event.name, (...args) => event.run(this.client, ...args));
            }
        })
    }
}

module.exports = GEventLoader;