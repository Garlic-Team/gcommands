import { Context, ContextOptions } from './Context';
import type { AutocompleteInteraction, CacheType } from 'discord.js';
import type { Command } from '../Command';
import type { GClient } from '../../GClient';
import type { Argument, ArgumentChoice, ArgumentOptions } from '../Argument';
export interface AutocompleteContextOptions<Cached extends CacheType = CacheType> extends ContextOptions<Cached> {
    interaction: AutocompleteInteraction;
    command: Command;
    argument: Argument | ArgumentOptions;
    value: string | number;
    respond: (choices: Array<ArgumentChoice>) => Promise<void>;
}
export declare class AutocompleteContext<Cached extends CacheType = CacheType> extends Context<Cached> {
    interaction: AutocompleteInteraction;
    readonly command: Command;
    readonly commandName: string;
    readonly argument: Argument | ArgumentOptions;
    readonly argumentName: string;
    readonly value: string | number;
    respond: (choices: Array<ArgumentChoice>) => Promise<void>;
    inGuild: () => this is AutocompleteContext<'present'>;
    inCachedGuild: () => this is AutocompleteContext<'cached'>;
    inRawGuild: () => this is AutocompleteContext<'raw'>;
    constructor(client: GClient, options: AutocompleteContextOptions<Cached>);
}
//# sourceMappingURL=AutocompleteContext.d.ts.map