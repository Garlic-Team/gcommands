import Logger from 'js-logger';
import {Util} from '../util/Util';

export interface ProviderInterface {
    init(): void;
    get(): Promise<any> | any;
    set(): Promise<any> | any;
    delete(): Promise<any> | any;
}

const throwError = (error, name) => {
	const trace = Util.resolveValidationErrorTrace([
		name
	]);

	Logger.error(error, trace);
};

export class Provider implements ProviderInterface {
	init() {
		throwError('Init method is not implemented!', this.constructor.name);
		return;
	}

	get() {
		throwError('Init method is not implemented!', this.constructor.name);
		return;
	}

	set() {
		throwError('Init method is not implemented!', this.constructor.name);
		return;
	}

	delete() {
		throwError('Init method is not implemented!', this.constructor.name);
		return;
	}
}