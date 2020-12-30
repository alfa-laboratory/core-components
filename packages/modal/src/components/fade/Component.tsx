import React, { ReactNode, forwardRef } from 'react';
import Transition, { TransitionStatus } from 'react-transition-group/Transition';
import cn from 'classnames';
import mergeRefs from 'react-merge-refs';

import { ComponentTransitionsProps, createTimeout, createTransitionStyles, reflow } from './utils';

import styles from './index.module.css';

export type FadeProps = {
    /**
     * Управление видимостью элемента
     */
    show: boolean;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Управление поведением фокуса
     */
    tabIndex?: number;

    /**
     * Контент
     */
    children?: ReactNode;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
} & ComponentTransitionsProps;

/**
 * Заимствовано из [MUI](https://material-ui.com/)
 */
export const Fade = forwardRef<Element, FadeProps>((props, ref) => {
    const {
        appear = false,
        children,
        className,
        dataTestId,
        delayTimeout = 0,
        show,
        onEnter,
        onExit,
        onExited,
        timeout = 500,
        tabIndex,
    } = props;

    const nodeRef = React.useRef(null);
    // TODO: заменить на optional chaining
    const foreignRef = mergeRefs([
        (children && (children as { ref: React.Ref<typeof children> }).ref) || null,
        ref,
    ]);
    const handleRef = mergeRefs([nodeRef, foreignRef]);

    const handleEnter = (node: HTMLElement, isAppearing: boolean) => {
        const element = node;
        reflow(element); // Для гарантии воспроизведения анимации с ее начала.

        const { duration, delay } = createTransitionStyles({ timeout, delayTimeout }, 'enter');

        element.style.transitionDuration = duration;
        element.style.transitionDelay = delay;

        if (onEnter) {
            onEnter(element, isAppearing);
        }
    };

    const handleExit = (node: HTMLElement) => {
        const element = node;
        const { duration, delay } = createTransitionStyles({ timeout, delayTimeout }, 'exit');

        element.style.transitionDuration = duration;
        element.style.transitionDelay = delay;

        if (onExit) {
            onExit(element);
        }
    };

    const handleExited = (node: HTMLElement) => {
        if (onExited) {
            onExited(node);
        }
    };

    return (
        <Transition
            appear={appear}
            in={show}
            timeout={createTimeout({ timeout, delayTimeout })}
            onEnter={handleEnter}
            onExit={handleExit}
            onExited={handleExited}
        >
            {(status: TransitionStatus) => (
                <div
                    className={cn(
                        styles.fade,
                        { [styles.hidden]: status === 'exited' && !show },
                        styles[status],
                        className,
                    )}
                    data-test-id={dataTestId}
                    tabIndex={tabIndex}
                >
                    {React.isValidElement(children)
                        ? React.cloneElement(children, { ref: handleRef })
                        : children}
                </div>
            )}
        </Transition>
    );
});
