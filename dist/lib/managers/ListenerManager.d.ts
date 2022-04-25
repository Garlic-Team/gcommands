import { Listener } from '../structures/Listener';
import { Collection } from 'discord.js';
export declare class ListenerManager extends Collection<string, Listener> {
    register(listener: Listener): ListenerManager;
    unregister(name: string): Listener | undefined;
    load(): void;
}
export declare const Listeners: ListenerManager;
//# sourceMappingURL=ListenerManager.d.ts.map