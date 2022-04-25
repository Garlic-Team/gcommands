import type { ClientEvents, WSEventType } from 'discord.js';
export interface ListenerOptions<WS extends boolean, Event extends WS extends true ? WSEventType : keyof ClientEvents> {
    event: Event | string;
    name: string;
    once?: boolean;
    ws?: WS;
    fileName?: string;
    run?: (...args: Event extends keyof ClientEvents ? ClientEvents[Event] : Array<any>) => any;
}
export declare class Listener<WS extends boolean = boolean, Event extends WS extends true ? WSEventType : keyof ClientEvents = WS extends true ? WSEventType : keyof ClientEvents> {
    event: Event | string;
    name: string;
    once?: boolean;
    ws?: WS;
    fileName?: string;
    run: (...args: Array<any>) => any;
    reloading: boolean;
    constructor(options: ListenerOptions<WS, Event>);
    load(): void;
    unregister(): void;
    _run(...args: Array<any>): Promise<void>;
    reload(): Promise<Listener>;
}
//# sourceMappingURL=Listener.d.ts.map