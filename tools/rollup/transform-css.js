import globby from 'globby';
import { promisify } from 'util';
import fs from 'fs';
import postcss from 'postcss';
import path from 'path';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readDir = promisify(fs.readdir);
const mkDir = promisify(fs.mkdir);

// TODO: брать из конфига
const plugins = [
    require('postcss-import')({}),
    require('postcss-mixins')({
        mixinsDir: path.resolve(__dirname, 'packages/vars/src'),
    }),
    require('postcss-preset-env')({
        stage: 3,
        features: {
            'nesting-rules': true,
            'color-mod-function': { unresolved: 'warn' },
        },
    }),
];

async function generateCssFile(source) {
    const content = await readFile(source, 'utf-8');

    const result = await postcss(plugins).process(content, { from: source });
    const dest = path.resolve(source).replace('src', 'dist/cssm');

    const dir = path.dirname(dest);

    try {
        await readDir(dir, 'utf-8');
    } catch (error) {
        await mkDir(dir, { recursive: true });
    }

    await writeFile(dest, result.css);
}

export default function transformCss() {
    return {
        name: 'transform-css',
        buildEnd: async () => {
            const dist = path.resolve('dist/cssm');

            try {
                await readDir(dist, 'utf-8');
            } catch (error) {
                await mkDir(dist, { recursive: true });
            }

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
