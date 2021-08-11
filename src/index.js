'use strict';

module.exports = {
    // Root classes
    GCommands: require('./base/GCommands.js'),
    GCommandsClient: require('./base/GCommandsClient.js'),
    GEventLoader: require('@gcommands/events').GEvents,
    GCommandsDispatcher: require('./base/GCommandsDispatcher'),

    // Loaders
    GEventHandling: require('./managers/GEventHandling'),
    GCommandLoader: require('./managers/GCommandLoader'),
    GDatabaseLoader: require('./managers/GDatabaseLoader'),

    // Structures
    GMessage: require('./structures/GMessage'),
    GNewsChannel: require('./structures/NewsChannel'),
    GTextChannel: require('./structures/TextChannel'),
    GDMChannel: require('./structures/DMChannel'),
    GThreadChannel: require('./structures/ThreadChannel'),
    MessageButton: require('./structures/MessageButton'),
    MessageActionRow: require('./structures/MessageActionRow'),
    MessageSelectMenu: require('./structures/MessageSelectMenu'),
    MessageSelectMenuOption: require('./structures/MessageSelectMenuOption'),
    Command: require('./commands/base'),
    Event: require('@gcommands/events').Event,
    GPayload: require('./structures/GPayload'),
    ButtonCollectorV12: require('./structures/v13/ButtonCollector'),
    ButtonCollectorV13: require('./structures/v12/ButtonCollector'),
    SelectMenuCollectorV13: require('./structures/v13/SelectMenuCollector'),
    SelectMenuCollectorV12: require('./structures/v12/SelectMenuCollector'),
    InteractionCollectorV13: require('./structures/v13/InteractionCollector'),
    InteractionCollectorV12: require('./structures/v12/InteractionCollector'),
    ButtonInteraction: require('./structures/ButtonInteraction'),
    CommandInteraction: require('./structures/CommandInteraction'),
    SelectMenuInteraction: require('./structures/SelectMenuInteraction'),
    ContextMenuInteraction: require('./structures/ContextMenuInteraction'),
    BaseCommandInteraction: require('./structures/BaseCommandInteraction'),
    MessageComponentInteraction: require('./structures/MessageComponentInteraction'),
    BaseMessageComponent: require('./structures/BaseMessageComponent'),

    // Other
    Color: require('./structures/Color'),
    Util: require('./util/util'),
    ArgumentType: require('./util/Constants').ArgumentType,
    ButtonType: require('./util/Constants').ButtonType,

    version: require('../package.json').version,
};

module.exports.default = module.exports;
