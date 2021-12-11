export enum Events {
	// Commands
	COMMAND_REGISTER = 'commandRegister',
	COMMAND_UNREGISTER = 'commandUnregister',
	PRE_COMMAND_RUN = 'preCommandRun',

	// Components
	COMPONENT_REGISTER = 'componentRegister',
	COMPONENT_UNREGISTER = 'componentUnregister',
	PRE_COMPONENT_RUN = 'preComponentRun',

	// Listeners
	LISTENER_REGISTER = 'listenerRegister',
	LISTENER_UNREGISTER = 'listenerUnregister',

	// Plugins
	PLUGIN_REGISTER = 'pluginRegister',

	// Other
	ERROR = 'error',
	WARN = 'warn',
	DEBUG = 'debug',
}
