/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { Snowflake, PermissionResolvable } from 'discord.js';

import { GCommandsClient } from '../base/GCommandsClient';
import { CommandOptions, CommandArgsOption } from '../typings/interfaces';
import { CommandOptionsDefaults } from '../typings/defaults';
import { CommandType, ChannelType } from '../util/Constants';
import { CommandRunOptions } from '../typings/types';
import { GError } from './GError';

export class Command {
    readonly client: GCommandsClient;
    readonly name: string;
    readonly contextMenuName: string;
    readonly description: string;
    readonly type: CommandType[];
    readonly inhibitors: Array<string>;
    readonly cooldown: string;
    readonly args: Array<CommandArgsOption>;
    readonly alwaysObtain: boolean;
    readonly clientRequiredPermissions?: Array<PermissionResolvable>;
    readonly userRequiredPermissions?: Array<PermissionResolvable>;
    readonly userRequiredRoles?: Array<Snowflake>;
    readonly userOnly?: Array<Snowflake>;
    readonly channelTypeOnly?: Array<ChannelType>;
    readonly allowDm?: boolean;
    readonly guildOnly?: Array<Snowflake>;
    readonly nsfw?: boolean;
    readonly aliases?: Array<string>;
    readonly category?: string;
    readonly usage?: string;
    private path: string;

    public constructor(client: GCommandsClient, options: CommandOptions) {
        this.client = client;

        Object.assign(this, Object.assign(CommandOptionsDefaults, options));
    }

    public run(options: CommandRunOptions) {
        throw new GError('[COMMAND]',`Command ${this.name} doesn't provide a run method!`);
    }

    public async reload(): Promise<boolean> {
        const cmdPath = this.client.gcommands.get(this.name).path;

        delete require.cache[require.resolve(cmdPath)];
        this.client.gcommands.delete(this.name);

        let newCommand = await require(cmdPath);

        newCommand = new newCommand(this.client);

        newCommand._path = cmdPath;
        this.client.gcommands.set(newCommand.name, newCommand);
        return true;
    }
}
