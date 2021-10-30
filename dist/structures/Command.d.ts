import { Snowflake, PermissionResolvable, TextBasedChannelTypes } from 'discord.js';
import { GCommandsClient } from '../base/GCommandsClient';
import { CommandOptions } from '../typings/interfaces';
import { CommandType } from '../util/Constants';
export declare class Command {
    client: GCommandsClient;
    name: string;
    contextMenuName: string;
    description: string;
    type: Array<CommandType>;
    cooldown: string;
    args: Array<boolean>;
    alwaysObtain: boolean;
    clientRequiredPermissions?: Array<PermissionResolvable>;
    userRequiredPermissions?: Array<PermissionResolvable>;
    userRequiredRoles?: Array<Snowflake>;
    userOnly?: Array<Snowflake>;
    channelTypeOnly?: Array<TextBasedChannelTypes>;
    allowDm?: boolean;
    guildOnly?: Array<Snowflake>;
    nsfw?: boolean;
    aliases?: Array<string>;
    category?: string;
    usage?: string;
    private _path;
    constructor(client: GCommandsClient, options: CommandOptions);
    run(): void;
    reload(): Promise<boolean>;
}
