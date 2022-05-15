import EventEmitter from 'node:events';
import type { Awaitable } from 'discord.js';
import type { Command } from '../../structures/Command';
import type { Component } from '../../structures/Component';
import type { Listener } from '../../structures/Listener';
import type { Plugin } from '../../structures/Plugin';
import type { AutocompleteContext } from '../../structures/contexts/AutocompleteContext';
import type { CommandContext } from '../../structures/contexts/CommandContext';
import type { ComponentContext } from '../../structures/contexts/ComponentContext';
import { Util } from '../Util';

export enum Events {
	'HANDLER_RUN' = 'handlerRun',
	'HANDLER_ERROR' = 'handlerError',
	'COMMAND_HANDLER_RUN' = 'commandHandlerRun',
	'COMMAND_HANDLER_ERROR' = 'commandHandlerError',
	'AUTOCOMPLETE_HANDLER_RUN' = 'autoCompleteHandlerRun',
	'AUTOCOMPLETE_HANDLER_ERROR' = 'autoCompleteHandlerError',
	'COMPONENT_HANDLER_RUN' = 'componentHandlerRun',
	'COMPONENT_HANDLER_ERROR' = 'componentHandlerError',
	'COMMAND_REGISTERED' = 'commandRegistered',
	'COMMAND_UNREGISTERED' = 'commandUnregistered',
	'COMPONENT_REGISTERED' = 'componentRegistered',
	'COMPONENT_UNREGISTERED' = 'componentUnregistered',
	'LISTENER_REGISTERED' = 'listenerRegistered',
	'LISTENER_UNREGISTERED' = 'listenerUnregistered',
	'PLUGIN_REGISTERED' = 'pluginRegistered',
}

export interface LoggerEvents {
	/**
	 * Emitted when a handler is run.
	 * @event Logger#handlerRun
	 * @param {import('../../structures/contexts/AutocompleteContext')|import('../../structures/contexts/CommandContext')|import('../../structures/contexts/ComponentContext')} ctx The type of handler.
	 */
	handlerRun: [ctx: AutocompleteContext | CommandContext | ComponentContext];
	/**
	 * Emitted when a handler errors.
	 * @event Logger#handlerError
	 * @param {import('../../structures/contexts/AutocompleteContext')|import('../../structures/contexts/CommandContext')|import('../../structures/contexts/ComponentContext')} ctx The type of handler.
	 * @param {any} error The error that occurred.
	 */
	handlerError: [
		ctx: AutocompleteContext | CommandContext | ComponentContext,
		error: any,
	];
	/**
	 * Emitted when a command handler is run.
	 * @event Logger#commandHandlerRun
	 * @param {import('../../structures/contexts/CommandContext')} ctx The command context.
	 */
	commandHandlerRun: [ctx: CommandContext];
	/**
	 * Emitted when a command handler errors.
	 * @event Logger#commandHandlerError
	 * @param {import('../../structures/contexts/CommandContext')} ctx The command context.
	 * @param {any} error The error that occurred.
	 */
	commandHandlerError: [ctx: CommandContext, error: any];
	/**
	 * Emitted when an auto complete handler is run.
	 * @event Logger#autoCompleteHandlerRun
	 * @param {import('../../structures/contexts/AutocompleteContext')} ctx The auto complete context.
	 */
	autoCompleteHandlerRun: [ctx: AutocompleteContext];
	/**
	 * Emitted when an auto complete handler errors.
	 * @event Logger#autoCompleteHandlerError
	 * @param {import('../../structures/contexts/AutocompleteContext')} ctx The auto complete context.
	 * @param {any} error The error that occurred.
	 */
	autoCompleteHandlerError: [ctx: AutocompleteContext, error: any];
	/**
	 * Emitted when a component handler is run.
	 * @event Logger#componentHandlerRun
	 * @param {import('../../structures/contexts/ComponentContext')} ctx The component context.
	 */
	componentHandlerRun: [ctx: ComponentContext];
	/**
	 * Emitted when a component handler errors.
	 * @event Logger#componentHandlerError
	 * @param {import('../../structures/contexts/ComponentContext')} ctx The component context.
	 * @param {any} error The error that occurred.
	 */
	componentHandlerError: [ctx: ComponentContext, error: any];
	/**
	 * Emitted when a command is registered.
	 * @event Logger#commandRegistered
	 * @param {import('../../structures/Command')} command The command that was registered.
	 */
	commandRegistered: [command: Command];
	/**
	 * Emitted when a command is unregistered.
	 * @event Logger#commandUnregistered
	 * @param {import('../../structures/Command')} command The command that was unregistered.
	 */
	commandUnregistered: [command: Command];
	/**
	 * Emitted when a component is registered.
	 * @event Logger#componentRegistered
	 * @param {import('../../structures/Component')} component The component that was registered.
	 */
	componentRegistered: [component: Component];
	/**
	 * Emitted when a component is unregistered.
	 * @event Logger#componentUnregistered
	 * @param {import('../../structures/Component')} component The component that was unregistered.
	 */
	componentUnregistered: [component: Component];
	/**
	 * Emitted when a listener is registered.
	 * @event Logger#listenerRegistered
	 * @param {import('../../structures/Listener')} listener The listener that was registered.
	 */
	listenerRegistered: [listener: Listener];
	/**
	 * Emitted when a listener is unregistered.
	 * @event Logger#listenerUnregistered
	 * @param {import('../../structures/Listener')} listener The listener that was unregistered.
	 */
	listenerUnregistered: [listener: Listener];
	/**
	 * Emitted when a plugin is registered.
	 * @event Logger#pluginRegistered
	 * @param {import('../../structures/Plugin')} plugin The plugin that was registered.
	 */
	pluginRegistered: [plugin: Plugin];
}

