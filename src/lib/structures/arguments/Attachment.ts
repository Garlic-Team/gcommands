import { Attachment } from 'discord.js';
import { MessageArgumentTypeBase } from './base';
import { Argument, ArgumentType } from '../Argument';

export class AttachmentType extends MessageArgumentTypeBase {
	value;

	validate(attachment: string |  Attachment) {
		if (attachment instanceof Attachment) {
			this.value = attachment;
			return true;
		}

		return false;
	}

	resolve(argument: Argument) {
		return {
			...argument.toJSON(),
			type: ArgumentType[argument.type],
			attachment: this.value,
		};
	}
}
