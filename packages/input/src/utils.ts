import { MouseEvent } from 'react';

export function isPaddingClick(element: HTMLElement, event: MouseEvent<HTMLElement>) {
    const style = getComputedStyle(element, null);

    const intValue = (property: string) => +style.getPropertyValue(property).replace('px', '');

    const pTop = intValue('padding-top');
    const pRight = intValue('padding-right');
    const pLeft = intValue('padding-left');
    const pBottom = intValue('padding-bottom');

    const width = element.offsetWidth;
    const height = element.offsetHeight;

    const x = event.nativeEvent.offsetX;
    const y = event.nativeEvent.offsetY;

    const clickedInside = x > pLeft && x < width - pRight && y > pTop && y < height - pBottom;

    return !clickedInside;
}
