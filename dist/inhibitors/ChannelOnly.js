"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelOnly = void 0;
const Inhibitor_1 = require("./Inhibitor");
class ChannelOnly extends Inhibitor_1.Inhibitor {
    constructor(options) {
        super(options);
        this.ids = options.ids;
        this.getIds = options.getIds;
    }
    run(ctx) {
        const dynamicChannels = this.getIds?.(ctx);
        if (dynamicChannels)
            this.ids = dynamicChannels;
        if (!this.ids.includes(ctx.channelId))
            return ctx.reply({
                content: this.resolveMessage(ctx) || 'This command can not be used in this channel',
                ephemeral: this.ephemeral,
            });
        else
            return true;
    }
}
exports.ChannelOnly = ChannelOnly;
