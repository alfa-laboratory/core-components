import { truncateFilename } from './index';

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
