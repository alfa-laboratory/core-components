import { GalleryImage, ImageMeta } from '../types';

export const PLACEHOLDER_WIDTH = 400;
export const PLACEHOLDER_HEIGHT = 300;

export const getImageKey = ({ name = '', src }: GalleryImage, index: number): string =>
    `${name}-${index}-${src}`;

export const getImageAlt = ({ alt }: GalleryImage, index: number): string => {
    return alt || `Изображение ${index + 1}`;
};

export const isSmallImage = (meta?: ImageMeta) => {
    if (!meta) {
        return false;
    }

    return meta.width < PLACEHOLDER_WIDTH && meta.height < PLACEHOLDER_HEIGHT;
};
