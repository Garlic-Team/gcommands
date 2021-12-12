import {
	AutocompleteInteraction,
	Collection,
	CommandInteraction,
	ContextMenuInteraction,
	Message,
	MessageComponentInteraction
} from 'discord.js';
import {InteractionCommandHandler} from '../../handlers/InteractionCommandHandler';
import {MessageCommandHandler} from '../../handlers/MessageCommandHandler';
import {ComponentHandler} from '../../handlers/ComponentHandler';
import {CooldownHandler} from '../../handlers/CooldownHandler';
import {Command} from '../structures/Command';
import {Component} from '../structures/Component';
import {AutocompleteHandler} from '../../handlers/AutocompleteHandler';

export class HandlerManager {
	public interactionCommandHandler: (interaction: CommandInteraction | ContextMenuInteraction) => any;
	public messageCommandHandler: (message: Message, commandName: string, args: Array<string> | Array<object>) => any;
	public componentHandler: (interaction: MessageComponentInteraction) => any;
	public autocompleteHandler: (interaction: AutocompleteInteraction) => any;
	public cooldownHandler: (userId: string, item: Command | Component, collection: Collection<string, Collection<string, number>>) => void | number;

	constructor() {
		this.interactionCommandHandler = InteractionCommandHandler;
		this.messageCommandHandler = MessageCommandHandler;
		this.componentHandler = ComponentHandler;
		this.autocompleteHandler = AutocompleteHandler;
		this.cooldownHandler = CooldownHandler;
	}

	public setInteractionCommandHandler(handler: (interaction: CommandInteraction | ContextMenuInteraction) => any): HandlerManager {
		this.interactionCommandHandler = handler;

		return this;
	}

	public setMessageCommandHandler(handler: (message: Message, commandName: string, args: Array<string> | Array<object>) => any): HandlerManager {
		this.messageCommandHandler = handler;

		return this;
	}

	public setComponentHandler(handler: (interaction: MessageComponentInteraction) => any): HandlerManager {
		this.componentHandler = handler;

		return this;
	}

	public setAutocompleteHandler(handler: (interaction: AutocompleteInteraction) => any): HandlerManager {
		this.autocompleteHandler = handler;

		return this;
	}

	public setCooldownHandler(handler: (userId: string, item: Command | Component, collection: Collection<string, Collection<string, number>>) => void | number): HandlerManager {
		this.cooldownHandler = handler;

		return this;
	}
}
