import { MessageAttachment } from 'discord.js';
import { Argument, ArgumentType } from '../Argument';
import { MessageArgumentTypeBase } from './base';

export class AttachmentType extends MessageArgumentTypeBase {
	value;

	validate(attachment: string | MessageAttachment) {
		if (attachment instanceof MessageAttachment) {
			this.value = attachment;
			return true;
		}

		return false;
	}

	resolve(argument: Argument) {
		return {
			...argument.toJSON(),
			type: ArgumentType[argument.type],
			attachment: this.value
		};
	}
}