import { MessageArgumentTypeBase } from './base';

export class AttachmentType extends MessageArgumentTypeBase {
	validate() {
		return true;
	}
}