"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CooldownHandler = void 0;
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const ms_1 = tslib_1.__importDefault(require("ms"));
// TODO exclude bot owners
function CooldownHandler(userId, item, collection) {
    if (!item.cooldown)
        return;
    if (!collection.has(item.name))
        collection.set(item.name, new discord_js_1.Collection());
    const users = collection.get(item.name);
    if (users.has(userId) && users.get(userId) > Date.now()) {
        return (0, ms_1.default)(users.get(userId) - Date.now());
    }
    else {
        users.set(userId, Date.now() + (0, ms_1.default)(item.cooldown));
    }
}
exports.CooldownHandler = CooldownHandler;
