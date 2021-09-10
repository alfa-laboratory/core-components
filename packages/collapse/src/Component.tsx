import React, { forwardRef, useCallback, useRef, useState, useMemo, CSSProperties } from 'react';
import cn from 'classnames';
import { ArrowDownMBlackIcon } from '@alfalab/icons-classic/ArrowDownMBlackIcon';
import { ArrowUpMBlackIcon } from '@alfalab/icons-classic/ArrowUpMBlackIcon';
import { Link } from '@alfalab/core-components-link';
import { CSSTransition } from 'react-transition-group';
import { CSSTransitionClassNames } from 'react-transition-group/CSSTransition';

import styles from './index.module.css';

export type CollapseProps = {
    /**
     * Состояние компонента
     *
     */
    expanded?: boolean;

    /**
     * Текст ссылки в `collapsed` состоянии
     *
     */
    collapsedLabel?: string;

    /**
     * Текст ссылки в `expanded` состоянии
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

    /**
     * Классы анимации
     *
     * http://reactcommunity.org/react-transition-group/css-transition#CSSTransition-prop-classNames
     */
    transitionClassNames?: string | CSSTransitionClassNames;

    /** Обработчик события начала анимации */
    onAnimationStart?: () => void;

    /** Обработчик события завершения анимации */
    onAnimationEnd?: () => void;
};

export const Collapse = forwardRef<HTMLDivElement, CollapseProps>(
    (
        {
            expanded,
            collapsedLabel,
            expandedLabel,
            children,
            className,
            id,
            onExpandedChange,
            dataTestId,
            transitionClassNames = styles,
            onAnimationStart,
            onAnimationEnd,
        },
        ref,
    ) => {
        const uncontrolled = expanded === undefined;

        const contentRef = useRef<HTMLDivElement>(null);
        const contentCaseRef = useRef<HTMLDivElement>(null);

        const [expandedState, setExpandedState] = useState(expanded);

        const isExpanded = uncontrolled ? expandedState : expanded;

        const contentHeight = useMemo(
            () => (isExpanded ? contentCaseRef?.current?.offsetHeight : 0),
            [isExpanded],
        );

        const recalculate = useCallback(() => {
            if (!contentCaseRef.current || !contentRef.current) {
                return;
            }
            contentRef.current.style.height = `${contentHeight}px`;
        }, [contentHeight]);

        function onTransitionStart() {
            if (onAnimationStart) {
                onAnimationStart();
            }
            recalculate();
        }

        function onTransitionEnd() {
            if (onAnimationEnd) {
                onAnimationEnd();
            }
            recalculate();
        }

        const contentClassName = cn(styles.content, {
            [styles.collapsed]: !isExpanded,
        });

        const labelClassName = isExpanded ? styles.expandedLabel : '';

        const ToggledIcon = isExpanded ? ArrowUpMBlackIcon : ArrowDownMBlackIcon;

        const handleExpandedChange = useCallback(() => {
            if (uncontrolled) {
                setExpandedState(!isExpanded);
            }

            if (onExpandedChange) onExpandedChange();
        }, [isExpanded, onExpandedChange, uncontrolled]);

        const handleTransitionEnd = useCallback(() => {
            if (contentRef.current) {
                if (contentRef.current.offsetHeight > 0) {
                    contentRef.current.style.height = 'auto';
                }
            }
        }, []);


        const contentStyles: CSSProperties = useMemo(() => {
            const contentHeight = contentRef.current?.offsetHeight;

            return {
                height: isExpanded && !contentHeight ? '0px' : `${contentHeight}px`,
            };
        }, [isExpanded]);

        return (
            <div
                ref={ref}
                className={cn(className, styles.collapse)}
                id={id}
                data-test-id={dataTestId}
            >
                <CSSTransition
                    in={isExpanded}
                    onEntering={onTransitionStart}
                    onEntered={onTransitionEnd}
                    onExiting={onTransitionStart}
                    onExited={onTransitionEnd}
                    timeout={300}
                    classNames={transitionClassNames}
                >
                    <div ref={contentRef}
                         className={contentClassName}
                         onTransitionEnd={handleTransitionEnd}
                         style={contentStyles}
                    >
                        <div
                            ref={contentCaseRef}
                            className={styles.contentCase}
                        >
                            {children}
                        </div>
                    </div>
                </CSSTransition>
                {(expandedLabel || collapsedLabel) && (
                    <Link
                        className={labelClassName}
                        pseudo={true}
                        onClick={handleExpandedChange}
                        rightAddons={<ToggledIcon />}
                    >
                        {isExpanded ? expandedLabel : collapsedLabel}
                    </Link>
                )}
            </div>
        );
    },
);
