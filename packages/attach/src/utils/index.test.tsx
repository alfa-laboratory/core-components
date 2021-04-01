import { truncateFilename, validateFilesMaxSize } from './index';

describe('truncateFilename util', () => {
    const filename = 'very_long_filename_secret_corporate_doc.doc';

    it('should return filename if maxFilenameLength not set', () => {
        const truncatedFilename = truncateFilename(filename);

        expect(truncatedFilename).toEqual(truncatedFilename);
    });

    it('should return filename if maxFilenameLength bigger than filename length', () => {
        const truncatedFilename = truncateFilename(filename, 99);

        expect(truncatedFilename).toEqual(truncatedFilename);
    });

    it('should return truncated filename if maxFilenameLength lower than filename length', () => {
        const truncatedFilename = truncateFilename(filename, 21);

        expect(truncatedFilename).toEqual('very_long_…te_doc.doc');
    });
});

describe('validateFilesMaxSize util', () => {
    const fileList: File[] = [
        new File([new ArrayBuffer(1900)], 'file1.jpg'),
        new File([new ArrayBuffer(1900)], 'file2.jpg'),
        new File([new ArrayBuffer(2000)], 'file3.jpg'),
    ];

    it('should return true when files dont have oversize file', () => {
        const isOkFilesSize = validateFilesMaxSize(fileList, 2001);

        expect(isOkFilesSize).toBeTruthy();
    });

    it('should return false when files have oversize file', () => {
        const isOkFilesSize = validateFilesMaxSize(fileList, 1901);

        expect(isOkFilesSize).toBeFalsy();
    });
});
