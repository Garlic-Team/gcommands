import { EventEmitter } from 'events';
import { Util } from '../util/Util';

export type ProviderTypes = 'mongodb' | 'keyv' | 'lrucache' | 'prismaio' | 'firestore' | string;

export interface ProviderEvents {
	connected: (client?: any) => void;
}

export declare interface Provider {
	on<U extends keyof ProviderEvents>(event: U, listener: ProviderEvents[U]): this;

	emit<U extends keyof ProviderEvents>(event: U, ...args: Parameters<ProviderEvents[U]>): boolean;

	client: any;
	init(): Promise<void> | void;
	insert(...args): Promise<any> | any;
	get(...args): Promise<any> | any;
	update(...args): Promise<any> | any;
	delete(...args): Promise<any> | any;
}

export class Provider extends EventEmitter {
	init() {
		Util.throwError('Init method is not implemented!', this.constructor.name);
		return;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	insert(...args) {
		Util.throwError('Insert method is not implemented!', this.constructor.name);
		return;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	get(...args) {
		Util.throwError('Get method is not implemented!', this.constructor.name);
		return;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	update(...args) {
		Util.throwError('Update method is not implemented!', this.constructor.name);
		return;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	delete(...args) {
		Util.throwError('Delete method is not implemented!', this.constructor.name);
		return;
	}
}
