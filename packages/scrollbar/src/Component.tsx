import React, { useRef, useEffect, forwardRef, MouseEvent, ReactNode } from 'react';
import mergeRefs from 'react-merge-refs';
import cn from 'classnames';
import PerfectScrollbar from 'perfect-scrollbar';

import styles from './index.module.css';

export type ScrollbarProps = {
    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;

    /**
     * Контент
     */
    children?: ReactNode;

    /**
     * Обработчик скрола
     */
    onScroll?: (event: MouseEvent<HTMLDivElement>) => void;
};

export const Scrollbar = forwardRef<HTMLDivElement, ScrollbarProps>(
    ({ className, dataTestId, children, onScroll, ...restProps }, ref) => {
        const containerRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            let ps: PerfectScrollbar;

            if (containerRef.current) {
                ps = new PerfectScrollbar(containerRef.current, {});
            }

            return () => {
                if (ps) ps.destroy();
            };
        }, []);

        return (
            <div
                ref={mergeRefs([ref, containerRef])}
                className={cn(className, styles.component)}
                onScroll={onScroll}
                data-test-id={dataTestId}
                {...restProps}
            >
                {children}
            </div>
        );
    },
);
