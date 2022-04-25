"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandContext = void 0;
const Context_1 = require("./Context");
class CommandContext extends Context_1.Context {
    constructor(client, options) {
        super(client, options);
        this.deferred = false;
        this.replied = false;
        this.interaction = options.interaction;
        this.message = options.message;
        this.command = options.command;
        this.commandName = options.command.name;
        this.arguments = options.arguments;
        this.deferReply = async (opt) => {
            const message = await options.deferReply(opt);
            this.deferred = true;
            return message;
        };
        this.deleteReply = options.deleteReply;
        this.editReply = options.editReply;
        this.fetchReply = options.fetchReply;
        this.followUp = options.followUp;
        this.reply = async (opt) => {
            const message = await options.reply(opt);
            this.replied = true;
            return message;
        };
        this.type = 'COMMAND';
    }
    safeReply(options) {
        return this.deferred || this.replied ? this.editReply(options) : this.reply(options);
    }
}
exports.CommandContext = CommandContext;
