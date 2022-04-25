import { Collection } from 'discord.js';
import { Plugin } from '../structures/Plugin';
export declare enum PluginHookType {
    AfterInitialization = "afterInitialization",
    BeforeLogin = "beforeLogin",
    AfterLogin = "afterLogin"
}
export declare class PluginManager extends Collection<string, Plugin> {
    register(plugin: any): PluginManager;
    load(hookType: PluginHookType): Promise<void>;
}
export declare const Plugins: PluginManager;
//# sourceMappingURL=PluginManager.d.ts.map