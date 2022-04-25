"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nsfw = void 0;
const Inhibitor_1 = require("./Inhibitor");
class Nsfw extends Inhibitor_1.Inhibitor {
    run(ctx) {
        if (!ctx.inGuild() || ctx.channel.type !== 'GUILD_TEXT')
            return;
        if (!ctx.channel.nsfw)
            return ctx.reply({
                content: this.resolveMessage(ctx) || 'This command can only be used inside a nsfw channel',
                ephemeral: this.ephemeral,
            });
        else
            return true;
    }
}
exports.Nsfw = Nsfw;
