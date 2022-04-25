"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDirectories = void 0;
const directoryLoader_1 = require("../loaders/directoryLoader");
async function registerDirectories(dirs) {
    for (const dir of dirs) {
        await (0, directoryLoader_1.directoryLoader)(dir);
    }
}
exports.registerDirectories = registerDirectories;
