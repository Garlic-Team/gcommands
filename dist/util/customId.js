"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customId = void 0;
const uid_1 = require("./uid");
function customId(name, ...args) {
    return `${name}${args[0] ? `-${args.join('-')}` : ''}-${(0, uid_1.uid)()}`;
}
exports.customId = customId;
