/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import EventEmitter from 'events';
import JSLogger, { ILogger, ILoggerOpts, ILogHandler, ILogLevel } from 'js-logger';
import { Util } from '../util/Util';
import type { GlobalLogger } from 'js-logger';
import type { AutocompleteContext } from './contexts/AutocompleteContext';
import type { CommandContext } from './contexts/CommandContext';
import type { ComponentContext } from './contexts/ComponentContext';
import type { Command } from './Command';
import type { Component } from './Component';
import type { Listener } from './Listener';
import type { Plugin } from './Plugin';

export enum LoggerEvents {
	'HANDLER_RUN' = 'handlerRun',
	'HANDLER_ERROR' = 'handlerError',
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
	'commandRegistered': (command: Command) => void;
	'commandUnregistered': (command: Command) => void;
	'componentRegistered': (component: Component) => void;
	'componentUnregistered': (component: Component) => void;
	'listenerRegistered': (listener: Listener) => void;
	'listenerUnregistered': (listener: Listener) => void;
	'pluginRegistered': (plugin: Plugin) => void;
}

export declare interface LoggerClass {
	on<U extends keyof LoggerEventsInterface>(
	  event: U, listener: LoggerEventsInterface[U]
	): this;
  
	emit<U extends keyof LoggerEventsInterface>(
	  event: U, ...args: Parameters<LoggerEventsInterface[U]>
	): boolean;
}

export class LoggerClass extends EventEmitter implements GlobalLogger {
	TRACE: ILogLevel;
	DEBUG: ILogLevel;
	INFO: ILogLevel;
	TIME: ILogLevel;
	WARN: ILogLevel;
	ERROR: ILogLevel;
	OFF: ILogLevel;

	constructor() {
		super();

		JSLogger.useDefaults({
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

		Object.assign(this, JSLogger);
	}

	// Only typings, Object.assign goes brooooo    
	useDefaults(options?: ILoggerOpts): void {}
	setHandler(logHandler: ILogHandler): void {}
	get(name: string): ILogger { return JSLogger.get(name); }
	createDefaultHandler(options?: { formatter?: ILogHandler }): ILogHandler { return JSLogger.createDefaultHandler(options); }

	trace(...x: any[]): void {}
	debug(...x: any[]): void {}
	info(...x: any[]): void {}
	log(...x: any[]): void {}
	warn(...x: any[]): void {}
	error(...x: any[]): void {}
	time(label: string): void {}
	timeEnd(label: string): void {}
    
	setLevel(level: ILogLevel): void {}
	getLevel(): ILogLevel { return JSLogger.getLevel(); }
	enabledFor(level: ILogLevel): boolean { return JSLogger.enabledFor(level); }
}

export const Logger = new LoggerClass();