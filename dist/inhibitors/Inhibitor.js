"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inhibitor = void 0;
class Inhibitor {
    constructor(options = {}) {
        this.ephemeral = true;
        this.message = options.message;
    }
    resolveMessage(ctx) {
        if (typeof this.message === 'function')
            return this.message(ctx);
        else if (typeof this.message === 'string')
            return this.message;
    }
}
exports.Inhibitor = Inhibitor;
