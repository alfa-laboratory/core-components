import React, {
    CSSProperties,
    forwardRef,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import cn from 'classnames';
import { ArrowDownMBlackIcon } from '@alfalab/icons-classic/ArrowDownMBlackIcon';
import { ArrowUpMBlackIcon } from '@alfalab/icons-classic/ArrowUpMBlackIcon';
import { Link } from '@alfalab/core-components-link';
import debounce from 'lodash.debounce';
import styles from './index.module.css';

export type CollapseProps = {
    /**
     * Состояние компонента
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
     * Обработчик события завершения анимации
     */
    onTransitionEnd?: () => void;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
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
            onTransitionEnd,
            onExpandedChange,
            dataTestId,
        },
        ref,
    ) => {
        const uncontrolled = expanded === undefined;

        const contentRef = useRef<HTMLDivElement>(null);
        const contentCaseRef = useRef<HTMLDivElement>(null);
        const [expandedState, setExpandedState] = useState(expanded);

        const isExpanded = uncontrolled ? expandedState : expanded;

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

        const handleTransitionEnd = useCallback(() => {
            if (contentRef.current) {
                if (contentRef.current.offsetHeight > 0) {
                    contentRef.current.style.height = 'auto';
                }
            }

            if (onTransitionEnd) onTransitionEnd();
        }, [onTransitionEnd]);

        const handleExpandedChange = useCallback(() => {
            if (uncontrolled) {
                setExpandedState(!isExpanded);
            }

            if (onExpandedChange) onExpandedChange();
        }, [isExpanded, onExpandedChange, uncontrolled]);

        useEffect(() => {
            const handleResize = debounce(() => recalculate(), 300);

            window.addEventListener('resize', handleResize);

            return () => window.removeEventListener('resize', handleResize);
        }, [recalculate]);

        useEffect(() => recalculate(), [isExpanded, recalculate]);

        const contentStyles: CSSProperties = useMemo(() => {
            const contentHeight = contentRef.current?.offsetHeight;

            return {
                height: isExpanded && !contentHeight ? '0px' : `${contentHeight}px`,
            };
        }, [isExpanded]);

        const ToggledIcon = isExpanded ? ArrowUpMBlackIcon : ArrowDownMBlackIcon;

        return (
            <div
                ref={ref}
                className={cn(className, styles.collapse)}
                id={id}
                data-test-id={dataTestId}
            >
                <div
                    ref={contentRef}
                    className={cn(styles.content, {
                        [styles.expandedContent]: isExpanded,
                    })}
                    style={contentStyles}
                    onTransitionEnd={handleTransitionEnd}
                >
                    <div ref={contentCaseRef}>{children}</div>
                </div>
                {(expandedLabel || collapsedLabel) && (
                    <Link
                        className={cn({ [styles.expandedLabel]: isExpanded })}
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
