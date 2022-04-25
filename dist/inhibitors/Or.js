"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Or = void 0;
const Inhibitor_1 = require("./Inhibitor");
class Or extends Inhibitor_1.Inhibitor {
    constructor(options) {
        super(options);
        this.inhibitors = options.inhibitors;
    }
    async run(ctx) {
        const results = [];
        for await (const inhibitor of this.inhibitors) {
            if (typeof inhibitor === 'function')
                results.push(!!(await inhibitor(ctx)));
            if (typeof inhibitor === 'object' && typeof inhibitor?.run === 'function')
                results.push(!!(await inhibitor.run(ctx)));
        }
        return results.includes(true);
    }
}
exports.Or = Or;
