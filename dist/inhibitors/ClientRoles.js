"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientRoles = void 0;
const Inhibitor_1 = require("./Inhibitor");
class ClientRoles extends Inhibitor_1.Inhibitor {
    constructor(options) {
        super(options);
        this.requireAll = true;
        this.ids = options.ids;
        this.getIds = options.getIds;
        this.requireAll = options.requireAll;
    }
    run(ctx) {
        if (!ctx.inCachedGuild())
            return;
        const dynamicRoles = this.getIds?.(ctx);
        if (dynamicRoles)
            this.ids = dynamicRoles;
        if (!ctx.guild.me.roles.cache[this.requireAll ? 'hasAll' : 'hasAny'](...this.ids))
            return ctx.reply({
                content: this.resolveMessage(ctx) || 'You do not have the required roles to execute this command',
                ephemeral: this.ephemeral,
            });
        else
            return true;
    }
}
exports.ClientRoles = ClientRoles;
