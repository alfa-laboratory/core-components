type SizePathsMap = {
    [size: number]: {
        top: string;
        bottom: string;
        topBottom: string;
        none: string;
    };
};

type GetPathParams = {
    size: number;
    hasTopAddons: boolean;
    hasBottomAddons: boolean;
    pathsMap: SizePathsMap;
};

export type PathsMap = {
    shape: SizePathsMap;
    border: SizePathsMap;
};

export const getPath = ({
    size,
    hasTopAddons,
    hasBottomAddons,
    pathsMap,
}: GetPathParams): string => {
    if (hasBottomAddons && hasTopAddons) {
        return pathsMap[size].topBottom;
    }

    if (hasBottomAddons) {
        return pathsMap[size].bottom;
    }

    if (hasTopAddons) {
        return pathsMap[size].top;
    }

    return pathsMap[size].none;
};
