"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberPermissions = void 0;
const Inhibitor_1 = require("./Inhibitor");
class MemberPermissions extends Inhibitor_1.Inhibitor {
    constructor(options) {
        super(options);
        this.permissions = options.permissions;
    }
    run(ctx) {
        if (!ctx.inGuild())
            return;
        if (!ctx.memberPermissions.has(this.permissions))
            return ctx.reply({
                content: this.resolveMessage(ctx) ||
                    `You need the following permissions to execute this command: ${this.permissions
                        .join(', ')
                        .replace(/_/g, ' ')
                        .toLowerCase()}`,
                ephemeral: this.ephemeral,
            });
        else
            return true;
    }
}
exports.MemberPermissions = MemberPermissions;
