import { getScrollbarSize, ownerDocument, ownerWindow, ariaHidden } from './utils';

export type ModalElement = {
    modalRef: HTMLElement | null;
    mountNode: HTMLElement | null;
};

type ContainerInfo = {
    modals: ModalElement[];
    container: Element;
    restore: { (): void } | null;
    hiddenSiblingNodes: Element[];
};

type RestoreStyle = {
    value: string;
    key: string;
    el: HTMLElement;
};

/**
 * Управляет состоянием модальных окон и контейнеров.
 * Взаимсвовано из MUI ModalManager
 */
export class ModalManager {
    modals: ModalElement[];

    containers: ContainerInfo[];

    constructor() {
        this.modals = [];
        this.containers = [];
    }

    add = (modal: ModalElement, container: Element) => {
        let modalIndex = this.modals.indexOf(modal);
        if (modalIndex !== -1) {
            return modalIndex;
        }

        modalIndex = this.modals.length;
        this.modals.push(modal);

        // Если добавляемое модальное окно уже в DOM
        if (modal.modalRef) {
            ariaHidden(modal.modalRef, false);
        }

        const hiddenSiblingNodes = this.getHiddenSiblings(container);
        this.ariaHiddenSiblings(
            container,
            modal.mountNode,
            modal.modalRef,
            hiddenSiblingNodes,
            true,
        );

        const containerIndex = this.containers.findIndex(item => item.container === container);
        if (containerIndex !== -1) {
            this.containers[containerIndex].modals.push(modal);
            return modalIndex;
        }

        this.containers.push({
            modals: [modal],
            container,
            restore: null,
            hiddenSiblingNodes,
        });

        return modalIndex;
    };

    mount = (modal: ModalElement) => {
        const containerIndex = this.containers.findIndex(item => item.modals.indexOf(modal) !== -1);
        const containerInfo = this.containers[containerIndex];

        if (!containerInfo.restore) {
            containerInfo.restore = this.handleContainer(containerInfo);
        }
    };

    remove = (modal: ModalElement) => {
        const modalIndex = this.modals.indexOf(modal);

        if (modalIndex === -1) {
            return modalIndex;
        }

        const containerIndex = this.containers.findIndex(item => item.modals.indexOf(modal) !== -1);
        const containerInfo = this.containers[containerIndex];

        containerInfo.modals.splice(containerInfo.modals.indexOf(modal), 1);
        this.modals.splice(modalIndex, 1);

        // Для последнего окна очистим контейнер
        if (containerInfo.modals.length === 0) {
            // Модальное окно может быть закрыто до того как будем смонтировано в DOM.
            if (containerInfo.restore) {
                containerInfo.restore();
            }

            if (modal.modalRef) {
                // В случае если модальное окно ещё не было в DOM.
                ariaHidden(modal.modalRef, true);
            }

            this.ariaHiddenSiblings(
                containerInfo.container,
                modal.mountNode,
                modal.modalRef,
                containerInfo.hiddenSiblingNodes,
                false,
            );
            this.containers.splice(containerIndex, 1);
        } else {
            // Убедимся что следующее верхнее модальное окно видимо для скринридеров.
            const nextTop = containerInfo.modals[containerInfo.modals.length - 1];
            /*
             * Как только модальное окно добавляется его `modalRef = undefined`, поэтому
             * `aria-hidden` устанавливать нельзя, так как DOM элемента не существует.
             * То же самое при анмаунте окна до того, как modalRef станет null.
             */
            if (nextTop.modalRef) {
                ariaHidden(nextTop.modalRef, false);
            }
        }

        return modalIndex;
    };

    isTopModal = (modal: ModalElement) => {
        return this.modals.length > 0 && this.modals[this.modals.length - 1] === modal;
    };

    private isOverflowing = (container: Element) => {
        const doc = ownerDocument(container);

        if (doc.body === container) {
            return ownerWindow(doc).innerWidth > doc.documentElement.clientWidth;
        }

        return container.scrollHeight > container.clientHeight;
    };

    private getPaddingRight = (node: Element) => {
        return parseInt(window.getComputedStyle(node).paddingRight, 10) || 0;
    };

    private handleContainer = (containerInfo: ContainerInfo) => {
        const restoreStyle: RestoreStyle[] = [];
        const container = containerInfo.container as HTMLElement;

        if (this.isOverflowing(container)) {
            // Вычисляет размер до применения `overflow hidden` для избежания скачков
            const scrollbarSize = getScrollbarSize();

            restoreStyle.push({
                value: container.style.paddingRight,
                key: 'padding-right',
                el: container,
            });
            // Вычисляем стили, чтобы получить реальный `padding` c шириной сколлбара
            container.style.paddingRight = `${this.getPaddingRight(container) + scrollbarSize}px`;
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
        restoreStyle.push({
            value: scrollContainer.style.overflow,
            key: 'overflow',
            el: scrollContainer,
        });
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

    private ariaHiddenSiblings = (
        container: Element,
        mountNode: Element | null,
        currentNode: Element | null,
        nodesToExclude: Element[] = [],
        show: boolean,
    ) => {
        const blacklist = [mountNode, currentNode, ...nodesToExclude];
        const blacklistTagNames = ['TEMPLATE', 'SCRIPT', 'STYLE'];

        [].forEach.call(container.children, (node: Element) => {
            if (
                node.nodeType === 1 &&
                blacklist.indexOf(node) === -1 &&
                blacklistTagNames.indexOf(node.tagName) === -1
            ) {
                ariaHidden(node, show);
            }
        });
    };

    private getHiddenSiblings = (container: Element) => {
        const hiddenSiblings: Element[] = [];
        [].forEach.call(container.children, (node: Element) => {
            if (node.getAttribute && node.getAttribute('aria-hidden') === 'true') {
                hiddenSiblings.push(node);
            }
        });
        return hiddenSiblings;
    };
}