export declare interface ILogger {
	on<U extends keyof LoggerEvents>(event: U, listener: LoggerEvents[U]): this;

	on<K extends keyof LoggerEvents>(
		event: K,
		listener: (...args: LoggerEvents[K]) => Awaitable<void>,
	): this;
	on<S extends string | symbol>(
		event: Exclude<S, keyof LoggerEvents>,
		listener: (...args: any[]) => Awaitable<void>,
	): this;

	once<K extends keyof LoggerEvents>(
		event: K,
		listener: (...args: LoggerEvents[K]) => Awaitable<void>,
	): this;
	once<S extends string | symbol>(
		event: Exclude<S, keyof LoggerEvents>,
		listener: (...args: any[]) => Awaitable<void>,
	): this;

	emit<K extends keyof LoggerEvents>(
		event: K,
		...args: LoggerEvents[K]
	): boolean;
	emit<S extends string | symbol>(
		event: Exclude<S, keyof LoggerEvents>,
		...args: unknown[]
	): boolean;

	off<K extends keyof LoggerEvents>(
		event: K,
		listener: (...args: LoggerEvents[K]) => Awaitable<void>,
	): this;
	off<S extends string | symbol>(
		event: Exclude<S, keyof LoggerEvents>,
		listener: (...args: any[]) => Awaitable<void>,
	): this;

	removeAllListeners<K extends keyof LoggerEvents>(event?: K): this;
	removeAllListeners<S extends string | symbol>(
		event?: Exclude<S, keyof LoggerEvents>,
	): this;
}

export const enum LogLevel {
	TRACE = 1,
	DEBUG = 2,
	INFO = 3,
	/**
	 * @deprecated
	 */
	TIME = 4,
	WARN = 5,
	ERROR = 8,
	OFF = 99,
}

export type LogMethods =
	| 'trace'
	| 'debug'
	| 'info'
	| 'time'
	| 'warn'
	| 'timeEnd'
	| 'error';

