import {directoryLoader} from '../loaders/DirectoryLoader';

export async function registerDirectory(dir: string) {
	await directoryLoader(dir);
}
