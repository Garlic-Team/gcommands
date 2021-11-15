// ONLY FOR DOCS
const GEvents = require('@gcommands/events');

/**
 * The Event class
 */
class Event extends null {}

/**
 * The name
 * @type {string}
 */
Event.name = GEvents.Event.name;

/**
 * Wheter the event should be executed once
 * @type {boolean}
 */
Event.once = GEvents.Event.once;

/**
 * Wheter the event should be from the web socket
 * @type {boolean}
 */
Event.ws = GEvents.Event.ws;

/**
 * The run function
 * @param {Client}
 * @param {string}
 */
Event.run = () => GEvents.Event.run;

/**
 * Reloads the event
 */
Event.reload = () => GEvents.Event.reload;

module.exports = Event;