export class ILogger extends EventEmitter {
	TRACE: LogLevel.TRACE;
	DEBUG: LogLevel.DEBUG;
	INFO: LogLevel.INFO;
	TIME: LogLevel.TIME;
	WARN: LogLevel.WARN;
	ERROR: LogLevel.ERROR;
	OFF: LogLevel.OFF;
	level: LogLevel = LogLevel.TRACE;

	constructor() {
		super();

		this.TRACE = LogLevel.TRACE;
		this.DEBUG = LogLevel.DEBUG;
		this.INFO = LogLevel.INFO;
		this.TIME = LogLevel.TIME;
		this.WARN = LogLevel.WARN;
		this.ERROR = LogLevel.ERROR;
		this.OFF = LogLevel.OFF;
	}

	public trace(...values: readonly unknown[]): void {
		this.invoke(LogLevel.TRACE, ...values);
	}

	public debug(...values: readonly unknown[]): void {
		this.invoke(LogLevel.DEBUG, ...values);
	}

	public info(...values: readonly unknown[]): void {
		this.invoke(LogLevel.INFO, ...values);
	}

	/**
	 * @deprecated
	 */
	public time(val: string): void {
		if (val.length > 0) this.invokeTime(LogLevel.TIME, val, 'start');
	}

	/**
	 * @deprecated
	 */
	public timeEnd(val: string): void {
		if (val.length > 0) this.invokeTime(LogLevel.TIME, val, 'stop');
	}

	public warn(...values: readonly unknown[]): void {
		this.invoke(LogLevel.WARN, ...values);
	}

	public error(...values: readonly unknown[]): void {
		this.invoke(LogLevel.ERROR, ...values);
	}

	public invoke(level: LogLevel, ...values: readonly unknown[]): void {
		if (!this.enabledFor(level)) return;

		let color = '';
		if (level === LogLevel.TRACE) color = '\x1b[91m';
		else if (level === LogLevel.DEBUG) color = '\x1b[2m';
		else if (level === LogLevel.INFO) color = '\x1b[36m';
		else if (level === LogLevel.WARN) color = '\x1b[93m';
		else color = '\x1b[91m';

		const method = this.LevelMethods.get(level) as
			| 'trace'
			| 'debug'
			| 'info'
			| 'warn'
			| 'error';
		const date = new Date();

		console[method](
			`${color}[${Util.pad(date.getHours())}:${Util.pad(
				date.getMinutes(),
			)}:${Util.pad(date.getSeconds())}/${method.toUpperCase()}]\x1b[0m ${
				values[0]
			}`,
			...values.slice(1),
		);
	}

	/**
	 * @deprecated
	 */
	public invokeTime(level: LogLevel, val: string, type: 'start' | 'stop') {
		if (!this.enabledFor(level)) return;

		if (type == 'start') console.time(val);
		else console.timeEnd(val);
	}

	protected readonly LevelMethods = new Map<LogLevel, LogMethods>([
		[LogLevel.TRACE, 'trace'],
		[LogLevel.DEBUG, 'debug'],
		[LogLevel.INFO, 'info'],
		[LogLevel.TIME, 'time'],
		[LogLevel.WARN, 'warn'],
		[LogLevel.ERROR, 'error'],
	]);

	public setLevel(level: LogLevel): void {
		this.level = level;
	}

	public getLevel(): LogLevel {
		return this.level;
	}

	public enabledFor(level: LogLevel): boolean {
		return level >= this.level;
	}

	/**
	 * @deprecated
	 */
	public useDefaults(): void {
		this.warn('This feature is not supported.');
	}

	/**
	 * @deprecated
	 */
	public setHandler(): void {
		this.warn('This feature is not supported.');
	}

	/**
	 * @deprecated
	 */
	public get(): void {
		this.warn('This feature is not supported.');
	}

	/**
	 * @deprecated
	 */
	public createDefaultHandler(): void {
		this.warn('This feature is not supported.');
	}
}

export const Logger = new ILogger();
