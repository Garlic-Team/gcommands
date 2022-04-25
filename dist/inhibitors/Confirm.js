"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Confirm = void 0;
const Inhibitor_1 = require("./Inhibitor");
const confirm_1 = require("../util/confirm");
class Confirm extends Inhibitor_1.Inhibitor {
    constructor(options) {
        super();
        this.options = options;
    }
    async run(ctx) {
        return await (0, confirm_1.confirm)(ctx, this.options);
    }
}
exports.Confirm = Confirm;
