/// <reference types="node" />
import type { AutocompleteContext } from '../../structures/contexts/AutocompleteContext';
import type { CommandContext } from '../../structures/contexts/CommandContext';
import type { ComponentContext } from '../../structures/contexts/ComponentContext';
import type { Command } from '../../structures/Command';
import type { Component } from '../../structures/Component';
import type { Listener } from '../../structures/Listener';
import type { Plugin } from '../../structures/Plugin';
import type { Awaitable } from 'discord.js';
import EventEmitter from 'node:events';
export declare enum Events {
    'HANDLER_RUN' = "handlerRun",
    'HANDLER_ERROR' = "handlerError",
    'COMMAND_HANDLER_RUN' = "commandHandlerRun",
    'COMMAND_HANDLER_ERROR' = "commandHandlerError",
    'AUTOCOMPLETE_HANDLER_RUN' = "autoCompleteHandlerRun",
    'AUTOCOMPLETE_HANDLER_ERROR' = "autoCompleteHandlerError",
    'COMPONENT_HANDLER_RUN' = "componentHandlerRun",
    'COMPONENT_HANDLER_ERROR' = "componentHandlerError",
    'COMMAND_REGISTERED' = "commandRegistered",
    'COMMAND_UNREGISTERED' = "commandUnregistered",
    'COMPONENT_REGISTERED' = "componentRegistered",
    'COMPONENT_UNREGISTERED' = "componentUnregistered",
    'LISTENER_REGISTERED' = "listenerRegistered",
    'LISTENER_UNREGISTERED' = "listenerUnregistered",
    'PLUGIN_REGISTERED' = "pluginRegistered"
}
export interface LoggerEvents {
    'handlerRun': [ctx: AutocompleteContext | CommandContext | ComponentContext];
    'handlerError': [ctx: AutocompleteContext | CommandContext | ComponentContext, error: any];
    'commandHandlerRun': [ctx: CommandContext];
    'commandHandlerError': [ctx: CommandContext, error: any];
    'autoCompleteHandlerRun': [ctx: AutocompleteContext];
    'autoCompleteHandlerError': [ctx: AutocompleteContext, error: any];
    'componentHandlerRun': [ctx: ComponentContext];
    'componentHandlerError': [ctx: ComponentContext, error: any];
    'commandRegistered': [command: Command];
    'commandUnregistered': [command: Command];
    'componentRegistered': [component: Component];
    'componentUnregistered': [component: Component];
    'listenerRegistered': [listener: Listener];
    'listenerUnregistered': [listener: Listener];
    'pluginRegistered': [plugin: Plugin];
}
export declare interface ILogger {
    on<U extends keyof LoggerEvents>(event: U, listener: LoggerEvents[U]): this;
    on<K extends keyof LoggerEvents>(event: K, listener: (...args: LoggerEvents[K]) => Awaitable<void>): this;
    on<S extends string | symbol>(event: Exclude<S, keyof LoggerEvents>, listener: (...args: any[]) => Awaitable<void>): this;
    once<K extends keyof LoggerEvents>(event: K, listener: (...args: LoggerEvents[K]) => Awaitable<void>): this;
    once<S extends string | symbol>(event: Exclude<S, keyof LoggerEvents>, listener: (...args: any[]) => Awaitable<void>): this;
    emit<K extends keyof LoggerEvents>(event: K, ...args: LoggerEvents[K]): boolean;
    emit<S extends string | symbol>(event: Exclude<S, keyof LoggerEvents>, ...args: unknown[]): boolean;
    off<K extends keyof LoggerEvents>(event: K, listener: (...args: LoggerEvents[K]) => Awaitable<void>): this;
    off<S extends string | symbol>(event: Exclude<S, keyof LoggerEvents>, listener: (...args: any[]) => Awaitable<void>): this;
    removeAllListeners<K extends keyof LoggerEvents>(event?: K): this;
    removeAllListeners<S extends string | symbol>(event?: Exclude<S, keyof LoggerEvents>): this;
}
export declare const enum LogLevel {
    TRACE = 1,
    DEBUG = 2,
    INFO = 3,
    /**
     * @deprecated
     */
    TIME = 4,
    WARN = 5,
    ERROR = 8,
    OFF = 99
}
export declare type LogMethods = 'trace' | 'debug' | 'info' | 'time' | 'warn' | 'timeEnd' | 'error';
export declare class ILogger extends EventEmitter {
    TRACE: LogLevel.TRACE;
    DEBUG: LogLevel.DEBUG;
    INFO: LogLevel.INFO;
    TIME: LogLevel.TIME;
    WARN: LogLevel.WARN;
    ERROR: LogLevel.ERROR;
    OFF: LogLevel.OFF;
    level: LogLevel;
    constructor();
    trace(...values: readonly unknown[]): void;
    debug(...values: readonly unknown[]): void;
    info(...values: readonly unknown[]): void;
    /**
     * @deprecated
     */
    time(val: string): void;
    /**
     * @deprecated
     */
    timeEnd(val: string): void;
    warn(...values: readonly unknown[]): void;
    error(...values: readonly unknown[]): void;
    invoke(level: LogLevel, ...values: readonly unknown[]): void;
    /**
     * @deprecated
     */
    invokeTime(level: LogLevel, val: string, type: 'start' | 'stop'): void;
    protected readonly LevelMethods: Map<LogLevel, LogMethods>;
    setLevel(level: LogLevel): void;
    getLevel(): LogLevel;
    enabledFor(level: LogLevel): boolean;
    /**
     * @deprecated
     */
    useDefaults(): void;
    /**
     * @deprecated
     */
    setHandler(): void;
    /**
     * @deprecated
     */
    get(): void;
    /**
     * @deprecated
     */
    createDefaultHandler(): void;
}
export declare const Logger: ILogger;
//# sourceMappingURL=Logger.d.ts.map