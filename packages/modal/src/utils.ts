import React from 'react';
import { findDOMNode } from 'react-dom';
import {
    TransitionProps,
    TransitionActions,
    EnterHandler,
    ExitHandler,
} from 'react-transition-group/Transition';

/**
 * Типы для свойств компонентов с анимацией
 */
export type ComponentTransitionsProps<RefElement extends undefined | HTMLElement = undefined> = {
    /** Таймауты задержек */
    delayTimeout?: number | Timeout;

    /**
     * Колбэк, выполнеяемый перед назначением статуса `entering`.
     * Дополнительный парметр `isAppearing` необходим для того, чтобы определить,
     * выполняется ли `enter`-фаза при первичном маунте компонента.
     */
    onEnter?: EnterHandler<RefElement>;

    /**
     * Колбэк, выполнеяемый перед назначением статуса `exiting`.
     */
    onExit?: ExitHandler<RefElement>;

    /**
     * Колбэк, выполнеяемый после назначения статуса `exited`.
     */
    onExited?: ExitHandler<RefElement>;
} & Partial<Pick<TransitionProps<RefElement>, 'timeout'>> &
    Pick<TransitionActions, 'appear'>;

type Timeout = { enter?: number; exit?: number };

export function ownerDocument(node: Element | Document | null) {
    return (node && node.ownerDocument) || document;
}

export function ownerWindow(node: Element | Document) {
    const doc = ownerDocument(node);
    return doc.defaultView || window;
}

export function getContainer(
    container?: React.ReactInstance | (() => React.ReactInstance | null) | null,
) {
    const containerNode = typeof container === 'function' ? container() : container;

    // eslint-disable-next-line react/no-find-dom-node
    return findDOMNode(containerNode) as Exclude<ReturnType<typeof findDOMNode>, Text>;
}

/**
 * Создаёт безопасный вызов цепочки функций
 *
 * @returns {function|null}
 * @param funcs
 */
export function createChainedFunction(
    ...funcs: Array<((...args: never[]) => void) | undefined | null>
) {
    return funcs.reduce(
        (acc, func) => {
            if (func == null) {
                return acc;
            }

            return function chainedFunction(this: unknown, ...args) {
                // TODO: заменить на optional chaining
                // eslint-disable-next-line no-unused-expressions
                acc && acc.apply(this, args);
                func.apply(this, args);
            };
        },
        () => undefined,
    ) as (...args: unknown[]) => never;
}

/*
 * A change of the browser zoom change the scrollbar size.
 */
export function getScrollbarSize() {
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
}

export function highlightSetter(
    refObject: React.MutableRefObject<boolean>,
    setter: React.Dispatch<React.SetStateAction<boolean>>,
) {
    return (highlight: boolean) => {
        // eslint-disable-next-line no-param-reassign
        refObject.current = highlight;
        setter(highlight);
    };
}

export function getIsScrolledFromTop(target: HTMLElement) {
    return target.scrollTop > 0;
}

export function getIsScrolledToBottom(target: HTMLElement) {
    return target.scrollHeight - target.offsetHeight === target.scrollTop;
}

export function ariaHidden(node: Element, show: boolean) {
    if (show) {
        node.setAttribute('aria-hidden', 'true');
    } else {
        node.removeAttribute('aria-hidden');
    }
}
