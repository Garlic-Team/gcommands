"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserOnly = void 0;
const Inhibitor_1 = require("./Inhibitor");
class UserOnly extends Inhibitor_1.Inhibitor {
    constructor(options) {
        super(options);
        this.ids = options.ids;
        this.getIds = options.getIds;
    }
    run(ctx) {
        const dynamicUsers = this.getIds?.(ctx);
        if (dynamicUsers)
            this.ids = dynamicUsers;
        if (!this.ids.includes(ctx.userId))
            return ctx.reply({
                content: this.resolveMessage(ctx) || 'You can not use this command',
                ephemeral: this.ephemeral,
            });
        else
            return true;
    }
}
exports.UserOnly = UserOnly;
