import {
	InteractionDeferReplyOptions,
	InteractionReplyOptions,
	Message,
	MessageComponentInteraction,
	MessagePayload,
	WebhookEditMessageOptions
} from 'discord.js';
import {APIMessage} from 'discord-api-types/v9';
import {GClient} from '../GClient';
import {Component} from './Component';
import {BaseContext, BaseContextOptions} from './BaseContext';

export interface ComponentContextOptions extends BaseContextOptions {
	component: Component;
	componentName: string;
	arguments?: Array<string>;
	values?: Array<any>;
	customId: string;
	reply: (options: string | MessagePayload | InteractionReplyOptions) => Promise<Message | APIMessage | void>;
	editReply: (options: string | MessagePayload | WebhookEditMessageOptions) => Promise<Message | APIMessage>;
	deleteReply: () => Promise<void>;
	followUp: (options: string | MessagePayload | InteractionReplyOptions) => Promise<Message | APIMessage | void>;
	deferReply: (options?: InteractionDeferReplyOptions) => Promise<Message | APIMessage | void>;
}

export class ComponentContext extends BaseContext {
	public readonly interaction: MessageComponentInteraction;
	public readonly component: Component;
	public readonly componentName: string;
	public readonly arguments?: Array<string>;
	public readonly values?: Array<any>;
	public readonly customId: string;
	public reply: (options: string | MessagePayload | InteractionReplyOptions) => Promise<Message | APIMessage | void>;
	public editReply?: (options: string | MessagePayload | WebhookEditMessageOptions) => Promise<Message | APIMessage>;
	public deleteReply?: () => Promise<void>;
	public followUp: (options: string | MessagePayload | InteractionReplyOptions) => Promise<Message | APIMessage | void>;
	public deferReply?: (options?: InteractionDeferReplyOptions) => Promise<Message | APIMessage | void>;

	constructor(client: GClient, options: ComponentContextOptions) {
		super(client, options);
	}

	public static createWithInteraction(interaction: MessageComponentInteraction, component: Component, args: Array<string>): ComponentContext {
		let replied = false;
		return new this(interaction.client as GClient, {
			...(super.createBaseWithInteraction(interaction)),
			component: component,
			componentName: component.name,
			arguments: args,
			values: interaction.isSelectMenu() ? interaction.values : [],
			customId: interaction.customId,
			// @ts-expect-error Typings are broken LOL
			reply: async (options) => {
				if (!replied) return await interaction.reply(options);
				else {
					replied = true;
					return await interaction.editReply(options);
				}
			},
			editReply: interaction.editReply.bind(interaction),
			deleteReply: interaction.deleteReply.bind(interaction),
			followUp: interaction.followUp.bind(interaction),
			deferReply: (options) => {
				replied = true;
				return interaction.deferReply(options);
			},
		});
	}
}
