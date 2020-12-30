import { RefObject, MutableRefObject } from 'react';

export const PORTAL_CONTAINER_ATTRIBUTE = 'alfa-portal-container';

function createPortalContainer() {
    const portalContainer = document.createElement('div');

    portalContainer.setAttribute(PORTAL_CONTAINER_ATTRIBUTE, '');

    document.body.appendChild(portalContainer);

    return portalContainer;
}

export const getDefaultPortalContainer = (): Element =>
    document.querySelector(`[${PORTAL_CONTAINER_ATTRIBUTE}]`) || createPortalContainer();

export function setRef<T>(
    ref: RefObject<T> | ((instance: T | null) => void) | null | undefined,
    value: T | null,
): void {
    if (typeof ref === 'function') {
        ref(value);
    } else if (ref) {
        // eslint-disable-next-line no-param-reassign
        (ref as MutableRefObject<T | null>).current = value;
    }
}
