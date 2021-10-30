import { Snowflake, PermissionResolvable, TextBasedChannelTypes } from 'discord.js';

import { GCommandsClient } from '../base/GCommandsClient';
import { CommandOptions } from '../typings/interfaces';
import { CommandOptionsDefaults } from '../typings/defaults';
import { CommandType } from '../util/Constants';
import { GError } from './GError';

export class Command {
    public client: GCommandsClient;
    public name: string;
    public contextMenuName: string;
    public description: string;
    public type: Array<CommandType>;
    public cooldown: string;
    public args: Array<boolean>;
    public alwaysObtain: boolean;
    public clientRequiredPermissions?: PermissionResolvable | Array<PermissionResolvable>;
    public userRequiredPermissions?: PermissionResolvable | Array<PermissionResolvable>;
    public userRequiredRoles?: Snowflake | Array<Snowflake>;
    public userOnly?: Snowflake | Array<Snowflake>;
    public channelTypeOnly?: TextBasedChannelTypes | Array<TextBasedChannelTypes>;
    public allowDm?: boolean;
    public guildOnly?: Snowflake | Array<Snowflake>;
    public nsfw?: boolean;
    public aliases?: Array<string>;
    public category?: string;
    public usage?: string;
    private _path: string;

    public constructor(client: GCommandsClient, options: CommandOptions) {
        options = Object.assign(CommandOptionsDefaults, options);

        this.client = client;
        this.name = options.name;
        this.contextMenuName = options.contextMenuName;
        this.description = options.description;
        this.type = options.type;
        this.cooldown = options.cooldown;
        this.args = options.args;
        this.alwaysObtain = options.alwaysObtain;
        this.clientRequiredPermissions = options.clientRequiredPermissions;
        this.userRequiredPermissions = options.userRequiredPermissions;
        this.userRequiredRoles = options.userRequiredRoles;
        this.userOnly = options.userOnly;
        this.channelTypeOnly = options.channelTypeOnly;
        this.allowDm = options.allowDm;
        this.guildOnly = options.guildOnly;
        this.nsfw = options.nsfw;
        this.aliases = options.aliases;
        this.category = options.category;
        this.usage = options.usage;
    }
    public run() {
        throw new GError('[COMMAND]',`Command ${this.name} doesn't provide a run method!`);
    }
    public async reload(): Promise<boolean> {
        const cmdPath = this.client.commands.get(this.name)._path;

        delete require.cache[require.resolve(cmdPath)];
        this.client.commands.delete(this.name);

        let newCommand = await require(cmdPath);

        newCommand = new newCommand(this.client);

        newCommand._path = cmdPath;
        this.client.commands.set(newCommand.name, newCommand);
        return true;
    }
}
