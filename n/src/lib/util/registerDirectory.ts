import { directoryLoader } from '../loaders/directoryLoader';

export async function registerDirectory(dir: string) {
	await directoryLoader(dir);
}
