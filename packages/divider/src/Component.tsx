import React from 'react';
import cn from 'classnames';

import styles from './index.module.css';

export type DividerProps = {
    /**
     * Кастомный класс
     */
    className?: string;

    /**
     * Id компонента для тестов
     */
    dataTestId?: string;
};

export const Divider: React.FC<DividerProps> = ({ className, dataTestId }) => (
    <hr className={cn(styles.component, className)} data-test-id={dataTestId} />
);
