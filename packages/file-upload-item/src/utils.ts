import {
    DocumentImageMIcon,
    DocumentDocMIcon,
    DocumentPdfMIcon,
    DocumentTxtMIcon,
    DocumentUnknownMIcon,
} from '@alfalab/icons-glyph';

export function humanFileSize(size: string | number) {
    const units = ['B', 'KB', 'MB', 'GB'];

    let humanSize: string | number = Number(size);
    let factor = 0;

    while (humanSize >= 1024 && factor < units.length - 1) {
        humanSize /= 1024;
        factor += 1;
    }

    humanSize = humanSize.toFixed(2);

    return `${Number(humanSize)} ${units[factor]}`;
}

export const getExtension = (filename: string) =>
    filename
        .toLowerCase()
        .split('.')
        .pop();

export function fileIcon(filename: string) {
    const extension = getExtension(filename);

    switch (extension) {
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'svg':
        case 'tif':
        case 'tiff':
            return DocumentImageMIcon;
        case 'doc':
        case 'docx':
            return DocumentDocMIcon;
        case 'pdf':
            return DocumentPdfMIcon;
        case 'txt':
            return DocumentTxtMIcon;
        default:
            return DocumentUnknownMIcon;
    }
}
