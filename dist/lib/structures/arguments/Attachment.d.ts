import { MessageAttachment } from 'discord.js';
import { Argument, ArgumentType } from '../Argument';
import { MessageArgumentTypeBase } from './base';
export declare class AttachmentType extends MessageArgumentTypeBase {
    value: any;
    validate(attachment: string | MessageAttachment): boolean;
    resolve(argument: Argument): {
        type: string | ArgumentType;
        attachment: any;
    };
}
//# sourceMappingURL=Attachment.d.ts.map