import {Context} from './Context';
import {Command} from '../Command';

export class CommandContext extends Context {
	public readonly command: Command;
	public readonly commandName: string;
	public deferred = false;
	public replied = false;
}
