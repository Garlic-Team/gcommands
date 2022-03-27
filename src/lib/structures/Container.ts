import type { GClient } from '../GClient';

export interface Container {
	client: GClient;
}

export const container = {} as Container;
