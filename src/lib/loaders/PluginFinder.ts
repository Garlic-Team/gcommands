import * as fs from 'fs';
import * as path from 'path';

export async function LoadPluginFolder(basedir: string, folder: fs.Dirent) {
	if (folder.isDirectory()) {
		if (fs.existsSync(path.join(basedir, folder.name, 'index.js')) || fs.existsSync(path.join(basedir, folder.name, 'index.ts'))) {
			await import(path.join(basedir, folder.name, 'index'));
		} else if (fs.existsSync(path.join(basedir, folder.name, 'register.js')) || fs.existsSync(path.join(basedir, folder.name, 'register.ts'))) {
			await import(path.join(basedir, folder.name, 'register'));
		}
	}
}

export async function PluginFinder(basedir: string) {
	if (fs.existsSync(basedir)) {
		const pluginPath = path.join(basedir, 'plugins');
		if (fs.existsSync(pluginPath)) {
			for await(const folder of fs.readdirSync(pluginPath, {withFileTypes: true})) {
				await LoadPluginFolder(pluginPath, folder);
			}
		}

		const modulesPath = path.join(basedir, 'node_modules');
		if (fs.existsSync(modulesPath)) {
			for await(const folder of fs.readdirSync(modulesPath, {withFileTypes: true})) {
				if (!folder.name.includes('gcommands-plugin-')) continue;
				await LoadPluginFolder(modulesPath, folder);
			}
		}
	}
}
