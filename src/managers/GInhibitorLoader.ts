import { GCommandsClient } from '../base/GCommandsClient';
import { InternalEvents } from '../util/Constants';
import { Inhibitor } from '../structures/Inhibitor';
import { Color } from '../structures/Color';
import { GError } from '../structures/GError';
import * as fs from 'fs';
import * as path from 'path';
import Util from '../util/util';

export class GInhibitorLoader {
    private client: GCommandsClient;
    private dir: string;

    public constructor(client: GCommandsClient) {
        this.client = client;
        this.dir = this.client.options.loader.inhibitorDir;

        this.load();
    }
    private async load() {
        await this.loadFiles(path.join(__dirname, '../structures/Inhibitors'), true);
        if (this.dir) await this.loadFiles(this.dir, true);

        this.client.emit(InternalEvents.INHIBITORS_LOADED, this.client.ginhibitors);
    }
    private async loadFiles(dir: string, emit = false) {
        for await (const fsDirent of fs.readdirSync(dir, { withFileTypes: true })) {
            const rawFileName = fsDirent.name;
            const fileType = path.extname(rawFileName);
            const fileName = path.basename(rawFileName, fileType);

            if (fsDirent.isDirectory()) {
                await this.loadFiles(path.join(dir, rawFileName));
                continue;
            } else if (!['.js', '.ts'].includes(fileType)) { continue; }

            let file = await import(path.join(dir, rawFileName));
            if (file.default) file = file.default;
            else if (!file.name) file = Object.values(file)[0];

            if (Util.isClass(file)) {
                file = new file(this.client);
                if (!(file instanceof Inhibitor)) throw new GError('[INHIBITOR]', `Inhibitor ${fileName} doesnt belong in Inhibitors.`);
            }

            file.path = `${dir}/${fileName}${fileType}`;

            if (this.client.ginhibitors.has(file.name)) throw new GError('[INHIBITOR]', `Duplicate inhibitor found: ${file.name}`);
            this.client.ginhibitors.set(file.name, file);
            if (emit) this.client.emit(InternalEvents.LOG, new Color(`&d[GCommands] &aLoaded inhibitor (File): &e➜   &3${fileName}`).getText());
        }
    }
}
