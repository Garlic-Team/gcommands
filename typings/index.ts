export class ButtonCollectorV12 {
    constructor(...args: any[]);

    collect(...args: any[]): void;

    dispose(...args: any[]): void;

    empty(...args: any[]): void;

    static captureRejectionSymbol: any;

    static captureRejections: boolean;

    static defaultMaxListeners: number;

    static errorMonitor: any;

    static getEventListeners(emitterOrTarget: any, type: any): any;

    static init(opts: any): void;

    static kMaxEventTargetListeners: any;

    static kMaxEventTargetListenersWarned: any;

    static key(...args: any[]): void;

    static listenerCount(emitter: any, type: any): any;

    static on(emitter: any, event: any, options: any): any;

    static once(emitter: any, name: any, options: any): any;

    static setMaxListeners(n: any, eventTargets: any): void;

    static usingDomains: boolean;

}

export class ButtonCollectorV13 {
    constructor(...args: any[]);

    collect(...args: any[]): void;

    dispose(...args: any[]): void;

    empty(...args: any[]): void;

    endReason(...args: any[]): void;

    static captureRejectionSymbol: any;

    static captureRejections: boolean;

    static defaultMaxListeners: number;

    static errorMonitor: any;

    static getEventListeners(emitterOrTarget: any, type: any): any;

    static init(opts: any): void;

    static kMaxEventTargetListeners: any;

    static kMaxEventTargetListenersWarned: any;

    static key(...args: any[]): void;

    static listenerCount(emitter: any, type: any): any;

    static on(emitter: any, event: any, options: any): any;

    static once(emitter: any, name: any, options: any): any;

    static setMaxListeners(n: any, eventTargets: any): void;

    static usingDomains: boolean;

}

export class Color {
    constructor(...args: any[]);

    getRGB(...args: any[]): void;

    getText(...args: any[]): void;

}

export class GCommandLoader {
    constructor(...args: any[]);

}

export class GCommandsDispatcher {
    constructor(...args: any[]);

    addInhibitor(...args: any[]): void;

    awaitButtons(...args: any[]): void;

    createButtonCollector(...args: any[]): void;

    getGuildPrefix(...args: any[]): void;

    removeInhibitor(...args: any[]): void;

    setGuildPrefix(...args: any[]): void;

}

export class GCommandsGuild {
    constructor(...args: any[]);

    getCommandPrefix(...args: any[]): void;

    setCommandPrefix(...args: any[]): void;

}

export class GCommandsMessage {
    constructor(...args: any[]);

    buttons(...args: any[]): void;

    buttonsEdit(...args: any[]): void;

    buttonsWithReply(...args: any[]): void;

    inlineReply(...args: any[]): void;

}

export class GDatabaseLoader {
    constructor(...args: any[]);

}

export class GEventLoader {
    constructor(...args: any[]);

    createAPIMessage(...args: any[]): void;

    getSlashArgs(...args: any[]): void;

    getSlashArgs2(...args: any[]): void;

    inhibit(...args: any[]): void;

    loadMoreEvents(...args: any[]): void;

    messageEvent(...args: any[]): void;

    slashEvent(...args: any[]): void;

}

export class GEvents {
    constructor(...args: any[]);

}

export class MessageActionRow {
    constructor(...args: any[]);

    addComponent(...args: any[]): void;

    setup(...args: any[]): void;

    toJSON(...args: any[]): void;

}

export class MessageButton {
    constructor(...args: any[]);

    parseEmoji(...args: any[]): void;

    resolveButton(...args: any[]): void;

    resolveStyle(...args: any[]): void;

    setDisabled(...args: any[]): void;

    setEmoji(...args: any[]): void;

    setID(...args: any[]): void;

    setLabel(...args: any[]): void;

    setStyle(...args: any[]): void;

    setURL(...args: any[]): void;

    setup(...args: any[]): void;

    toJSON(...args: any[]): void;

}

export const ButtonTypes: {
    blurple: string;
    gray: string;
    green: string;
    grey: string;
    red: string;
    url: string;
};

export const SlashCommand: {
    BOOLEAN: number;
    CHANNEL: number;
    INTEGER: number;
    MENTIONABLE: number;
    ROLE: number;
    STRING: number;
    SUB_COMMAND: number;
    SUB_COMMAND_GROUP: number;
    USER: number;
};

export const version: string;

export function GCommands(...args: any[]): any;

export function GCommandsBase(...args: any[]): void;

export namespace ButtonCollectorV12 {
    class EventEmitter {
        constructor(opts: any);

        addListener(type: any, listener: any): any;

        emit(type: any, args: any): any;

        eventNames(): any;

        getMaxListeners(): any;

        listenerCount(type: any): any;

        listeners(type: any): any;

        off(type: any, listener: any): any;

        on(type: any, listener: any): any;

        once(type: any, listener: any): any;

        prependListener(type: any, listener: any): any;

        prependOnceListener(type: any, listener: any): any;

        rawListeners(type: any): any;

        removeAllListeners(type: any, ...args: any[]): any;

        removeListener(type: any, listener: any): any;

        setMaxListeners(n: any): any;

        static EventEmitter: any;

        static captureRejectionSymbol: any;

        static captureRejections: boolean;

        static defaultMaxListeners: number;

        static errorMonitor: any;

        static getEventListeners(emitterOrTarget: any, type: any): any;

        static init(opts: any): void;

        static kMaxEventTargetListeners: any;

        static kMaxEventTargetListenersWarned: any;

