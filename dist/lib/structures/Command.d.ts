import { AutoDeferType } from '../GClient';
import { Argument, ArgumentOptions } from './Argument';
import type { CommandContext } from './contexts/CommandContext';
export declare enum CommandType {
    'MESSAGE' = 0,
    'SLASH' = 1,
    'CONTEXT_USER' = 2,
    'CONTEXT_MESSAGE' = 3
}
export declare type CommandInhibitor = (ctx: CommandContext) => boolean | any;
export declare type CommandInhibitors = Array<{
    run: CommandInhibitor;
} | CommandInhibitor>;
export interface CommandOptions {
    name: string;
    type: Array<CommandType | keyof typeof CommandType>;
    description?: string;
    arguments?: Array<Argument | ArgumentOptions>;
    inhibitors?: CommandInhibitors;
    guildId?: string;
    cooldown?: string;
    autoDefer?: AutoDeferType | keyof typeof AutoDeferType;
    fileName?: string;
    run?: (ctx: CommandContext) => any;
    onError?: (ctx: CommandContext, error: any) => any;
}
export declare class Command {
    name: string;
    description?: string;
    type: Array<CommandType | keyof typeof CommandType>;
    arguments?: Array<Argument>;
    inhibitors: CommandInhibitors;
    guildId?: string;
    private static defaults?;
    cooldown?: string;
    fileName?: string;
    run: (ctx: CommandContext) => any;
    onError?: (ctx: CommandContext, error: any) => any;
    reloading: boolean;
    autoDefer?: AutoDeferType | keyof typeof AutoDeferType;
    constructor(options: CommandOptions);
    unregister(): Command;
    load(): void;
    inhibit(ctx: CommandContext): Promise<boolean>;
    reload(): Promise<Command>;
    toJSON(): Array<Record<string, any>>;
    static setDefaults(defaults: Partial<CommandOptions>): void;
}
//# sourceMappingURL=Command.d.ts.map