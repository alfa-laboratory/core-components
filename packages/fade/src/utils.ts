import React from 'react';
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
type TransitionMode = 'enter' | 'exit';

function formatMs(milliseconds: number) {
    return `${Math.round(milliseconds)}ms`;
}

function convertTransitionProp(prop?: Timeout, mode: TransitionMode = 'enter') {
    return prop ? prop[mode] || 0 : 0;
}

function getTransitionProp(prop?: Timeout | number, mode?: TransitionMode) {
    return typeof prop === 'number' ? prop : convertTransitionProp(prop, mode);
}

function getFullTimeout(
    { timeout, delayTimeout }: ComponentTransitionsProps,
    mode: TransitionMode,
) {
    return getTransitionProp(timeout, mode) + getTransitionProp(delayTimeout, mode);
}

/**
 * Создаёт стили для анимации
 */
export const createTransitionStyles = (
    { timeout, delayTimeout }: ComponentTransitionsProps,
    mode: TransitionMode,
) => ({
    duration: formatMs(getTransitionProp(timeout, mode)),
    delay: formatMs(getTransitionProp(delayTimeout, mode)),
});

/**
 * Создаёт таймауты для Transition c учётом задержки
 */
export const createTimeout = (props: ComponentTransitionsProps) => {
    const { timeout } = props;
    const enter = getTransitionProp(timeout);

    return {
        appear: timeout === 'object' ? timeout.appear : enter,
        enter,
        exit: getFullTimeout(props, 'exit'),
    };
};

export const reflow = (node: HTMLElement) => node.scrollTop;

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
