import { directoryLoader } from '../loaders/directoryLoader';

export async function registerDirectories(dirs: Array<string>) {
	for (const dir of dirs) {
		await directoryLoader(dir);
	}
}
