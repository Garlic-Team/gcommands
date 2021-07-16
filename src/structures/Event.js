// ONLY FOR DOCS
const GEvents = require("@gcommands/events")

/**
 * The Event class
 */
class Event extends null {}

/**
 * Name
 * @type {String}
 */
Event.name = GEvents.Event.name;

/**
 * once
 * @type {Boolean}
 */
Event.once = GEvents.Event.once;

/**
 * ws
 * @type {Boolean}
 */
Event.ws = GEvents.Event.ws;

/**
 * run function
 * @param {Client} 
 * @param {String}
 */
Event.run = GEvents.Event.run;

module.exports = Event;