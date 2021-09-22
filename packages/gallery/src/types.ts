export type GalleryImage = {
    src: string;
    name?: string;
    previewSrc?: string;
    alt?: string;
};

export type ImageMeta = {
    width: number;
    height: number;
    broken?: boolean;
};
