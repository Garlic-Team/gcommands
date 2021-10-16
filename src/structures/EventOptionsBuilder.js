// ONLY FOR DOCS
const GEvents = require('@gcommands/events');

/**
 * The builder for a event
 */
class EventOptionsBuilder extends null { }

/**
 * The name
 * @type {string}
*/
EventOptionsBuilder.name = GEvents.EventOptionsBuilder.name;

/**
 * Wheter the event should be executed once
 * @type {boolean}
*/
EventOptionsBuilder.once = GEvents.EventOptionsBuilder.once;

/**
 * Wheter the event should be from the web socket
 * @type {boolean}
*/
EventOptionsBuilder.ws = GEvents.EventOptionsBuilder.ws;

/**
 * Method to set name
 * @param {string} name
*/
EventOptionsBuilder.setName = () => GEvents.EventOptionsBuilder.setName;

/**
 * Method to set once
 * @param {boolean} once
*/
EventOptionsBuilder.setOnce = () => GEvents.EventOptionsBuilder.setOnce;

/**
 * Method to set ws
 * @param {boolean} ws
*/
EventOptionsBuilder.setWs = () => GEvents.EventOptionsBuilder.setWs;

/**
 * Method to convert to JSON
 * @returns {Object}
*/
EventOptionsBuilder.toJSON = () => GEvents.EventOptionsBuilder.toJSON;

module.exports = EventOptionsBuilder;
