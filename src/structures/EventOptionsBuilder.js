// ONLY FOR DOCS
const GEvents = require('@gcommands/events');

/**
 * The EventOptionsBuilder class
 */
class EventOptionsBuilder extends null { }

/**
 * Name
 * @type {string}
*/
EventOptionsBuilder.name = GEvents.EventOptionsBuilder.name;

/**
 * Once
 * @type {boolean}
*/
EventOptionsBuilder.once = GEvents.EventOptionsBuilder.once;

/**
 * Ws
 * @type {boolean}
*/
EventOptionsBuilder.ws = GEvents.EventOptionsBuilder.ws;

/**
 * Method to setName
 * @param {String} name
*/
EventOptionsBuilder.setName = () => GEvents.EventOptionsBuilder.setName;

/**
 * Method to setOnce
 * @param {boolean} once
*/
EventOptionsBuilder.setOnce = () => GEvents.EventOptionsBuilder.setOnce;

/**
 * Method to setWs
 * @param {boolean} ws
*/
EventOptionsBuilder.setWs = () => GEvents.EventOptionsBuilder.setWs;

/**
 * Method to toJSON
 * @returns {Object}
*/
EventOptionsBuilder.toJSON = () => GEvents.EventOptionsBuilder.toJSON;

module.exports = EventOptionsBuilder;
