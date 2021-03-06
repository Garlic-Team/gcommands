import type { Guild } from 'discord.js';
import type { AttachmentType } from './Attachment';
import type { BooleanType } from './Boolean';
import type { ChannelType } from './Channel';
import type { IntegerType } from './Integer';
import type { MentionableType } from './Mentionable';
import type { NumberType } from './Number';
import type { RoleType } from './Role';
import type { StringType } from './String';
import type { UserType } from './User';
import { Util } from '../../util/Util';
import { Argument, ArgumentType } from '../Argument';

export type MessageArgumentTypes =
	| BooleanType
	| ChannelType
	| IntegerType
	| MentionableType
	| NumberType
	| RoleType
	| StringType
	| UserType
	| AttachmentType;

export class MessageArgumentTypeBase {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	validate(content: string): boolean {
		Util.throwError(
			'Validate method is not implemented!',
			this.constructor.name,
		);
		return true;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	resolve(argument: Argument) {
		Util.throwError(
			'Resolve method is not implemented!',
			this.constructor.name,
		);
	}

	static async createArgument(
		type: ArgumentType | keyof typeof ArgumentType,
		guild: Guild,
	) {
		switch (type) {
			case ArgumentType.BOOLEAN: {
				const { BooleanType } = await import('./Boolean');
				return new BooleanType();
			}
			case ArgumentType.CHANNEL: {
				const { ChannelType } = await import('./Channel');
				return new ChannelType(guild);
			}
			case ArgumentType.INTEGER: {
				const { IntegerType } = await import('./Integer');
				return new IntegerType();
			}
			case ArgumentType.MENTIONABLE: {
				const { MentionableType } = await import('./Mentionable');
				return new MentionableType(guild);
			}
			case ArgumentType.NUMBER: {
				const { NumberType } = await import('./Number');
				return new NumberType();
			}
			case ArgumentType.ROLE: {
				const { RoleType } = await import('./Role');
				return new RoleType(guild);
			}
			case ArgumentType.STRING: {
				const { StringType } = await import('./String');
				return new StringType();
			}
			case ArgumentType.USER: {
				const { UserType } = await import('./User');
				return new UserType(guild);
			}
			case ArgumentType.ATTACHMENT: {
				const { AttachmentType } = await import('./Attachment');
				return new AttachmentType();
			}
		}
	}
}
