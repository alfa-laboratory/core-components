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
} & Partial<Pick<TransitionProps<RefElement>, 'timeout'>> &
    Pick<TransitionActions, 'appear'>;

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
