"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.directoryLoader = void 0;
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
const path = tslib_1.__importStar(require("path"));
const Util_1 = require("../util/Util");
async function directoryLoader(dir) {
    let files = [];
    if (fs.existsSync(dir)) {
        for await (const fsDirent of fs.readdirSync(dir, { withFileTypes: true })) {
            const rawFileName = fsDirent.name;
            const fileType = path.extname(rawFileName);
            if (fsDirent.isDirectory()) {
                files = [...files, ...(await directoryLoader(path.join(dir, rawFileName)))];
                continue;
            }
            else if (!['.js', '.mjs', '.ts', '.json'].includes(fileType)) {
                continue;
            }
            const file = await Promise.resolve().then(async() => tslib_1.__importStar(await import(`file://${path.join(dir, rawFileName)}`)));
            if (file)
                files.push(Util_1.Util.resolveFile(file, fileType));
        }
        return files;
    }
}
exports.directoryLoader = directoryLoader;
