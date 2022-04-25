import { Collection } from 'discord.js';
import { Component } from '../structures/Component';
export declare class ComponentManager extends Collection<string, Component> {
    register(component: Component): ComponentManager;
    unregister(componentName: string): Component | undefined;
    load(): void;
}
export declare const Components: ComponentManager;
//# sourceMappingURL=ComponentManager.d.ts.map