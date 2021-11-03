/* eslint-disable no-unused-vars */
import { Interaction, Message, User, GuildMember, MessagePayload, Guild, TextChannel } from 'discord.js';
import { Command, GCommandsClient, LanguageType } from '..';

export type BaseRunOptions = {
    interaction?: Interaction,
    message?: Message,
    author: User,
    member?: GuildMember,
    guild?: Guild,
    channel: TextChannel,
    respond(options: string | MessagePayload): Promise<Message>,
    followUp(options: string | MessagePayload): Promise<Message>,
    client: GCommandsClient,
    language: LanguageType,
}

export type CommandRunOptions = BaseRunOptions & {
    args: Record<string, unknown>,
    arrayArgs: Array<unknown>,
}

export type InhibitorRunOptions = BaseRunOptions & {
    command: Command,
}
