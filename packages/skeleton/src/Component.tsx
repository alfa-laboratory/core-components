import React from 'react';
import cn from 'classnames';

import styles from './index.module.css';

export type SkeletonProps = {
    /**
     * Флаг, явно задающий состояние, при котором контент закрывается прелоадером
     */
    visible?: boolean;
    /**
     * Флаг явного включения анимации скелета
     */
    animate?: boolean;
    /**
     * Вариант анимации
     */
    animation?: 'gradient' | 'bg';
    /**
     * Дополнительный класс
     */
    className?: string;
    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export const Skeleton: React.FC<SkeletonProps> = ({
    visible,
    animate = true,
    animation = 'gradient',
    className,
    dataTestId,
    children,
}) => {
    if (visible) {
        return (
            <div
                className={cn(
                    styles.component,
                    { [styles.animate]: animate, [styles.animateBg]: animation === 'bg' },
                    className,
                )}
                data-test-id={dataTestId}
            >
                {children}
            </div>
        );
    }

    return <React.Fragment>{children}</React.Fragment>;
};
