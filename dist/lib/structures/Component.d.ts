import { AutoDeferType } from '../GClient';
import type { ComponentContext } from './contexts/ComponentContext';
export declare enum ComponentType {
    'BUTTON' = 1,
    'SELECT_MENU' = 2
}
export declare type ComponentInhibitor = (ctx: ComponentContext) => boolean | any;
export declare type ComponentInhibitors = Array<{
    run: ComponentInhibitor;
} | ComponentInhibitor>;
export interface ComponentOptions {
    name: string;
    type: Array<ComponentType | keyof typeof ComponentType>;
    inhibitors?: ComponentInhibitors;
    guildId?: string;
    cooldown?: string;
    autoDefer?: AutoDeferType | keyof typeof AutoDeferType;
    fileName?: string;
    run?: (interaction: ComponentContext) => any;
    onError?: (interaction: ComponentContext, error: any) => any;
}
export declare class Component {
    name: string;
    type: Array<ComponentType | keyof typeof ComponentType>;
    inhibitors: ComponentInhibitors;
    guildId?: string;
    private static defaults;
    cooldown?: string;
    fileName?: string;
    run: (ctx: ComponentContext) => any;
    onError?: (ctx: ComponentContext, error: any) => any;
    reloading: boolean;
    autoDefer?: AutoDeferType | keyof typeof AutoDeferType;
    constructor(options: ComponentOptions);
    load(): void;
    unregister(): void;
    inhibit(ctx: ComponentContext): Promise<boolean>;
    reload(): Promise<Component>;
    static setDefaults(defaults: Partial<ComponentOptions>): void;
}
//# sourceMappingURL=Component.d.ts.map