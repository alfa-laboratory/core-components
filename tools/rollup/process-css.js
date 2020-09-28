import globby from 'globby';
import { promisify } from 'util';
import fs from 'fs';
import postcss from 'postcss';
import path from 'path';

const postcssConfig = require(path.join(process.env.LERNA_ROOT_PATH, 'postcss.config'));

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readDir = promisify(fs.readdir);
const mkDir = promisify(fs.mkdir);

async function checkOrCreateDir(dir) {
    try {
        await readDir(dir, 'utf-8');
    } catch (error) {
        await mkDir(dir, { recursive: true });
    }
}

async function generateCssFile(source) {
    const content = await readFile(source, 'utf-8');

    const result = await postcss(postcssConfig.plugins).process(content, { from: source });

    const dest = path.resolve(source).replace('src', 'dist/cssm');

    await checkOrCreateDir(path.dirname(dest));

    await writeFile(dest, result.css);
}

export default function processCss() {
    return {
        name: 'process-css',
        buildEnd: async () => {
            const dist = path.resolve('dist/cssm');

            await checkOrCreateDir(dist);

            try {
                const matchedPaths = await globby('src/**/*.css');

                await Promise.all(matchedPaths.map(generateCssFile));
            } catch (error) {
                //
                console.log(error);
            }
        },
    };
}
