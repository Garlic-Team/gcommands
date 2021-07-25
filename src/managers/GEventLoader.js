// ONLY FOR DOCS
const GEvents = require('@gcommands/events')

/**
 * The GEventLoader class
 */
class GEventLoader extends null {}

/**
 * GCommandsClient
 * @type {GCommands}
*/
GEventLoader.GCommandsClient = GEvents.GEvents.GCommandsClient;

/**
 * eventDir
 * @type {string}
 */
GEventLoader.eventDir = GEvents.GEvents.eventDir;

/**
 * client
 * @type {Client}
 */
GEventLoader.client = GEvents.GEvents.client;

/**
 * gevents
 * @type {Collection}
 */
GEventLoader.client.gevents = GEvents.GEvents.gevents;


/**
 * Internal method to loadEventsFiles
 * @returns {void}
 * @private
*/
GEventLoader.__loadEventFiles = () => GEvents.GEvents.__loadEventFiles;

/**
 * Internal method to loadEvents
 * @returns {void}
 * @private
*/
GEventLoader.__loadEvents = () => GEvents.GEvents.__loadEvents;

module.exports = GEventLoader;