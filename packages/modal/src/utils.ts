export function isScrolledToTop(target: HTMLElement) {
    return target.scrollTop === 0;
}

export function isScrolledToBottom(target: HTMLElement) {
    return target.scrollHeight - target.offsetHeight === target.scrollTop;
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

export const handleContainer = (container: HTMLElement) => {
    const restoreStyle: Array<{
        value: string;
        key: string;
        el: HTMLElement;
    }> = [];

    if (isOverflowing(container)) {
        // Вычисляет размер до применения `overflow hidden` для избежания скачков
        const scrollbarSize = getScrollbarSize();

        restoreStyle.push({
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
        restoreStyle.push({
            value: scrollContainer.style.overflow,
            key: 'overflow',
            el: scrollContainer,
        });
    }
    scrollContainer.style.overflow = 'hidden';

    return () => {
        restoreStyle.forEach(({ value, el, key }) => {
            if (value) {
                el.style.setProperty(key, value);
            } else {
                el.style.removeProperty(key);
            }
        });
    };
};
