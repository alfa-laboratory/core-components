import { promisify } from 'util';
import fs from 'fs';

export const readDir = promisify(fs.readdir);
export const mkDir = promisify(fs.mkdir);
export const readFile = promisify(fs.readFile);
export const writeFile = promisify(fs.writeFile);

export async function checkOrCreateDir(dir) {
    try {
        await readDir(dir, 'utf-8');
    } catch (error) {
        await mkDir(dir, { recursive: true });
    }
}

export const requireRegExp = new RegExp(
    /(\b(?:require\(|import |from )['"])@alfalab\/core-components-(.*?)(['"])/,
);
