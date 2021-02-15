const getElementSize = (element: HTMLElement, property: string): number =>
    +window
        .getComputedStyle(element)
        .getPropertyValue(property)
        .replace('px', '');

const getTagWidth = (tag: HTMLElement) => {
    const tagMarginLeft = getElementSize(tag, 'margin-left');
    const tagMarginRight = getElementSize(tag, 'margin-right');
    return tag.getBoundingClientRect().width + tagMarginRight + tagMarginLeft;
};

export const calculateTotalElementsPerRow = (
    container: HTMLDivElement,
    input?: HTMLInputElement | null,
): number => {
    let containerWidth = container.getBoundingClientRect().width;
    const containerPaddingLeft = getElementSize(container, 'padding-left');
    const containerPaddingRight = getElementSize(container, 'padding-right');
    containerWidth -= containerPaddingLeft + containerPaddingRight;

    if (input) {
        const inputMinWidth = getElementSize(input, 'min-width');
        const inputMarginLeft = getElementSize(input, 'margin-left');
        const inputMarginRight = getElementSize(input, 'margin-right');
        const minInputWidth = inputMarginLeft + inputMarginRight + inputMinWidth;
        containerWidth -= minInputWidth;
    }

    const tags = container.getElementsByTagName('button');
    const latestTag = tags[tags.length - 1];
    if (latestTag && latestTag.id === 'collapse') {
        containerWidth -= getTagWidth(latestTag);
    }
    let totalTagsWidth = 0;
    let totalVisibleElements = 0;
    for (let i = 0; i < tags.length; i++) {
        const tag = tags[i];
        if (tag.id === 'collapse') {
            break;
        }
        totalTagsWidth += getTagWidth(tag);
        if (totalTagsWidth < containerWidth) {
            totalVisibleElements += 1;
        }
    }
    return totalVisibleElements;
};
