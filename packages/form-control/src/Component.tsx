import React, { ReactNode, HTMLAttributes } from 'react';
import cn from 'classnames';

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
     * Дополнительный класс для поля
     */
    fieldClassName?: string;

    /**
     * Дополнительный класс для лейбла
     */
    labelClassName?: string;

    /**
     * Дополнительный класс для аддонов
     */
    addonsClassName?: string;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;

    /**
     * Компонент поля (инпут, textarea и пр.)
     */
    children?: ReactNode;
};

export const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
    (
        {
            block = false,
            size = 's',
            className,
            fieldClassName,
            labelClassName,
            addonsClassName,
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
            ...restProps
        },
        ref,
    ) => {
        const errorMessage = typeof error === 'string' ? error : '';

        return (
            <div
                data-test-id={dataTestId}
                className={cn(styles.component, className, styles[size], {
                    [styles.block]: block,
                    [styles.hasLeftAddons]: leftAddons,
                    [styles.hasRightAddons]: rightAddons || error,
                })}
            >
                <div
                    {...restProps}
                    className={cn(fieldClassName, styles.inner, {
                        [styles.focused]: focused,
                        [styles.disabled]: disabled,
                        [styles.filled]: filled,
                        [styles.hasError]: error,
                        [styles.hasLabel]: label,
                    })}
                    ref={ref}
                >
                    {leftAddons && (
                        <div className={cn(styles.addons, styles.leftAddons, addonsClassName)}>
                            {leftAddons}
                        </div>
                    )}

                    <div className={styles.inputWrapper}>
                        {label && (
                            <div className={cn(styles.label, labelClassName)}>
                                <span className={styles.labelInner}>{label}</span>
                            </div>
                        )}

                        <div className={styles.input}>{children}</div>
                    </div>

                    {rightAddons && (
                        <div className={cn(styles.addons, styles.rightAddons, addonsClassName)}>
                            {rightAddons}
                        </div>
                    )}
                </div>

                {bottomAddons}

                {errorMessage && (
                    <span className={cn(styles.sub, styles.error)}>{errorMessage}</span>
                )}

                {hint && !errorMessage && (
                    <span className={cn(styles.sub, styles.hint)}>{hint}</span>
                )}
            </div>
        );
    },
);
