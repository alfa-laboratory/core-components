export type GalleryImage = {
    name: string;
    src: string;
    previewSrc?: string;
    alt?: string;
};

export type ImageMeta = {
    width: number;
    height: number;
    broken?: boolean;
};
