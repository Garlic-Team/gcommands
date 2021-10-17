'use strict';

module.exports = {
    // Root classes
    GCommandsClient: require('./base/GCommandsClient.js'),
    GEventLoader: require('@gcommands/events').GEvents,
    GCommandsDispatcher: require('./base/GCommandsDispatcher'),

    // Loaders
    GEventHandling: require('./managers/GEventHandling'),
    GCommandLoader: require('./managers/GCommandLoader'),
    GDatabaseLoader: require('./managers/GDatabaseLoader'),

    // Structures
    MessageButton: require('./structures/MessageButton'),
    MessageActionRow: require('./structures/MessageActionRow'),
    MessageSelectMenu: require('./structures/MessageSelectMenu'),
    MessageSelectMenuOption: require('./structures/MessageSelectMenuOption'),
    Command: require('./structures/Command'),
    Event: require('@gcommands/events').Event,
    GError: require('./structures/GError'),

    // Builders
    CommandOptionsBuilder: require('./structures/CommandOptionsBuilder'),
    CommandArgsOptionBuilder: require('./structures/CommandArgsOptionBuilder'),
    CommandArgsChoiceBuilder: require('./structures/CommandArgsChoiceBuilder'),
    EventOptionsBuilder: require('@gcommands/events').EventOptionsBuilder,

    // Other
    Color: require('./structures/Color'),
    Util: require('./util/util'),
    ArgumentType: require('./util/Constants').ArgumentType,
    ButtonType: require('./util/Constants').ButtonType,

    version: require('../package.json').version,
};

module.exports.default = module.exports;
