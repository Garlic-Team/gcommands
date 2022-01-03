import Logger from 'js-logger';
// Listeners
import './listeners/Ready';
import './listeners/InteractionCommandHandler';
import './listeners/MessageCommandHandler';
import './listeners/ComponentHandler';
import './listeners/AutocompleteHandler';

// Client
export * from './lib/GClient';
export {ClientEvents} from 'discord.js';

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
export {Plugins, PluginManager} from './lib/managers/PluginManager';
export {Commands, CommandManager} from './lib/managers/CommandManager';
export {Components, ComponentManager} from './lib/managers/ComponentManager';
export {Listeners, ListenerManager} from './lib/managers/ListenerManager';
export {Handlers, HandlerManager} from './lib/managers/HandlerManager';

// Logger
Logger.useDefaults({
	defaultLevel: Logger.TRACE,
	formatter: function (messages: any, ctx) {
		let color;
		if (ctx.level === Logger.TRACE) color = '\x1b[91m';
		if (ctx.level === Logger.DEBUG) color = '\x1b[2m';
		if (ctx.level === Logger.INFO) color = '\x1b[36m';
		if (ctx.level === Logger.TIME) color = '\x1b[97m';
		if (ctx.level === Logger.WARN) color = '\x1b[93m';
		if (ctx.level === Logger.ERROR) color = '\x1b[91m';

		const date = new Date();
		messages[0] = `${color}[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}/${ctx.level.name}]\x1b[0m ${messages[0]}`;
	}
});
export {Logger};

// Inhibitors
export * from './inhibitors/NsfwInhibitor';
export * from './inhibitors/ChannelOnlyInhibitor';
export * from './inhibitors/UserOnlyInhibitor';
export * from './inhibitors/UserRolesInhibitor';
export * from './inhibitors/UserPermissionsInhibitor';
export * from './inhibitors/ClientPermissionsInhibitor';
export * from './inhibitors/OrInhibitor';

// Util
export * from './util/CustomId';
export * from './lib/util/registerDirectory';
export * from './lib/util/registerDirectories';
export * from './util/confirm';

// Re-exports
export {MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu} from 'discord.js';
