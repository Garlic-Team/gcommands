import {Collection, MessageComponentInteraction} from 'discord.js';
import {CommandHandler} from '../../handlers/CommandHandler';
import {ComponentHandler} from '../../handlers/ComponentHandler';
import {CooldownHandler} from '../../handlers/CooldownHandler';
import {Command} from '../structures/Command';
import {Component} from '../structures/Component';
import {InteractionContext} from '../structures/InteractionContext';

export class HandlerManager {
	public commandHandler: (ctx: InteractionContext) => any;
	public componentHandler: (interaction: MessageComponentInteraction) => any;
	public cooldownHandler: (userId: string, item: Command | Component, collection: Collection<string, Collection<string, number>>) => void | number;

	constructor() {
		this.commandHandler = CommandHandler;
		this.componentHandler = ComponentHandler;
		this.cooldownHandler = CooldownHandler;
	}

	public setCommandHandler(handler: (ctx: InteractionContext) => any): HandlerManager {
		this.commandHandler = handler;

		return this;
	}

	public setComponentHandler(handler: (interaction: MessageComponentInteraction) => any): HandlerManager {
		this.componentHandler = handler;

		return this;
	}
}