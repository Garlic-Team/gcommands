import { MessageArgumentTypeBase } from './base';

export class MentionableType extends MessageArgumentTypeBase {
    validate() {
        return true;
    }
}