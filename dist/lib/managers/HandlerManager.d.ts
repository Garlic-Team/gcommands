import type { AutocompleteInteraction, Collection, CommandInteraction, ContextMenuInteraction, Message, MessageComponentInteraction } from 'discord.js';
import type { Command } from '../structures/Command';
import type { Component } from '../structures/Component';
export declare class HandlerManager {
    interactionCommandHandler: (interaction: CommandInteraction | ContextMenuInteraction) => any;
    messageCommandHandler: (message: Message, commandName: string, args: Array<string> | Array<object>) => any;
    componentHandler: (interaction: MessageComponentInteraction) => any;
    autocompleteHandler: (interaction: AutocompleteInteraction) => any;
    cooldownHandler: (userId: string, item: Command | Component, collection: Collection<string, Collection<string, number>>) => void | number;
    constructor();
    setInteractionCommandHandler(handler: (interaction: CommandInteraction | ContextMenuInteraction) => any): HandlerManager;
    setMessageCommandHandler(handler: (message: Message, commandName: string, args: Array<string> | Array<object>) => any): HandlerManager;
    setComponentHandler(handler: (interaction: MessageComponentInteraction) => any): HandlerManager;
    setAutocompleteHandler(handler: (interaction: AutocompleteInteraction) => any): HandlerManager;
    setCooldownHandler(handler: (userId: string, item: Command | Component, collection: Collection<string, Collection<string, number>>) => void | number): HandlerManager;
}
export declare const Handlers: HandlerManager;
//# sourceMappingURL=HandlerManager.d.ts.map