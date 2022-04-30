import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * The method that loads plugin files from a directory
 * @param basedir The base plugin directory
 * @param folder The plugin folder
 */
export async function loadPluginFolder(basedir: string, folder: fs.Dirent) {
	if (folder.isDirectory()) {
		if (fs.existsSync(path.join(basedir, folder.name, 'index.js'))) {
			await import(path.join(basedir, folder.name, 'index.js'));
		} else if (fs.existsSync(path.join(basedir, folder.name, 'register.js'))) {
			await import(path.join(basedir, folder.name, 'register.js'));
		} else if (
			fs.existsSync(path.join(basedir, folder.name, 'dist', 'index.js'))
		) {
			await import(path.join(basedir, folder.name, 'dist', 'index.js'));
		} else if (
			fs.existsSync(path.join(basedir, folder.name, 'dist', 'register.js'))
		) {
			await import(path.join(basedir, folder.name, 'dist', 'register.js'));
		}
	}
}

/**
 * The method that find all plugins in a directory
 * @param {string} basedir The directory to find plugins in
 */
export async function pluginFinder(basedir: string) {
	if (fs.existsSync(basedir)) {
		if (fs.existsSync(path.join(basedir, 'plugins'))) {
			for await (const folder of fs.readdirSync(path.join(basedir, 'plugins'), {
				withFileTypes: true,
			})) {
				await loadPluginFolder(path.join(basedir, 'plugins'), folder);
			}
		}

		if (fs.existsSync(path.join(basedir, 'src', 'plugins'))) {
			for await (const folder of fs.readdirSync(
				path.join(basedir, 'src', 'plugins'),
				{ withFileTypes: true },
			)) {
				await loadPluginFolder(path.join(basedir, 'src', 'plugins'), folder);
			}
		}

		if (fs.existsSync(path.join(basedir, 'node_modules'))) {
			for await (const folder of fs.readdirSync(
				path.join(basedir, 'node_modules'),
				{ withFileTypes: true },
			)) {
				if (!folder.name.includes('gcommands-plugin-')) continue;
				await loadPluginFolder(path.join(basedir, 'node_modules'), folder);
			}
		}

		if (fs.existsSync(path.join(basedir, 'node_modules', '@gcommands'))) {
			for await (const folder of fs.readdirSync(
				path.join(basedir, 'node_modules', '@gcommands'),
				{
					withFileTypes: true,
				},
			)) {
				if (!folder.name.includes('plugin-')) continue;
				await loadPluginFolder(
					path.join(basedir, 'node_modules', '@gcommands'),
					folder,
				);
			}
		}
	}
}