        static listenerCount(emitter: any, type: any): any;

        static on(emitter: any, event: any, options: any): any;

        static once(emitter: any, name: any, options: any): any;

        static setMaxListeners(n: any, eventTargets: any): void;

        static usingDomains: boolean;

    }

}

export namespace ButtonCollectorV13 {
    class EventEmitter {
        constructor(opts: any);

        addListener(type: any, listener: any): any;

        emit(type: any, args: any): any;

        eventNames(): any;

        getMaxListeners(): any;

        listenerCount(type: any): any;

        listeners(type: any): any;

        off(type: any, listener: any): any;

        on(type: any, listener: any): any;

        once(type: any, listener: any): any;

        prependListener(type: any, listener: any): any;

        prependOnceListener(type: any, listener: any): any;

        rawListeners(type: any): any;

        removeAllListeners(type: any, ...args: any[]): any;

        removeListener(type: any, listener: any): any;

        setMaxListeners(n: any): any;

        static EventEmitter: any;

        static captureRejectionSymbol: any;

        static captureRejections: boolean;

        static defaultMaxListeners: number;

        static errorMonitor: any;

        static getEventListeners(emitterOrTarget: any, type: any): any;

        static init(opts: any): void;

        static kMaxEventTargetListeners: any;

        static kMaxEventTargetListenersWarned: any;

        static listenerCount(emitter: any, type: any): any;

        static on(emitter: any, event: any, options: any): any;

        static once(emitter: any, name: any, options: any): any;

        static setMaxListeners(n: any, eventTargets: any): void;

        static usingDomains: boolean;

    }

}

export namespace GCommands {
    class EventEmitter {
        constructor(opts: any);

        addListener(type: any, listener: any): any;

        emit(type: any, args: any): any;

        eventNames(): any;

        getMaxListeners(): any;

        listenerCount(type: any): any;

        listeners(type: any): any;

        off(type: any, listener: any): any;

        on(type: any, listener: any): any;

        once(type: any, listener: any): any;

        prependListener(type: any, listener: any): any;

        prependOnceListener(type: any, listener: any): any;

        rawListeners(type: any): any;

        removeAllListeners(type: any, ...args: any[]): any;

        removeListener(type: any, listener: any): any;

        setMaxListeners(n: any): any;

        static EventEmitter: any;

        static captureRejectionSymbol: any;

        static captureRejections: boolean;

        static defaultMaxListeners: number;

        static errorMonitor: any;

        static getEventListeners(emitterOrTarget: any, type: any): any;

        static init(opts: any): void;

        static kMaxEventTargetListeners: any;

        static kMaxEventTargetListenersWarned: any;

        static listenerCount(emitter: any, type: any): any;

        static on(emitter: any, event: any, options: any): any;

        static once(emitter: any, name: any, options: any): any;

        static setMaxListeners(n: any, eventTargets: any): void;

        static usingDomains: boolean;

    }

    const captureRejectionSymbol: any;

    const captureRejections: boolean;

    const defaultMaxListeners: number;

    const errorMonitor: any;

    const kMaxEventTargetListeners: any;

    const kMaxEventTargetListenersWarned: any;

    const usingDomains: boolean;

    function getEventListeners(emitterOrTarget: any, type: any): any;

    function init(opts: any): void;

    function listenerCount(emitter: any, type: any): any;

    function on(emitter: any, event: any, options: any): any;

    function once(emitter: any, name: any, options: any): any;

    function setMaxListeners(n: any, eventTargets: any): void;

}

export namespace GCommandsBase {
    class EventEmitter {
        constructor(opts: any);

        addListener(type: any, listener: any): any;

        emit(type: any, args: any): any;

        eventNames(): any;

        getMaxListeners(): any;

        listenerCount(type: any): any;

        listeners(type: any): any;

        off(type: any, listener: any): any;

        on(type: any, listener: any): any;

        once(type: any, listener: any): any;

        prependListener(type: any, listener: any): any;

        prependOnceListener(type: any, listener: any): any;

        rawListeners(type: any): any;

        removeAllListeners(type: any, ...args: any[]): any;

        removeListener(type: any, listener: any): any;

        setMaxListeners(n: any): any;

        static EventEmitter: any;

        static captureRejectionSymbol: any;

        static captureRejections: boolean;

        static defaultMaxListeners: number;

        static errorMonitor: any;

        static getEventListeners(emitterOrTarget: any, type: any): any;

        static init(opts: any): void;

        static kMaxEventTargetListeners: any;

        static kMaxEventTargetListenersWarned: any;

        static listenerCount(emitter: any, type: any): any;

        static on(emitter: any, event: any, options: any): any;

        static once(emitter: any, name: any, options: any): any;

        static setMaxListeners(n: any, eventTargets: any): void;

        static usingDomains: boolean;

    }

    const captureRejectionSymbol: any;

    const captureRejections: boolean;

    const defaultMaxListeners: number;

    const errorMonitor: any;

    const kMaxEventTargetListeners: any;

    const kMaxEventTargetListenersWarned: any;

    const usingDomains: boolean;

    function getEventListeners(emitterOrTarget: any, type: any): any;

    function init(opts: any): void;

    function listenerCount(emitter: any, type: any): any;

    function on(emitter: any, event: any, options: any): any;

    function once(emitter: any, name: any, options: any): any;

    function setMaxListeners(n: any, eventTargets: any): void;

}

export namespace Util {
    function resolveString(...args: any[]): void;
}