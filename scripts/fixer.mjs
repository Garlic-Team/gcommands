import { writeFileSync, readFileSync } from 'fs';

const path = './dist/lib/loaders/directoryLoader.js';

let content = readFileSync(path, 'utf-8');

content = content
    .replace(
        'const file = await Promise.resolve().then(() => (0, tslib_1.__importStar)(require(path.join(dir, rawFileName))));',
        'const file = await Promise.resolve().then(async() => (0, tslib_1.__importStar)(await import(`file://${path.join(dir, rawFileName)}`)));'
    )

writeFileSync('./dist/lib/loaders/directoryLoader.js', content);