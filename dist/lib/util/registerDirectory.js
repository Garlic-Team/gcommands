"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDirectory = void 0;
const directoryLoader_1 = require("../loaders/directoryLoader");
async function registerDirectory(dir) {
    await (0, directoryLoader_1.directoryLoader)(dir);
}
exports.registerDirectory = registerDirectory;
