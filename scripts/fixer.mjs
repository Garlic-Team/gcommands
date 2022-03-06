import { writeFileSync, readFileSync, rmSync } from 'fs';

const path = './dist/lib/loaders/directoryLoader.js';

let content = readFileSync(path, 'utf-8');

content = content
    .replace(
        'const file = await Promise.resolve().then(() => tslib_1.__importStar(require(path.join(dir, rawFileName))));',
        'const file = await Promise.resolve().then(async() => tslib_1.__importStar(await import(`file://${path.join(dir, rawFileName)}`)));'
    )

writeFileSync('./dist/lib/loaders/directoryLoader.js', content);

rmSync('./tsconfig.tsbuildinfo');
