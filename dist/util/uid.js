"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uid = void 0;
function uid() {
    const head = Date.now().toString(36);
    const tail = Math.random().toString(36).substring(2);
    return head + tail;
}
exports.uid = uid;
