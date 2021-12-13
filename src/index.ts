// Client
export * from './lib/GClient';
export {ClientEvents} from 'discord.js';

// Structures
export * from './lib/structures/Plugin';
export * from './lib/structures/Listener';
export * from './lib/structures/Command';
export * from './lib/structures/Component';
export * from './lib/structures/BaseContext';
export * from './lib/structures/CommandContext';
export * from './lib/structures/ComponentContext';
export * from './lib/structures/AutocompleteContext';
export * from './lib/structures/ArgumentResolver';

// Managers
export * from './lib/managers/CommandManager';
export * from './lib/managers/ComponentManager';
export * from './lib/managers/HandlerManager';
export * from './lib/managers/ListenerManager';
export * from './lib/managers/PluginManager';

// Arguments
export * from './lib/arguments/Argument';

// Inhibitors
export * from './inhibitors/NsfwInhibitor';
export * from './inhibitors/ChannelOnlyInhibitor';
export * from './inhibitors/UserOnlyInhibitor';
export * from './inhibitors/UserRolesInhibitor';
export * from './inhibitors/UserPermissionsInhibitor';
export * from './inhibitors/ClientPermissionsInhibitor';

// Util
export * from './util/CustomId';
export * from './util/init';

// Re-exports
export {MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu} from 'discord.js';

// Listeners
import './listeners/Ready';
import './listeners/InteractionCommandHandler';
import './listeners/MessageCommandHandler';
import './listeners/ComponentHandler';
import './listeners/AutocompleteHandler';

// TODO add more validators
