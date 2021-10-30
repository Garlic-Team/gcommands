import { GCommandsClient } from '../base/GCommandsClient';
export declare class GCommandLoader {
    private client;
    private clientId;
    private dir;
    private autoCategory;
    private loadFromCache;
    private defaultType;
    constructor(client: GCommandsClient);
    private load;
    private loadFiles;
}
