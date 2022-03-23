import React, { forwardRef, MouseEvent, ReactNode, useRef } from 'react';

import { IconButton } from '@alfalab/core-components-icon-button';
import { useFocus } from '@alfalab/hooks';
import { ChevronDownMIcon } from '@alfalab/icons-glyph/ChevronDownMIcon';
import { ChevronDownCompactSIcon } from '@alfalab/icons-glyph/ChevronDownCompactSIcon';
import { CrossCircleMIcon } from '@alfalab/icons-glyph/CrossCircleMIcon';
import { CrossCircleSIcon } from '@alfalab/icons-glyph/CrossCircleSIcon';

import cn from 'classnames';

import styles from './index.module.css';

export type FilterTagProps = {
    /**
     * Состояние выбора
     */
    checked?: boolean;

    /**
     * Состояние открытия
     */
    open?: boolean;

    /**
     * Состояние блокировки
     */
    disabled?: boolean;

    /**
     * Обработчик клика
     */
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;

    /**
     * Обработчик очистки
     */
    onClear?: () => void;

    /**
     * Контент
     */
    children?: ReactNode;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;

    /**
     * Размер компонента
     */
    size?: 'xxs' | 'xs' | 's';

    /**
     * Вариант тега
     */
    variant?: 'default' | 'alt';

    /**
     * Дополнительный класс
     */
    className?: string;
};

export const FilterTag = forwardRef<HTMLDivElement, FilterTagProps>(
    (
        {
            children,
            checked,
            disabled,
            open,
            onClick,
            size = 's',
            variant = 'default',
            onClear = () => null,
            className,
            dataTestId,
            ...restProps
        },
        ref,
    ) => {
        const valueRef = useRef<HTMLButtonElement>(null);

        const [focused] = useFocus(valueRef, 'keyboard');

        const handleClear = (event: MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation();
            onClear();
        };

        return (
            <div
                className={cn(className, [styles.filterTag], styles[variant], styles[size], {
                    [styles.checked]: checked,
                    [styles.disabled]: disabled,
                    [styles.focused]: focused,
                    [styles.open]: open,
                })}
                ref={ref}
                data-test-id={dataTestId}
                {...restProps}
            >
                <button
                    type='button'
                    ref={valueRef}
                    disabled={disabled}
                    className={cn(styles.valueButton, styles[size], {
                        [styles.checked]: checked,
                        [styles.open]: open,
                    })}
                    onClick={disabled ? undefined : onClick}
                >
                    <span>{children}</span>
                    <span className={styles.chevron}>
                        {size === 'xxs' ? <ChevronDownCompactSIcon /> : <ChevronDownMIcon />}
                    </span>
                </button>

                {checked && !disabled && (
                    <IconButton
                        disabled={disabled}
                        className={cn(styles.clear, styles[size])}
                        icon={size === 'xxs' ? CrossCircleSIcon : CrossCircleMIcon}
                        colors={checked ? 'inverted' : 'default'}
                        size='xxs'
                        onClick={handleClear}
                    />
                )}
            </div>
        );
    },
);
