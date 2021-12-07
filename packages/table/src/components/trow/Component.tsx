import React, { HTMLAttributes } from 'react';
import cn from 'classnames';

import styles from './index.module.css';
import { TCell, TCellProps } from '../tcell';

export type TRowProps = HTMLAttributes<HTMLTableRowElement> & {
    /**
     * Компоненты ячеек
     */
    children: Array<React.ReactElement<TCellProps, typeof TCell>>;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Стиль выбранной строки
     */
    selected?: boolean;

    /**
     * Убирает нижнюю границу
     */
    withoutBorder?: boolean;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export const TRow = ({
    children,
    className,
    selected,
    withoutBorder,
    dataTestId,
    ...restProps
}: TRowProps) => (
    <tr
        className={cn(styles.component, className, {
            [styles.clickable]: typeof restProps.onClick !== 'undefined',
            [styles.selected]: selected,
            [styles.withoutBorder]: withoutBorder,
        })}
        data-test-id={dataTestId}
        {...restProps}
    >
        {React.Children.map(children, (child, index) => React.cloneElement(child, { index }))}
    </tr>
);
