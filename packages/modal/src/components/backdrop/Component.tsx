import React, { MouseEvent } from 'react';
import cn from 'classnames';
import { TransitionProps } from 'react-transition-group/Transition';
import { CSSTransition } from 'react-transition-group';

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
     * Обработчик клика
     */
    onClick?: (event: MouseEvent<HTMLDivElement>) => void;
};

export const Backdrop: React.FC<BackdropProps> = ({
    open,
    invisible = false,
    timeout = 200,
    children,
    onClick,
    ...restProps
}) => (
    <CSSTransition timeout={timeout} classNames={styles} {...restProps} in={open} appear={true}>
        <div
            data-test-id='backdrop'
            aria-hidden={true}
            onClick={onClick}
            className={cn(styles.backdrop, {
                [styles.invisible]: invisible,
            })}
        />
    </CSSTransition>
);
