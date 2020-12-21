import React, { useCallback, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { ArrowDownSBlackIcon, ArrowUpSBlackIcon } from '@alfalab/icons-classic';
import { Link } from '@alfalab/core-components-link';
import debounce from 'lodash.debounce';
import styles from './index.module.css';

export type CollapseProps = {
    /**
     * Первоначальное состояние компонента
     *
     */
    isExpanded?: boolean;

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
    onExpandedChange?: (isExpanded?: boolean) => void;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    'data-test-id'?: string;
};

export const Collapse = (props: CollapseProps) => {
    const {
        isExpanded,
        collapsedLabel,
        expandedLabel,
        children,
        className,
        id,
        onExpandedChange,
        'data-test-id': dataTestId,
    } = props;

    const contentRef = useRef<HTMLDivElement>(null);
    const contentCaseRef = useRef<HTMLDivElement>(null);
    const [expanded, setExpanded] = useState(isExpanded);
    const isClient = typeof window === 'object';

    const recalculate = useCallback(() => {
        let contentHeight;

        if (!contentCaseRef.current || !contentRef.current) {
            return;
        }

        if (expanded) {
            contentHeight = contentCaseRef.current.offsetHeight;
        } else {
            contentHeight = 0;
        }

        contentRef.current.style.height = `${contentHeight}px`;
    }, [expanded]);

    useEffect(() => {
        if (!isClient) return;

        const handleResize = debounce(() => recalculate(), 300);
        window.addEventListener('resize', handleResize);

        // eslint-disable-next-line consistent-return
        return () => window.removeEventListener('resize', handleResize);
    }, [isClient, recalculate]);

    useEffect(() => recalculate(), [expanded, recalculate]);

    const contentClassName = cn(styles.content, {
        [styles.expandedContent]: expanded,
    });

    const ToggledIcon = expanded ? ArrowUpSBlackIcon : ArrowDownSBlackIcon;

    const handleExpandedChange = () => {
        setExpanded(!expanded);
        if (onExpandedChange) onExpandedChange();
    };

    return (
        <div className={`${className} ${styles.collapse}`} id={id} data-test-id={dataTestId}>
            <div ref={contentRef} className={contentClassName}>
                <div ref={contentCaseRef}>{children}</div>
            </div>
            <Link className={styles.link} pseudo={true} onClick={handleExpandedChange}>
                {expanded ? expandedLabel : collapsedLabel}
                <ToggledIcon className={styles.icon} />
            </Link>
        </div>
    );
};

export default Collapse;
