// Listeners
import './listeners/Ready';
import './listeners/InteractionCommandHandler';
import './listeners/MessageCommandHandler';
import './listeners/ComponentHandler';
import './listeners/AutocompleteHandler';

// Client
export * from './lib/GClient';
export { ClientEvents } from 'discord.js';

// Structures
export * from './lib/structures/Plugin';
export * from './lib/structures/Listener';
export * from './lib/structures/Command';
export * from './lib/structures/Component';
export * from './lib/structures/contexts/Context';
export * from './lib/structures/contexts/CommandContext';
export * from './lib/structures/contexts/ComponentContext';
export * from './lib/structures/contexts/AutocompleteContext';
export * from './lib/structures/Argument';

// Managers
export { Plugins, PluginManager } from './lib/managers/PluginManager';
export { Commands, CommandManager } from './lib/managers/CommandManager';
export { Components, ComponentManager } from './lib/managers/ComponentManager';
export { Listeners, ListenerManager } from './lib/managers/ListenerManager';
export { Handlers, HandlerManager } from './lib/managers/HandlerManager';

// Logger
export * from './lib/util/logger/Logger';

// Inhibitors
export * as Inhibitor from './inhibitors';

/**
 * Providers are not exported
 * To import, just use the path gcommands/dist/providers/{name}
 */
export * from './lib/structures/Provider';

// Util
export * from './util/customId';
export * from './lib/util/registerDirectory';
export * from './lib/util/registerDirectories';
export * from './util/confirm';
export * from './lib/util/Util';

// Re-exports
export {
	/**
	 * @deprecated Import from djs instead of gcommands
	 */
	EmbedBuilder as MessageEmbed,
	/**
	 * @deprecated Import from djs instead of gcommands
	 */
	ActionRowBuilder as MessageActionRow,
	/**
	 * @deprecated Import from djs instead of gcommands
	 */
	ButtonBuilder as MessageButton,
	/**
	 * @deprecated Import from djs instead of gcommands
	 */
	SelectMenuBuilder as MessageSelectMenu,
} from 'discord.js';
