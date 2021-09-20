export type GalleryImage = {
    src: string;
    name?: string;
    previewSrc?: string;
    alt?: string;
    canDownload?: boolean;
};

export type ImageMeta = {
    width: number;
    height: number;
    broken?: boolean;
};
