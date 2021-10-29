import { Collection, User } from 'discord.js';
import { GCommandsClient } from './GCommandsClient';
export declare class GCommandsDispatcher {
    private client;
    private inhibitors;
    private cooldowns;
    owners: Collection<string, User>;
    constructor(client: GCommandsClient);
    private fetchOwners;
}
