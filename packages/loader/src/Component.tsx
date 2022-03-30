import React from 'react';
import cn from 'classnames';

import styles from './index.module.css';

export type LoaderProps = {
    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export const Loader: React.FC<LoaderProps> = ({ className, dataTestId }) => (
    <div className={cn(styles.component, className)} data-test-id={dataTestId}>
        <div />
        <div />
        <div />
    </div>
);
