export const PORTAL_CONTAINER_ATTRIBUTE = 'alfa-portal-container';

function createPortalContainer() {
    const portalContainer = document.createElement('div');

    portalContainer.setAttribute(PORTAL_CONTAINER_ATTRIBUTE, '');

    document.body.appendChild(portalContainer);

    return portalContainer;
}

export const getDefaultPortalContainer = (): Element =>
    document.querySelector(`[${PORTAL_CONTAINER_ATTRIBUTE}]`) || createPortalContainer();
