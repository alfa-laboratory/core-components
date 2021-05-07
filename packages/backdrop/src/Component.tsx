import React, { MouseEvent } from 'react';
import cn from 'classnames';
import { TransitionProps } from 'react-transition-group/Transition';
import { CSSTransition } from 'react-transition-group';

import { CSSTransitionClassNames } from 'react-transition-group/CSSTransition';
import styles from './index.module.css';

export type BackdropProps = Partial<TransitionProps> & {
    /**
     * Прозрачный бэкдроп
     */
    invisible?: boolean;

    /**
     * Управляет видимостью компонента
     */
    open: boolean;

    /**
     * Обработчик клика по бэкдропу
     */
    onClose?: (event: MouseEvent<HTMLElement>) => void;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Классы анимации
     *
     * http://reactcommunity.org/react-transition-group/css-transition#CSSTransition-prop-classNames
     */
    transitionClassNames?: string | CSSTransitionClassNames;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;

    /**
     * Прозрачность бэкдропа
     */
    opacity?: number;
};

export const Backdrop: React.FC<BackdropProps> = ({
    className,
    open = false,
    invisible = false,
    timeout = 200,
    children,
    onClose,
    dataTestId,
    transitionClassNames = styles,
    opacity = 1,
    ...restProps
}) => {
    return (
        <CSSTransition
            timeout={timeout}
            unmountOnExit={true}
            classNames={transitionClassNames}
            in={open}
            appear={true}
            {...restProps}
        >
            <div
                aria-hidden={true}
                onClick={onClose}
                data-test-id={dataTestId}
                className={cn(styles.backdrop, className, {
                    [styles.invisible]: invisible,
                })}
                style={{ opacity }}
            >
                {children}
            </div>
        </CSSTransition>
    );
};
