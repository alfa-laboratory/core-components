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
};

export type IInternalCellProps = {
    children: React.ReactElement;
    index: number;
};

// Компонент для внутреннего использования
export const TInternalCell = ({ children, index }: IInternalCellProps) => {
    const { columnsConfiguration, compactView } = useContext(TableContext);
    const column = columnsConfiguration[index];
    const width = column?.width;
    const textAlign = column?.textAlign;
    const hidden = column?.hidden || false;

    const { className, style, dataTestId, ...restProps } = children.props || {};

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

export const TCell = ({ children }: TCellProps) => <React.Fragment>{children}</React.Fragment>;
