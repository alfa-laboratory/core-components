/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const child_process = require('child_process');
const { promisify } = require('util');

const exec = promisify(child_process.exec);
const readFile = promisify(fs.readFile);

// Ищет используемые и неиспользуемые производные цвета
(async () => {
    const colors = await importColors([
        './packages/vars/src/colors-indigo.css',
        './packages/vars/src/colors-addons.css',
    ]);

    const usages = [];
    const unused = [];

    const job = color =>
        findUsages(color).then(colorUsages => {
            console.log(`${color} usages: `);

            if (colorUsages.length) {
                usages.push(color);

                console.log(colorUsages);
            } else {
                unused.push(color);
            }

            console.log('------');
        });

    for (const colorsChunk of chunkArray(colors, 20)) {
        await Promise.all(colorsChunk.map(color => job(color)));
    }

    console.log({ usages, unused });
})();

async function importColors(files) {
    const result = [];

    for (const path of files) {
        const cssContent = await readFile(path, 'utf-8');

        const colors = [...cssContent.match(/--(.|\n)*?;/gm)]
            .map(line => line.split(':')[0].trim())
            .filter(color => /-(alpha|tint|shade)-/.test(color) && /-(light|static)-/.test(color));

        result.push(...colors);
    }

    return result;
}

async function findUsages(color) {
    try {
        const { stdout } = await exec(`grep -r './packages' -e 'var(${color})'`);

        const usages = stdout
            .trim()
            .split('\n')
            .filter(usage => {
                const [fileName] = usage.split(':').map(s => s.trim());

                return fileName.includes('/themes/colors') === false;
            });

        return usages;
    } catch (e) {
        return [];
    }
}

function chunkArray(arr, size) {
    const chunks = [];

    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }

    return chunks;
}
