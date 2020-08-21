export function truncateFilename(filename: string, maxFilenameLength?: number): string {
    if (maxFilenameLength && filename.length > maxFilenameLength) {
        const lengthOfPart = Math.round(maxFilenameLength / 2) - 1;

        return `${filename.substr(0, lengthOfPart)}…${filename.substr(
            filename.length - lengthOfPart,
        )}`;
    }

    return filename;
}
