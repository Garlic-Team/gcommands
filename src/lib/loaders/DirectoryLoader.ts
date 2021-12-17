import * as fs from 'fs';
import * as path from 'path';
import {ResolveFile} from '../util/ResolveFile';

export async function DirectoryLoader(dir: string): Promise<Array<any>> {
	let files = [];
	if (fs.existsSync(dir)) {
		for await(const fsDirent of fs.readdirSync(dir, {withFileTypes: true})) {
			const rawFileName = fsDirent.name;
			const fileType = path.extname(rawFileName);

			if (fsDirent.isDirectory()) {
				files = [...files, ...await DirectoryLoader(path.join(dir, rawFileName))];
				continue;
			} else if (!['.js', '.ts', '.json'].includes(fileType)) {
				continue;
			}

			const file = await import(path.join(dir, rawFileName));
			if (file) files.push(ResolveFile(file, fileType));
		}

		return files;
	}
}
