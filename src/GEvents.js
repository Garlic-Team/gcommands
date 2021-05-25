const { Collection } = require("discord.js");
const Color = require("./utils/color/Color");
const { promisify } = require('util');
const path = require('path');
const { Events } = require("./utils/Constants");
const glob = promisify(require('glob'));

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
        return glob(`./${this.eventDir}/**/*.js`).then(async(events) => {
            for (const eventFile of events) {
				const { name } = path.parse(eventFile);
                var File;

                try {
                    File = await require("../../../"+this.eventDir+"/"+name)
                    console.log(new Color("&d[GCommands EVENTS] &aLoaded (File): &e➜   &3" + name, {json:false}).getText());
                } catch(e) {
                    try {
                        File = await require("../../../"+eventFile.split("./")[1])
                        console.log(new Color("&d[GCommands EVENTS] &aLoaded (File): &e➜   &3" + name, {json:false}).getText());
                    } catch(e) {
                        try {
                            File = await require("../"+this.eventDir+"/"+name);
                            console.log(new Color("&d[GCommands EVENTS] &aLoaded (File): &e➜   &3" + name, {json:false}).getText());
                        } catch(e) {
                            this.GCommandsClient.emit(Events.DEBUG, new Color("&d[GCommands EVENTS Debug] "+e).getText())
                            console.log(new Color("&d[GCommands EVENTS] &cCan't load " + name).getText());
                        }
                    }
                }

				this.client.events.set(File.name, File);
            }
            this.__loadEvents()
        })
    }

    /**
     * Internal method to loadEvents
     * @returns {void}
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

module.exports = GEvents;