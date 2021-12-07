import React, { TdHTMLAttributes, useContext } from 'react';
import cn from 'classnames';

import { TableContext } from '../table-context';

import styles from './index.module.css';

export type TCellProps = TdHTMLAttributes<HTMLTableCellElement> & {
    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;

    /**
     * Устанавливается автоматически и позволяет использовать конфиг для соответствующего индекса
     */
    index?: number;
};

export const TCell = ({
    className,
    style,
    dataTestId,
    children,
    index,
    ...restProps
}: TCellProps) => {
    const { columnsConfiguration, compactView } = useContext(TableContext);
    const column = index === undefined ? null : columnsConfiguration[index];
    const width = column?.width;
    const textAlign = column?.textAlign;
    const hidden = column?.hidden || false;

    return (
        <td
            className={cn(
                styles.component,
                className,
                hidden && styles.hidden,
                compactView && styles.compact,
            )}
            style={{ ...style, width, textAlign }}
            data-test-id={dataTestId}
            {...restProps}
        >
            {children}
        </td>
    );
};
