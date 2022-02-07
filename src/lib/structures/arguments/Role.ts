import { MessageArgumentTypeBase } from './base';

export class RoleType extends MessageArgumentTypeBase {
    validate() {
        return true;
    }
}