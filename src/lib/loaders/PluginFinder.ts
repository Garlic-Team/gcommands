import * as fs from 'fs';
import * as path from 'path';

export async function LoadPluginFolder(basedir: string, folder: fs.Dirent) {
	if (folder.isDirectory()) {
		if (fs.existsSync(path.join(basedir, folder.name, 'index.js'))) {
			await import(path.join(basedir, folder.name, 'index.js'));
		} else if (fs.existsSync(path.join(basedir, folder.name, 'index.ts'))) {
			await import(path.join(basedir, folder.name, 'index.ts'));
		} else if (fs.existsSync(path.join(basedir, folder.name, 'register.js'))) {
			await import(path.join(basedir, folder.name, 'register.js'));
		} else if (fs.existsSync(path.join(basedir, folder.name, 'register.ts'))) {
			await import(path.join(basedir, folder.name, 'register.ts'));
		}
	}
}

export async function PluginFinder(basedir: string) {
	if (fs.existsSync(basedir)) {
		if (fs.existsSync(path.join(basedir, 'plugins'))) {
			for await(const folder of fs.readdirSync(path.join(basedir, 'plugins'), {withFileTypes: true})) {
				await LoadPluginFolder(path.join(basedir, 'plugins'), folder);
			}
		}

		if (fs.existsSync(path.join(basedir, 'src', 'plugins'))) {
			for await(const folder of fs.readdirSync(path.join(basedir, 'src', 'plugins'), {withFileTypes: true})) {
				await LoadPluginFolder(path.join(basedir, 'src', 'plugins'), folder);
			}
		}

		if (fs.existsSync(path.join(basedir, 'node_modules'))) {
			for await(const folder of fs.readdirSync(path.join(basedir, 'node_modules'), {withFileTypes: true})) {
				if (!folder.name.includes('gcommands-plugin-')) continue;
				await LoadPluginFolder(path.join(basedir, 'node_modules'), folder);
			}
		}
	}
}
