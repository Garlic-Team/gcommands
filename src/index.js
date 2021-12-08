'use strict';
const components = require('@gcommands/components');
const events = require('@gcommands/events');

module.exports = {
    // Root classes
    GCommandsClient: require('./base/GCommandsClient.js'),
    GEventLoader: events.GEvents,
    GCommandsDispatcher: require('./base/GCommandsDispatcher'),

    // Loaders
    GEventHandling: require('./managers/GEventHandling'),
    GCommandLoader: require('./managers/GCommandLoader'),
    GDatabaseLoader: require('./managers/GDatabaseLoader'),

    // Components
    Component: components.Component,
    CustomId: components.CustomId,
    ComponentType: components.ComponentType,
    MessageButton: components.MessageButton,
    MessageSelectMenu: components.MessageSelectMenu,
    MessageActionRow: components.MessageActionRow,

    Command: require('./structures/Command'),
    Event: events.Event,
    GError: require('./structures/GError'),

    // Builders
    CommandOptionsBuilder: require('./structures/CommandOptionsBuilder'),
    CommandArgsOptionBuilder: require('./structures/CommandArgsOptionBuilder'),
    CommandArgsChoiceBuilder: require('./structures/CommandArgsChoiceBuilder'),
    EventOptionsBuilder: events.EventOptionsBuilder,

    // Other
    Color: require('./structures/Color'),
    Util: require('./util/util'),
    ArgumentType: require('./util/Constants').ArgumentType,
    CommandType: require('./util/Constants').ArgumentType,

    version: require('../package.json').version,
};

module.exports.default = module.exports;
