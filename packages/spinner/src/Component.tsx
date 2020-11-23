import React, { FC } from 'react';
import cn from 'classnames';
import styles from './index.module.css';

export type SpinnerProps = {
    /**
     * Управление видимостью компонента
     */
    visible?: boolean;

    /**
     * Размер компонента
     */
    size?: 's' | 'm';

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Идентификатор компонента в DOM
     */
    id?: string;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export const Spinner: FC<SpinnerProps> = ({ size = 's', visible, id, className, dataTestId }) => {
    return (
        <span
            className={cn(className, styles.spinner, styles[size], {
                [styles.visible]: visible,
            })}
            id={id}
            data-test-id={dataTestId}
        />
    );
};
