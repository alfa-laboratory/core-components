import React, { forwardRef, HTMLAttributes, useMemo } from 'react';
import cn from 'classnames';

import { isChildInstanceOf } from '../../utils';
import { Pagination } from '..';

import styles from './index.module.css';

type WrapperProps = HTMLAttributes<HTMLDivElement> & {
    /**
     * Дочерние компоненты. Таблица, пагинация и т.д
     */
    children: React.ReactElement[];

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export const Wrapper = forwardRef<HTMLDivElement, WrapperProps>(
    ({ children, className, dataTestId, ...restProps }, ref) => {
        const hasPagination = useMemo(() => {
            let isPagination = false;

            React.Children.forEach(children, child => {
                if (isChildInstanceOf(child, Pagination)) {
                    isPagination = true;
                }
            });

            return isPagination;
        }, [children]);

        return (
            <div
                className={cn(styles.component, className, {
                    [styles.hasPagination]: hasPagination,
                })}
                ref={ref}
                data-test-id={dataTestId}
                {...restProps}
            >
                {children}
            </div>
        );
    },
);
