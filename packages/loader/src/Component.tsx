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
    <svg
        height='24'
        width='24'
        viewBox='0 0 24 24'
        className={cn(styles.component, className)}
        data-test-id={dataTestId}
    >
        <circle cx='4' cy='12' r='2' />
        <circle cx='12' cy='12' r='2' />
        <circle cx='20' cy='12' r='2' />
    </svg>
);
