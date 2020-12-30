import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { ArrowDownMBlackIcon } from '@alfalab/icons-classic/ArrowDownMBlackIcon';
import { ArrowUpMBlackIcon } from '@alfalab/icons-classic/ArrowUpMBlackIcon';
import { Link } from '@alfalab/core-components-link';
import debounce from 'lodash.debounce';
import styles from './index.module.css';

export type CollapseProps = {
    /**
     * Первоначальное состояние компонента
     *
     */
    expanded?: boolean;

    /**
     * Текст ссылки в `expanded` состоянии
     *
     */
    collapsedLabel?: string;

    /**
     * Текст ссылки в `collapsed` состоянии
     *
     */
    expandedLabel?: string;

    /**
     * Дочерние элементы `Collapse`
     */
    children?: React.ReactNode;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Идентификатор компонента в DOM
     */
    id?: string;

    /**
     * Обработчик смены состояний `expanded/collapsed`
     */
    onExpandedChange?: (expanded?: boolean) => void;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export const Collapse = forwardRef<HTMLDivElement, CollapseProps>((props: CollapseProps, ref) => {
    const {
        expanded,
        collapsedLabel,
        expandedLabel,
        children,
        className,
        id,
        onExpandedChange,
        dataTestId,
    } = props;

    const contentRef = useRef<HTMLDivElement>(null);
    const contentCaseRef = useRef<HTMLDivElement>(null);
    const [isExpanded, setIsExpanded] = useState(expanded);

    const recalculate = useCallback(() => {
        let contentHeight;

        if (!contentCaseRef.current || !contentRef.current) {
            return;
        }

        if (isExpanded) {
            contentHeight = contentCaseRef.current.offsetHeight;
        } else {
            contentHeight = 0;
        }

        contentRef.current.style.height = `${contentHeight}px`;
    }, [isExpanded]);

    useEffect(() => {
        const handleResize = debounce(() => recalculate(), 300);

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [recalculate]);

    useEffect(() => recalculate(), [isExpanded, recalculate]);

    const contentClassName = cn(styles.content, {
        [styles.expandedContent]: isExpanded,
    });

    const ToggledIcon = isExpanded ? ArrowUpMBlackIcon : ArrowDownMBlackIcon;

    const handleExpandedChange = useCallback(() => {
        setIsExpanded(!isExpanded);
        if (onExpandedChange) onExpandedChange();
    }, [isExpanded, onExpandedChange]);

    return (
        <div ref={ref} className={cn(className, styles.collapse)} id={id} data-test-id={dataTestId}>
            <div ref={contentRef} className={contentClassName}>
                <div ref={contentCaseRef}>{children}</div>
            </div>
            <Link pseudo={true} onClick={handleExpandedChange} rightAddons={<ToggledIcon />}>
                {isExpanded ? expandedLabel : collapsedLabel}
            </Link>
        </div>
    );
});
