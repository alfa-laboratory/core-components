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
    onClick?: (event: MouseEvent<HTMLDivElement>) => void;

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
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <div
                className={cn(className, [styles.component], styles[variant], styles[size], {
                    [styles.checked]: checked,
                    [styles.disabled]: disabled,
                    [styles.focused]: focused,
                    [styles.open]: open,
                })}
                ref={ref}
                data-test-id={dataTestId}
                onClick={disabled ? undefined : onClick}
                {...restProps}
            >
                <button
                    type='button'
                    ref={valueRef}
                    disabled={disabled}
                    className={cn(styles.valueButton, styles[size], styles[variant], {
                        [styles.checked]: checked,
                        [styles.open]: open,
                    })}
                >
                    <span>{children}</span>
                    <span className={styles.chevron}>
                        {size === 'xxs' ? <ChevronDownCompactSIcon /> : <ChevronDownMIcon />}
                    </span>
                </button>

                {checked && !disabled && (
                    <IconButton
                        className={cn(styles.clear, styles[size], styles[variant])}
                        icon={size === 'xxs' ? CrossCircleSIcon : CrossCircleMIcon}
                        colors='inverted'
                        size='xxs'
                        onClick={handleClear}
                    />
                )}
            </div>
        );
    },
);
