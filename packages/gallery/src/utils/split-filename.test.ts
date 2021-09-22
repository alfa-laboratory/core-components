import { splitFilename } from './split-filename';

describe('splitFilename', () => {
    it('should not split strings without extension', () => {
        const filename = 'extensionless';

        const [head, tail] = splitFilename(filename);

        expect(head).toBe(filename);
        expect(tail).toBe('');
    });

    it('should split correctly', () => {
        const filename = 'picture.png';

        const [head, tail] = splitFilename(filename);

        expect(head).toBe('pict');
        expect(tail).toBe('ure.png');
    });

    it('shoul not split short filename', () => {
        const filename = 'pic.png';

        const [head, tail] = splitFilename(filename);

        expect(head).toBe(filename);
        expect(tail).toBe('');
    });
});
