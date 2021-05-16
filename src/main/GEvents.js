const { Collection } = require("discord.js");
const Color = require("../color/Color");
const { promisify } = require('util');
const path = require('path');
const { fstat } = require("fs");
const glob = promisify(require('glob'));

/**
 * The GEvents class
 * @class GEvents
 */
module.exports = class GEvents {

    /**
     * Creates new GEvents instance
     * @param {DiscordClient} client 
     * @param {GEventsOptions} options 
    */
    constructor(client, options = {}) {
        if (typeof client !== 'object') return console.log(new Color("&d[GCommands EVENTS] &cNo discord.js client provided!",{json:false}).getText());
        if (!Object.keys(options).length) return console.log(new Color("&d[GCommands EVENTS] &cNo default options provided!",{json:false}).getText());
        if(!options.eventDir) return console.log(new Color("&d[GCommands EVENTS] &cNo default options provided! (eventDir)",{json:false}).getText());

        /**
         * GEventsOptions options
         * @type {GEventsOptions}
         * @param {GEventsOptions} eventDir
        */

        this.eventDir = options.eventDir;

        this.client = client;
        this.client.events = new Collection();

        this.__loadEventFiles();
    }

    /**
     * Internal method to loadEventsFiles
     * @private
    */
    async __loadEventFiles() {
        return glob(`./${this.eventDir}/**/*.js`).then(events => {
            for (const eventFile of events) {
				const { name } = path.parse(eventFile);
                var File;

                try {
                    File = require("../../"+this.eventDir+"/"+name);
                    console.log(new Color("&d[GCommands EVENTS] &aLoaded (File): &e➜   &3" + name, {json:false}).getText());
                } catch(e) {
                    this.client.emit("gDebug", new Color("&d[GCommands EVENTS Debug] "+e).getText())
                    return console.log(new Color("&d[GCommands EVENTS] &cCan't load " + name).getText());
                }

				this.client.events.set(File.name, File);

                this.__loadEvents()
            }
        })
    }

    /**
     * Internal method to loadEvents
     * @private
    */
    async __loadEvents() {
        this.client.events.forEach(event => {
            if (event.once) {
                this.client.once(event.name, (...args) => event.run(this.client, ...args));
            } else {
                this.client.on(event.name, (...args) => event.run(this.client, ...args));
            }
        })
    }
}