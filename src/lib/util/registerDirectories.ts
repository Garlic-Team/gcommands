import {directoryLoader} from '../loaders/DirectoryLoader';

export async function registerDirectories(dirs: Array<string>) {
	for (const dir of dirs) {
		await directoryLoader(dir);
	}
}
