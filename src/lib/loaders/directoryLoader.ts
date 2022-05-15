import * as fs from 'fs';
import * as path from 'path';
import { Util } from '../util/Util';

/**
 * The method that loads all files from a directory
 * @param {string} dir The directory to load
 * @returns {Promise<any[]>}
 */
export async function directoryLoader(dir: string): Promise<any[]> {
	let files = [];
	if (fs.existsSync(dir)) {
		for await (const fsDirent of fs.readdirSync(dir, { withFileTypes: true })) {
			const rawFileName = fsDirent.name;
			const fileType = path.extname(rawFileName);

			if (fsDirent.isDirectory()) {
				files = [
					...files,
					...(await directoryLoader(path.join(dir, rawFileName))),
				];
				continue;
			} else if (!['.js', '.mjs', '.ts', '.json'].includes(fileType)) {
				continue;
			}

			const file = await import(path.join(dir, rawFileName));
			if (file) files.push(Util.resolveFile(file, fileType));
		}

		return files;
	}
}
