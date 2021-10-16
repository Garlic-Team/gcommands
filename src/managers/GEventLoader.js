// ONLY FOR DOCS
const GEvents = require('@gcommands/events');

/**
 * The loader for event files and events
 * @private
 */
class GEventLoader extends null {}

/**
 * The client
 * @type {GCommandsClient}
*/
GEventLoader.client = GEvents.GEvents.client;

/**
 * The path to the event files
 * @type {string}
 */
GEventLoader.eventDir = GEvents.GEvents.eventDir;

/**
 * All the events
 * @type {Collection}
 */
GEventLoader.client.gevents = GEvents.GEvents.gevents;


/**
 * Internal method to load event files
 * @returns {void}
*/
GEventLoader.__loadEventFiles = () => GEvents.GEvents.__loadEventFiles;

/**
 * Internal method to load events
 * @returns {void}
*/
GEventLoader.__loadEvents = () => GEvents.GEvents.__loadEvents;

module.exports = GEventLoader;
