export function splitFilename(filename: string) {
    const dotPosition = filename.lastIndexOf('.');
    const head = filename.slice(0, dotPosition);

    let tail = '';

    if (dotPosition > 3) {
        tail = filename.slice(dotPosition - 3);
    }

    return [head, tail];
}
