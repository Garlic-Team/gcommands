import { Collection } from 'discord.js';
import { Command } from '../structures/Command';
export declare class CommandManager extends Collection<string, Command> {
    register(command: any): CommandManager;
    unregister(commandName: string): Command | undefined;
    load(): void;
}
export declare const Commands: CommandManager;
//# sourceMappingURL=CommandManager.d.ts.map