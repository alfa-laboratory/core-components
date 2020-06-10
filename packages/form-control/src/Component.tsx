import React, { ReactNode, useCallback, HTMLAttributes } from 'react';
import cn from 'classnames';
import ErrorIcon from '@alfalab/icons-classic/ErrorMColorIcon';

import styles from './index.module.css';

export type FormControlProps = HTMLAttributes<HTMLDivElement> & {
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
     * Отображение ошибки
     */
    error?: string | boolean;

    /**
     * Показывать иконку ошибки
     */
    hasErrorIcon?: boolean;

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
    hasErrorIcon = true,
    hint,
    label,
    leftAddons,
    rightAddons,
    bottomAddons,
    children,
    dataTestId,
    ...restProps
}: FormControlProps) => {
    const rightAddonsRenderer = useCallback(() => {
        const showIcon = error && hasErrorIcon;

        return (
            (showIcon || rightAddons) && (
                <div className={cn(styles.addons)}>
                    {showIcon && <ErrorIcon />}
                    {rightAddons}
                </div>
            )
        );
    }, [error, hasErrorIcon, rightAddons]);

    const leftAddonsRenderer = useCallback(
        () => leftAddons && <div className={styles.addons}>{leftAddons}</div>,
        [leftAddons],
    );

    const errorMessage = typeof error === 'string' ? error : '';

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
                    [styles.hasLabel]: label,
                    [styles.block]: block,
                    [styles.hasLeftAddons]: leftAddons,
                    [styles.hasRightAddons]: rightAddons || error,
                },
                className,
            )}
            {...restProps}
        >
            <div className={styles.inner}>
                {leftAddonsRenderer()}

                <div className={styles.inputWrapper}>
                    {label && (
                        <div className={cn(styles.label, labelClassName)}>
                            <span className={styles.labelInner}>{label}</span>
                        </div>
                    )}

                    <div className={styles.input}>{children}</div>
                </div>

                {rightAddonsRenderer()}
            </div>

            {errorMessage && <span className={cn(styles.sub, styles.error)}>{errorMessage}</span>}

            {hint && !errorMessage && <span className={styles.sub}>{hint}</span>}

            {bottomAddons}
        </div>
    );
};
