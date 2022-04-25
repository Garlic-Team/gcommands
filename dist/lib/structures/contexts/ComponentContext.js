"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentContext = void 0;
const Context_1 = require("./Context");
class ComponentContext extends Context_1.Context {
    constructor(client, options) {
        super(client, options);
        this.deferred = false;
        this.replied = false;
        this.interaction = options.interaction;
        this.component = options.component;
        this.componentName = options.component.name;
        this.customId = options.customId;
        this.arguments = options.arguments;
        this.values = options.values;
        this.deferReply = async (opt) => {
            const message = await options.deferReply(opt);
            this.deferred = true;
            return message;
        };
        this.deferUpdate = async (opt) => {
            const message = await options.deferUpdate(opt);
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
        this.type = options.type;
    }
    safeReply(options) {
        return this.deferred || this.replied ? this.editReply(options) : this.reply(options);
    }
}
exports.ComponentContext = ComponentContext;
