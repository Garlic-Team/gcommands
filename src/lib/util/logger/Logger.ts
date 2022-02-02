import EventEmitter from 'events';
import { Util } from '../Util';
import type { AutocompleteContext } from '../../structures/contexts/AutocompleteContext';
import type { CommandContext } from '../../structures/contexts/CommandContext';
import type { ComponentContext } from '../../structures/contexts/ComponentContext';
import type { Command } from '../../structures/Command';
import type { Component } from '../../structures/Component';
import type { Listener } from '../../structures/Listener';
import type { Plugin } from '../../structures/Plugin';

export enum LoggerEvents {
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

export interface LoggerEventsInterface {
	'handlerRun': (ctx: AutocompleteContext | CommandContext | ComponentContext) => void;
	'handlerError': (ctx: AutocompleteContext | CommandContext | ComponentContext, error: any) => void;
	'commandHandlerRun': (ctx: CommandContext) => void;
	'commandHandlerError': (ctx: CommandContext, error: any) => void;
	'autoCompleteHandlerRun': (ctx: AutocompleteContext) => void;
	'autoCompleteHandlerError': (ctx: AutocompleteContext, error: any) => void;
	'componentHandlerRun': (ctx: ComponentContext) => void;
	'componentHandlerError': (ctx: ComponentContext, error: any) => void;
	'commandRegistered': (command: Command) => void;
	'commandUnregistered': (command: Command) => void;
	'componentRegistered': (component: Component) => void;
	'componentUnregistered': (component: Component) => void;
	'listenerRegistered': (listener: Listener) => void;
	'listenerUnregistered': (listener: Listener) => void;
	'pluginRegistered': (plugin: Plugin) => void;
}

export const enum LogLevel {
	TRACE = 1,
	DEBUG = 2,
	INFO = 3,
	TIME = 4,
	WARN = 5,
	TIME_END = 6,
	ERROR = 8,
	OFF = 99,
}

export type LogMethods = 'trace' | 'debug' | 'info' | 'time' | 'warn' | 'timeEnd' | 'error';

export declare interface ILogger {
	on<U extends keyof LoggerEventsInterface>(
	  event: U, listener: LoggerEventsInterface[U]
	): this;
  
	emit<U extends keyof LoggerEventsInterface>(
	  event: U, ...args: Parameters<LoggerEventsInterface[U]>
	): boolean;
}

export class ILogger extends EventEmitter {
	TRACE: LogLevel.TRACE;
	DEBUG: LogLevel.DEBUG;
	INFO: LogLevel.INFO;
	TIME: LogLevel.TIME;
	WARN: LogLevel.WARN;
	TIME_END: LogLevel.TIME_END;
	ERROR: LogLevel.ERROR;
	OFF: LogLevel.OFF;
	level: LogLevel;

	constructor(level: LogLevel) {
		super();

		this.level = level;
		/*JSLogger.useDefaults({
			defaultLevel: JSLogger.TRACE,
			formatter: function (messages: any, ctx) {
				let color;
				if (ctx.level === JSLogger.TRACE) color = '\x1b[91m';
				if (ctx.level === JSLogger.DEBUG) color = '\x1b[2m';
				if (ctx.level === JSLogger.INFO) color = '\x1b[36m';
				if (ctx.level === JSLogger.TIME) color = '\x1b[97m';
				if (ctx.level === JSLogger.WARN) color = '\x1b[93m';
				if (ctx.level === JSLogger.ERROR) color = '\x1b[91m';
        
				const date = new Date();
				messages[0] = `${color}[${Util.pad(date.getHours())}:${Util.pad(date.getMinutes())}:${Util.pad(date.getSeconds())}/${ctx.level.name}]\x1b[0m ${
					messages[0]
				}`;
			},
		});

		Object.assign(this, JSLogger);*/
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

	public time(val: string): void {
		if (val.length > 0) this.invoke(LogLevel.TIME, ...val);
	}

	public timeEnd(val: string): void {
		if (val.length > 0) this.invoke(LogLevel.TIME_END, ...val);
	}

	public warn(...values: readonly unknown[]): void {
		this.invoke(LogLevel.WARN, ...values);
	}

	public error(...values: readonly unknown[]): void {
		this.invoke(LogLevel.ERROR, ...values);
	}

	public invoke(level: LogLevel, ...values: readonly unknown[]): void {
		let color = '';
		if (level === LogLevel.TRACE) color = '\x1b[91m';
		else if (level === LogLevel.DEBUG) color = '\x1b[2m';
		else if (level === LogLevel.INFO) color = '\x1b[36m';
		else if ([LogLevel.TIME, LogLevel.TIME_END].includes(level)) color = '\x1b[97m';
		else if (level === LogLevel.WARN) color = '\x1b[93m';
		else color = '\x1b[91m';

		const method = this.LevelMethods.get(level);
		const date = new Date();

		// @ts-expect-error Research required ):
		console[method](`${color}[${Util.pad(date.getHours())}:${Util.pad(date.getMinutes())}:${Util.pad(date.getSeconds())}/${method.toUpperCase()}]\x1b[0m ${values[0]}`, ...values.slice(1));
	}

	protected readonly LevelMethods = new Map<LogLevel, LogMethods>([
		[LogLevel.TRACE, 'trace'],
		[LogLevel.DEBUG, 'debug'],
		[LogLevel.INFO, 'info'],
		[LogLevel.TIME, 'time'],
		[LogLevel.WARN, 'warn'],
		[LogLevel.TIME_END, 'timeEnd'],
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
		Logger.warn('This feature is not supported.');
	}

	/**
	 * @deprecated
	 */
	public setHandler(): void {
		Logger.warn('This feature is not supported.');
	}

	/**
	 * @deprecated
	 */
	public get(): void {
		Logger.warn('This feature is not supported.');
	}

	/**
	 * @deprecated
	 */
	public createDefaultHandler(): void {
		Logger.warn('This feature is not supported.');
	}
}

export const Logger = new ILogger(LogLevel.TRACE);