import React from 'react';
import { findDOMNode } from 'react-dom';
import {
    TransitionProps,
    TransitionActions,
    EnterHandler,
    ExitHandler,
} from 'react-transition-group/Transition';

// TODO: перенести в alfalab/utils

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
} & Partial<Pick<TransitionProps<RefElement>, 'timeout'>> & Pick<TransitionActions, 'appear'>;

type Timeout = { enter?: number; exit?: number };

/**
 * passes {value} to {ref}
 *
 * WARNING: Be sure to only call this inside a callback that is passed as a ref.
 * Otherwise make sure to cleanup previous {ref} if it changes. See
 * https://github.com/mui-org/material-ui/issues/13539
 *
 * useful if you want to expose the ref of an inner component to the public api
 * while still using it inside the component
 *
 * @param ref a ref callback or ref object if anything falsy this is a no-op
 * @param value
 */
export function setRef<T>(
    ref: React.RefObject<T> | ((instance: T | null) => void) | null | undefined,
    value: T | null,
): void {
    if (typeof ref === 'function') {
        ref(value);
    } else if (ref) {
        // eslint-disable-next-line no-param-reassign
        (ref as React.MutableRefObject<T | null>).current = value;
    }
}

export function useForkRef<T>(refA: React.Ref<T>, refB: React.Ref<T>): React.Ref<T> {
    /**
     * This will create a new function if the ref props change and are defined.
     * This means react will call the old forkRef with `null` and the new forkRef
     * with the ref. Cleanup naturally emerges from this behavior
     */
    return React.useMemo(() => {
        if (refA == null && refB == null) {
            return null;
        }
        return (refValue) => {
            setRef(refA as React.MutableRefObject<T>, refValue);
            setRef(refB as React.MutableRefObject<T>, refValue);
        };
    }, [refA, refB]);
}

export function ownerDocument(node: Element | Document | null) {
    return (node && node.ownerDocument) || document;
}

export function ownerWindow(node: Element | Document) {
    const doc = ownerDocument(node);
    return doc.defaultView || window;
}

/**
 * Проверяет на основе свойства `show` наличие анимации
 */
export function getHasTransition(element: React.ReactNode) {
    return React.isValidElement(element)
        ? Object.hasOwnProperty.call(element.props, 'show')
        : false;
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
                // eslint-disable-next-line no-unused-expressions
                acc?.apply(this, args);
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
