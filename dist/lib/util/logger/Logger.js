"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.ILogger = exports.LogLevel = exports.Events = void 0;
const tslib_1 = require("tslib");
const Util_1 = require("../Util");
const node_events_1 = tslib_1.__importDefault(require("node:events"));
var Events;
(function (Events) {
    Events["HANDLER_RUN"] = "handlerRun";
    Events["HANDLER_ERROR"] = "handlerError";
    Events["COMMAND_HANDLER_RUN"] = "commandHandlerRun";
    Events["COMMAND_HANDLER_ERROR"] = "commandHandlerError";
    Events["AUTOCOMPLETE_HANDLER_RUN"] = "autoCompleteHandlerRun";
    Events["AUTOCOMPLETE_HANDLER_ERROR"] = "autoCompleteHandlerError";
    Events["COMPONENT_HANDLER_RUN"] = "componentHandlerRun";
    Events["COMPONENT_HANDLER_ERROR"] = "componentHandlerError";
    Events["COMMAND_REGISTERED"] = "commandRegistered";
    Events["COMMAND_UNREGISTERED"] = "commandUnregistered";
    Events["COMPONENT_REGISTERED"] = "componentRegistered";
    Events["COMPONENT_UNREGISTERED"] = "componentUnregistered";
    Events["LISTENER_REGISTERED"] = "listenerRegistered";
    Events["LISTENER_UNREGISTERED"] = "listenerUnregistered";
    Events["PLUGIN_REGISTERED"] = "pluginRegistered";
})(Events = exports.Events || (exports.Events = {}));
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["TRACE"] = 1] = "TRACE";
    LogLevel[LogLevel["DEBUG"] = 2] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 3] = "INFO";
    /**
     * @deprecated
     */
    LogLevel[LogLevel["TIME"] = 4] = "TIME";
    LogLevel[LogLevel["WARN"] = 5] = "WARN";
    LogLevel[LogLevel["ERROR"] = 8] = "ERROR";
    LogLevel[LogLevel["OFF"] = 99] = "OFF";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
class ILogger extends node_events_1.default {
    constructor() {
        super();
        this.level = 1 /* TRACE */;
        this.LevelMethods = new Map([
            [1 /* TRACE */, 'trace'],
            [2 /* DEBUG */, 'debug'],
            [3 /* INFO */, 'info'],
            [4 /* TIME */, 'time'],
            [5 /* WARN */, 'warn'],
            [8 /* ERROR */, 'error'],
        ]);
        this.TRACE = 1 /* TRACE */;
        this.DEBUG = 2 /* DEBUG */;
        this.INFO = 3 /* INFO */;
        this.TIME = 4 /* TIME */;
        this.WARN = 5 /* WARN */;
        this.ERROR = 8 /* ERROR */;
        this.OFF = 99 /* OFF */;
    }
    trace(...values) {
        this.invoke(1 /* TRACE */, ...values);
    }
    debug(...values) {
        this.invoke(2 /* DEBUG */, ...values);
    }
    info(...values) {
        this.invoke(3 /* INFO */, ...values);
    }
    /**
     * @deprecated
     */
    time(val) {
        if (val.length > 0)
            this.invokeTime(4 /* TIME */, val, 'start');
    }
    /**
     * @deprecated
     */
    timeEnd(val) {
        if (val.length > 0)
            this.invokeTime(4 /* TIME */, val, 'stop');
    }
    warn(...values) {
        this.invoke(5 /* WARN */, ...values);
    }
    error(...values) {
        this.invoke(8 /* ERROR */, ...values);
    }
    invoke(level, ...values) {
        if (!this.enabledFor(level))
            return;
        let color = '';
        if (level === 1 /* TRACE */)
            color = '\x1b[91m';
        else if (level === 2 /* DEBUG */)
            color = '\x1b[2m';
        else if (level === 3 /* INFO */)
            color = '\x1b[36m';
        else if (level === 5 /* WARN */)
            color = '\x1b[93m';
        else
            color = '\x1b[91m';
        const method = this.LevelMethods.get(level);
        const date = new Date();
        console[method](`${color}[${Util_1.Util.pad(date.getHours())}:${Util_1.Util.pad(date.getMinutes())}:${Util_1.Util.pad(date.getSeconds())}/${method.toUpperCase()}]\x1b[0m ${values[0]}`, ...values.slice(1));
    }
    /**
     * @deprecated
     */
    invokeTime(level, val, type) {
        if (!this.enabledFor(level))
            return;
        if (type == 'start')
            console.time(val);
        else
            console.timeEnd(val);
    }
    setLevel(level) {
        this.level = level;
    }
    getLevel() {
        return this.level;
    }
    enabledFor(level) {
        return level >= this.level;
    }
    /**
     * @deprecated
     */
    useDefaults() {
        this.warn('This feature is not supported.');
    }
    /**
     * @deprecated
     */
    setHandler() {
        this.warn('This feature is not supported.');
    }
    /**
     * @deprecated
     */
    get() {
        this.warn('This feature is not supported.');
    }
    /**
     * @deprecated
     */
    createDefaultHandler() {
        this.warn('This feature is not supported.');
    }
}
exports.ILogger = ILogger;
exports.Logger = new ILogger();
