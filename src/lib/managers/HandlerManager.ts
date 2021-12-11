import {Collection, CommandInteraction, ContextMenuInteraction, MessageComponentInteraction} from 'discord.js';
import {interactionCommandHandler} from '../../handlers/interactionCommandHandler';
import {ComponentHandler} from '../../handlers/ComponentHandler';
import {CooldownHandler} from '../../handlers/CooldownHandler';
import {Command} from '../structures/Command';
import {Component} from '../structures/Component';

export class HandlerManager {
	public interactionCommandHandler: (interaction: CommandInteraction | ContextMenuInteraction) => any;
	public componentHandler: (interaction: MessageComponentInteraction) => any;
	public cooldownHandler: (userId: string, item: Command | Component, collection: Collection<string, Collection<string, number>>) => void | number;

	constructor() {
		this.interactionCommandHandler = interactionCommandHandler;
		this.componentHandler = ComponentHandler;
		this.cooldownHandler = CooldownHandler;
	}

	public setInteractionCommandHandler(handler: (interaction: CommandInteraction | ContextMenuInteraction) => any): HandlerManager {
		this.interactionCommandHandler = handler;

		return this;
	}

	public setComponentHandler(handler: (interaction: MessageComponentInteraction) => any): HandlerManager {
		this.componentHandler = handler;

		return this;
	}
}
