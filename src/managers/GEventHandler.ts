import { GCommandsClient } from '../base/GCommandsClient';
import { Color } from '../structures/Color';
import { Command } from '../structures/Command';
import { CommandType, InternalEvents } from '../util/Constants';
import Util from '../util/util';
import { ArgumentsCollector } from '../structures/ArgumentsCollector';
import { readdirSync } from 'fs';

export class GEventHandler {
    private client: GCommandsClient;

    constructor(client: GCommandsClient) {
        this.client = client;

        this.messageEvent();
    }

    private messageEvent() {
        this.client.on('messageCreate', message => handle(message));
        this.client.on('messageUpdate', (oldMessage, newMessage) => {
            if (oldMessage.content !== newMessage.content) handle(newMessage);
        });

        const handle = async message => {
            if (!message || !message.author || message.author.bot) return;

            const isNotDm = message.channel.type !== 'dm';
            const language = isNotDm ? await message.guild.getLanguage() : this.client.options.language;

            if (message.guild && !message.guild.available) {
                return message.reply({
                    content: this.client.languageFile.GUILD_UNAVAILABLE[language],
                });
            }

            const mention = message.content.split(' ')[0].match(new RegExp(`^<@!?(${this.client.user.id})>`));
            const prefix = mention ? mention[0] : (message.guild ? await message.guild.getCommandPrefix() : this.client.options.commands.prefix);

            const messageContainsPrefix = this.client.options.caseSensitivePrefixes ? message.content.startsWith(prefix) : message.content.toLowerCase().startsWith(prefix.toLowerCase());
            if (!messageContainsPrefix) return;

            const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);
            if (cmd.length === 0) return;

            let command: Command;
            try {
                command = this.client.dispatcher.getCommand(cmd);

                if (!command) return this.client.emit(InternalEvents.COMMAND_NOT_FOUND, new Color(`&d[GCommands] &cCommand not found (message): &e➜   &3${cmd ? cmd.name ? String(cmd.name) : String(cmd) : null}`).getText());

                // Const isDmEnabled = ['false'].includes(String(command.allowDm));
                // const isClientDmEnabled = !command.allowDm && ['false'].includes(String(this.client.options.commands.allowDm));

                // If (!isNotDm && isDmEnabled) return;
                // if (!isNotDm && isClientDmEnabled) return;
                if (command.type[0] && !command.type.includes(CommandType.MESSAGE)) return;
                if (!command.type[0] && !this.client.options.commands.defaultType.includes(CommandType.MESSAGE)) return;

                console.log('test');

                const inhibitorRunOptions = {
                    member: message.member,
                    author: message.author,
                    guild: message.guild,
                    channel: message.channel,
                    message: message,
                    client: this.client,
                    language: language,
                    command: command,

                    respond: (options = undefined) => message.reply(Util.resolveMessageOptions(options)),
                    followUp: (options = undefined) => message.reply(Util.resolveMessageOptions(options)),
                };

                const inhibitors = this.client.ginhibitors.filter(inhibitor => {
                    if (inhibitor.enableByDefault) return true;
                    else if (command.inhibitors.includes(inhibitor.name)) return true;
                    else return false;
                }).values();

                if (inhibitors[0]) {
                    for await (const inhibitor of inhibitors) {
                        try {
                            const response = await inhibitor.run(inhibitorRunOptions);
                            this.client.emit(InternalEvents.INHIBITOR_EXECUTE, { inhibitor: inhibitor, member: message.member, channel: message.channel, guild: message.guild });
                            if (!response) return;
                        } catch (err) {
                            this.client.emit(InternalEvents.INHIBITOR_ERROR, { inhibitor: inhibitor, member: message.member, channel: message.channel, guild: message.guild, error: err });
                            this.client.emit(InternalEvents.DEBUG, err);
                        }
                    }
                }

                const runOptions = {
                    member: message.member,
                    author: message.author,
                    guild: message.guild,
                    channel: message.channel,
                    message: message,
                    client: this.client,
                    bot: this.client,
                    language: language,

                    respond: (options = undefined) => message.reply(Util.resolveMessageOptions(options)),
                    followUp: (options = undefined) => message.reply(Util.resolveMessageOptions(options)),
                };

                let finalArgs;
                if (command.args && command.args[0]) {
                    const collector = new ArgumentsCollector(this.client, { message, args, language, isNotDm, command });
                    if (await collector.get() === false) return;

                    finalArgs = collector.options;
                }

                this.client.emit(InternalEvents.COMMAND_EXECUTE, { command: command, member: message.member, channel: message.channel, guild: message.guild });

                await command.run({
                    ...runOptions,
                    args: this.argsToObject(finalArgs) || {},
                    arrayArgs: this.argsToArray(finalArgs) || [],
                });
            } catch (e) {
                this.client.emit(InternalEvents.COMMAND_ERROR, { command: command, member: message.member, channel: message.channel, guild: message.guild, error: e });
                this.client.emit(InternalEvents.DEBUG, e);
            }
        };
    }

    private loadMoreEvents() {
        readdirSync(`${__dirname}/../base/actions/`).forEach(async fileName => {
            const file = await import(`../base/actions/${fileName}`);
            file.default(this.client);
        });
    }

    private argsToObject(options: object) {
        if (!Array.isArray(options)) return {};
        const args = {};

        for (const o of options) {
          if ([1, 2].includes(o.type)) {
            args[o.name] = this.argsToObject(o.options);
          } else {
            args[o.name] = o.value;
          }
        }

        return args;
    }

    private argsToArray(options: object) {
        const args = [];

        const check = option => {
          if (!option) return;
          if (option.value) args.push(option.value);
          else args.push(option.name);

          if (option.options) {
            for (let o = 0; o < option.options.length; o++) {
              check(option.options[o]);
            }
          }
        };

        if (Array.isArray(options)) {
          for (let o = 0; o < options.length; o++) {
            check(options[o]);
          }
        } else {
          check(options);
        }

        return args;
    }
}
