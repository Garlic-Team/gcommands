import { Message } from 'discord.js';
import { CommandArgsOption } from '../typings/interfaces';
import { GCommandsClient } from '../base/GCommandsClient';
import { Command } from './Command';
import { LanguageType } from '../util/Constants';
import { Argument } from './Argument';

interface Arg extends CommandArgsOption { subcommands?: Array<CommandArgsOption> }
type resolvedOptions = Array<Record<string, resolvedOptions>>;

export class ArgumentsCollector {
    private client: GCommandsClient;
    private message: Message;
    private language: LanguageType;
    private args: Array<string>;
    private command: Command;
    private cmdArgs: Array<Arg>;
    private isNotDm: boolean;
    public options: resolvedOptions;

    public constructor(client: GCommandsClient, options: { message: Message, language: LanguageType, args: Array<string>, command: Command, isNotDm: boolean}) {
        this.client = client;
        this.message = options.message;
        this.language = options.language;
        this.args = options.args;
        this.command = options.command;
        this.cmdArgs = JSON.parse(JSON.stringify(options.command.args));
        this.isNotDm = options.isNotDm;

        this.options = [];
    }
    public async get() {
        for (const arg of this.cmdArgs) {
            if ([1, 2].includes(arg.type)) arg.subcommands = this.cmdArgs.filter(sc => [1, 2].includes(sc.type));
            const argument = new Argument(this.client, arg, { isNotDm: this.isNotDm, language: this.language });
            let result;
            if (this.args[0]) {
                const invalid = argument.argument.validate(argument, { content: this.args[0], guild: this.message.guild }, this.language);
                if (invalid) {
                    result = await argument.collect(this.message, String(invalid));
                } else {
                    result = argument.argument.get();
                }
            } else {
                result = await argument.collect(this.message, arg.prompt);
            }
            if (result === 'cancel') return false;
            if (result === 'timelimit' && argument.required) {
                this.message.reply(this.client.languageFile.ARGS_TIME_LIMIT[this.language]);
                return false;
            } else if (result === 'timelimit') { continue; }
            if (result === 'skip') continue;

            if (this.args[0]) this.args.shift();

            if (typeof result === 'object') {
                this.addArgument({
                    name: result.name,
                    type: argument.type,
                });
                this.cmdArgs = result.options ?? [];
                return this.get();
            } else {
                this.addArgument(argument.argument.resolve({
                    name: argument.name,
                    type: argument.type,
                    value: result,
                }));
            }
        }
    }
    private addArgument(argument) {
        if (['SUB_COMMAND', 'SUB_COMMAND_GROUP'].includes(String(this.options[0]?.type))) {
            if (!Array.isArray(this.options[0].options)) this.options[0].options = [];
            if (['SUB_COMMAND', 'SUB_COMMAND_GROUP'].includes(String(this.options[0].options[0]?.type))) {
                if (!Array.isArray(this.options[0].options[0].options)) this.options[0].options[0].options = [];
                return this.options[0].options[0].options.push(argument);
            }
            return this.options[0].options.push(argument);
        }
        return this.options.push(argument);
    }
}
