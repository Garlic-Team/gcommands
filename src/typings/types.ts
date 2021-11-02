/* eslint-disable no-unused-vars */
import { Interaction, Message, User, GuildMember, MessagePayload, Guild, TextChannel } from 'discord.js';
import { Command, GCommandsClient, LanguageType } from '..';

export type CommandRunOptions = {
    interaction?: Interaction,
    message?: Message,
    author: User,
    member?: GuildMember,
    guild?: Guild,
    respond(options: string | MessagePayload): Promise<Message>,
    followUp(options: string | MessagePayload): Promise<Message>,
    args: Record<string, unknown>,
    arrayArgs: Array<unknown>,
    client: GCommandsClient,
    language: LanguageType,
}

export type InhibitorRunOptions = {
    interaction?: Interaction,
    message?: Message,
    author: User,
    member?: GuildMember,
    guild?: Guild,
    channel: TextChannel,
    respond(options: string | MessagePayload): Promise<Message>,
    followUp(options: string | MessagePayload): Promise<Message>,
    command: Command,
    client: GCommandsClient,
    language: LanguageType,
}
