const { Collection } = require("discord.js");
const Color = require("../structures/Color"), { Events } = require("../util/Constants");
const path = require('path');
const fs = require('fs');

/**
 * The GEvents class
 */
class GEvents {

    /**
     * Creates new GEvents instance
     * @param {DiscordClient} client 
     * @param {GEventsOptions} options 
    */
    constructor(GCommandsClient, options = {}) {
        if (typeof GCommandsClient.client !== 'object') return console.log(new Color("&d[GCommands EVENTS] &cNo discord.js client provided!",{json:false}).getText());
        if (!Object.keys(options).length) return console.log(new Color("&d[GCommands EVENTS] &cNo default options provided!",{json:false}).getText());
        if(!options.eventDir) return console.log(new Color("&d[GCommands EVENTS] &cNo default options provided! (eventDir)",{json:false}).getText());

        /**
         * GEventsOptions options
         * @type {GEventsOptions}
         * @property {String} eventDir
        */

        this.eventDir = options.eventDir;

        this.GCommandsClient = GCommandsClient;
        this.client = GCommandsClient.client;
        this.client.events = new Collection();

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
                    file = await require(`../../../../${this.eventDir}${dir}`);

                    this.client.events.set(file.name, file);
                    console.log(new Color("&d[GEvents] &aLoaded (File): &e➜   &3" + fileName, {json:false}).getText());
                } catch(e) {
                    this.GCommandsClient.emit(Events.DEBUG, new Color("&d[GEvents Debug] "+e).getText());
                    console.log(new Color("&d[GEvents] &cCan't load " + fileName).getText());
                }
            } else {
                fs.readdirSync(`${this.eventDir}${dir}`).forEach(async(eventFile) => {
                    var file2;
                    var fileName2 = eventFile.split(".").reverse()[1];
                    try {
                        file2 = await require(`../../../../${this.eventDir}${dir}/${eventFile}`);
    
                        this.client.events.set(file2.name, file2);
                        console.log(new Color("&d[GEvents] &aLoaded (File): &e➜   &3" + fileName2, {json:false}).getText());
                    } catch(e) {
                        this.GCommandsClient.emit(Events.DEBUG, new Color("&d[GEvents Debug] "+e).getText());
                        console.log(new Color("&d[GEvents] &cCan't load " + fileName2).getText());
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

module.exports = GEvents;