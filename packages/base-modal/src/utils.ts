import { getCoreComponentsStore, SavedStyle } from '@alfalab/core-components-global-store';

export function isScrolledToTop(target: HTMLElement) {
    return target.scrollTop <= 0;
}

export function isScrolledToBottom(target: HTMLElement) {
    return target.scrollHeight - target.offsetHeight <= target.scrollTop;
}

export function hasScrollbar(target: HTMLElement) {
    return target.scrollHeight > target.clientHeight;
}

const getScrollbarSize = () => {
    const scrollDiv = document.createElement('div');
    scrollDiv.style.width = '99px';
    scrollDiv.style.height = '99px';
    scrollDiv.style.position = 'absolute';
    scrollDiv.style.top = '-9999px';
    scrollDiv.style.overflow = 'scroll';

    document.body.appendChild(scrollDiv);
    const scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);

    return scrollbarSize;
};

const isOverflowing = (container: Element) => {
    if (document.body === container) {
        return window.innerWidth > document.documentElement.clientWidth;
    }

    return container.scrollHeight > container.clientHeight;
};

const getPaddingRight = (node: Element) => {
    return parseInt(window.getComputedStyle(node).paddingRight, 10) || 0;
};

export const restoreContainerStyles = (container: HTMLElement) => {
    const modalRestoreStyles = getCoreComponentsStore().getModalRestoreStyles();
    const index = modalRestoreStyles.findIndex(s => s.container === container);
    const existingStyles = modalRestoreStyles[index];

    if (!existingStyles) return;

    existingStyles.modals -= 1;

    if (existingStyles.modals <= 0) {
        modalRestoreStyles.splice(index, 1);

        existingStyles.styles.forEach(({ value, el, key }) => {
            if (value) {
                el.style.setProperty(key, value);
            } else {
                el.style.removeProperty(key);
            }
        });
    }
};

export const handleContainer = (container?: HTMLElement) => {
    if (!container) return;

    const modalRestoreStyles = getCoreComponentsStore().getModalRestoreStyles();

    const existingStyles = modalRestoreStyles.find(s => s.container === container);

    if (existingStyles) {
        existingStyles.modals += 1;
        return;
    }

    const containerStyles: SavedStyle[] = [];

    if (isOverflowing(container)) {
        // Вычисляет размер до применения `overflow hidden` для избежания скачков
        const scrollbarSize = getScrollbarSize();

        containerStyles.push({
            value: container.style.paddingRight,
            key: 'padding-right',
            el: container,
        });
        // Вычисляем стили, чтобы получить реальный `padding` c шириной сколлбара
        // eslint-disable-next-line no-param-reassign
        container.style.paddingRight = `${getPaddingRight(container) + scrollbarSize}px`;
    }

    const parent = container.parentElement;
    const scrollContainer =
        // TODO: заменить на optional chaining
        parent &&
        parent.nodeName === 'HTML' &&
        window.getComputedStyle(parent).overflowY === 'scroll'
            ? parent
            : container;

    // Блокируем скролл даже если отсутствует скроллбар
    if (scrollContainer.style.overflow !== 'hidden') {
        containerStyles.push({
            value: scrollContainer.style.overflow,
            key: 'overflow',
            el: scrollContainer,
        });
    }

    scrollContainer.style.overflow = 'hidden';

    modalRestoreStyles.push({
        container,
        modals: 1,
        styles: containerStyles,
    });
};
