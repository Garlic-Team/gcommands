import {DirectoryLoader} from '../loaders/DirectoryLoader';

export async function registerDirectory(dir: string) {
	await DirectoryLoader(dir);
}
