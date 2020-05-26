import React, { ReactNode, useCallback } from 'react';
import cn from 'classnames';
import ErrorIcon from '@alfalab/icons-classic/ErrorMColorIcon';

import styles from './index.module.css';

export type FormControlProps = {
    /**
     * Растягивает компонент на ширину контейнера
     */
    block?: boolean;

    /**
     * Размер компонента
     */
    size?: 's' | 'm' | 'l';

    /**
     * Заблокированное состояние
     */
    disabled?: boolean;

    /**
     * Заполненное состояние
     */
    filled?: boolean;

    /**
     * Выбранное (фокус) состояние
     */
    focused?: boolean;

    /**
     * Текст ошибки
     */
    error?: string;

    /**
     * Текст подсказки
     */
    hint?: string;

    /**
     * Лейбл компонента
     */
    label?: ReactNode;

    /**
     * Слот слева
     */
    leftAddons?: ReactNode;

    /**
     * Слот справа
     */
    rightAddons?: ReactNode;

    /**
     * Слот под полем
     */
    bottomAddons?: ReactNode;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Дополнительный класс для лейбла
     */
    labelClassName?: string;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;

    /**
     * Компонент поля (инпут, textarea и пр.)
     */
    children?: ReactNode;
};

export const FormControl = ({
    block = false,
    size = 's',
    className,
    labelClassName,
    disabled,
    focused,
    filled,
    error,
    hint,
    label,
    leftAddons,
    rightAddons,
    bottomAddons,
    children,
    dataTestId,
}: FormControlProps) => {
    const rightAddonsRenderer = useCallback(
        () =>
            (error || rightAddons) && (
                <div className={cn(styles.addons)}>
                    {error && <ErrorIcon />}
                    {rightAddons}
                </div>
            ),
        [error, rightAddons],
    );

    const leftAddonsRenderer = useCallback(
        () => leftAddons && <div className={styles.addons}>{leftAddons}</div>,
        [leftAddons],
    );

    return (
        <div
            data-test-id={dataTestId}
            className={cn(
                styles.component,
                styles[size],
                {
                    [styles.focused]: focused,
                    [styles.disabled]: disabled,
                    [styles.filled]: filled,
                    [styles.hasError]: error,
                    [styles.block]: block,
                },
                className,
            )}
        >
            <div className={styles.inner}>
                {leftAddonsRenderer()}

                <div className={styles.inputWrapper}>
                    {label && (
                        <div className={cn(styles.label, labelClassName)}>
                            <span className={styles.labelInner}>{label}</span>
                        </div>
                    )}

                    {children}
                </div>

                {rightAddonsRenderer()}
            </div>

            {(error || hint) && <span className={styles.sub}>{error || hint}</span>}

            {bottomAddons}
        </div>
    );
};
