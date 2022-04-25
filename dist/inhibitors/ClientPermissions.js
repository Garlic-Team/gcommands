"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientPermissions = void 0;
const Inhibitor_1 = require("./Inhibitor");
class ClientPermissions extends Inhibitor_1.Inhibitor {
    constructor(options) {
        super(options);
        this.permissions = options.permissions;
    }
    run(ctx) {
        if (!ctx.inGuild())
            return;
        if (!ctx.guild.me.permissions.has(this.permissions))
            return ctx.reply({
                content: this.resolveMessage(ctx) ||
                    `I need the following permissions to execute this command: ${this.permissions
                        .join(', ')
                        .replace(/_/g, ' ')
                        .toLowerCase()}`,
                ephemeral: this.ephemeral,
            });
        else
            return true;
    }
}
exports.ClientPermissions = ClientPermissions;
