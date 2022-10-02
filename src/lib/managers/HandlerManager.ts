import type {
	AutocompleteInteraction,
	Collection,
	CommandInteraction,
	ContextMenuCommandInteraction,
	Message,
	MessageComponentInteraction,
	ModalSubmitInteraction,
} from 'discord.js';
import { AutocompleteHandler } from '../../handlers/AutocompleteHandler';
import { ComponentHandler } from '../../handlers/ComponentHandler';
import { CooldownHandler } from '../../handlers/CooldownHandler';
import { InteractionCommandHandler } from '../../handlers/InteractionCommandHandler';
import { MessageCommandHandler } from '../../handlers/MessageCommandHandler';
import type { Command } from '../structures/Command';
import type { Component } from '../structures/Component';

export class HandlerManager {
	public interactionCommandHandler: (
		interaction: CommandInteraction | ContextMenuCommandInteraction,
	) => any;
	public messageCommandHandler: (
		message: Message,
		commandName: string,
		args: Array<string> | Array<object>,
	) => any;
	public componentHandler: (
		interaction: MessageComponentInteraction | ModalSubmitInteraction,
	) => any;
	public autocompleteHandler: (interaction: AutocompleteInteraction) => any;
	public cooldownHandler: (
		userId: string,
		item: Command | Component,
		collection: Collection<string, Collection<string, number>>,
	) => void | number;

	constructor() {
		this.interactionCommandHandler = InteractionCommandHandler;
		this.messageCommandHandler = MessageCommandHandler;
		this.componentHandler = ComponentHandler;
		this.autocompleteHandler = AutocompleteHandler;
		this.cooldownHandler = CooldownHandler;
	}

	public setInteractionCommandHandler(
		handler: (interaction: CommandInteraction | ContextMenuCommandInteraction) => any,
	): HandlerManager {
		this.interactionCommandHandler = handler;

		return this;
	}

	public setMessageCommandHandler(
		handler: (
			message: Message,
			commandName: string,
			args: Array<string> | Array<object>,
		) => any,
	): HandlerManager {
		this.messageCommandHandler = handler;

		return this;
	}

	public setComponentHandler(
		handler: (
			interaction: MessageComponentInteraction | ModalSubmitInteraction,
		) => any,
	): HandlerManager {
		this.componentHandler = handler;

		return this;
	}

	public setAutocompleteHandler(
		handler: (interaction: AutocompleteInteraction) => any,
	): HandlerManager {
		this.autocompleteHandler = handler;

		return this;
	}

	public setCooldownHandler(
		handler: (
			userId: string,
			item: Command | Component,
			collection: Collection<string, Collection<string, number>>,
		) => void | number,
	): HandlerManager {
		this.cooldownHandler = handler;

		return this;
	}
}

export const Handlers = new HandlerManager();
