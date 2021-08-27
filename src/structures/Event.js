// ONLY FOR DOCS
const GEvents = require('@gcommands/events');

/**
 * The Event class
 */
class Event extends null {}

/**
 * Name
 * @type {string}
 */
Event.name = GEvents.Event.name;

/**
 * Once
 * @type {boolean}
 */
Event.once = GEvents.Event.once;

/**
 * Ws
 * @type {boolean}
 */
Event.ws = GEvents.Event.ws;

/**
 * Run function
 * @param {Client}
 * @param {string}
 */
Event.run = () => GEvents.Event.run;

/**
 * Reloads the event
 */
Event.reload = () => GEvents.Event.reload;

module.exports = Event;
