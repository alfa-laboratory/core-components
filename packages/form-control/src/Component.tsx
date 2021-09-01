import React, { ReactNode, HTMLAttributes } from 'react';
import cn from 'classnames';

import styles from './index.module.css';
import defaultColors from './default.module.css';
import invertedColors from './inverted.module.css';

const colorStyles = {
    default: defaultColors,
    inverted: invertedColors,
};

export type FormControlProps = HTMLAttributes<HTMLDivElement> & {
    /**
     * Растягивает компонент на ширину контейнера
     */
    block?: boolean;

    /**
     * Размер компонента
     */
    size?: 's' | 'm' | 'l' | 'xl';

    /**
     * Набор цветов для компонента
     */
    colors?: 'default' | 'inverted';

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
    error?: ReactNode | boolean;

    /**
     * Текст подсказки
     */
    hint?: ReactNode;

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
            colors = 'default',
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
        const errorMessage = typeof error === 'boolean' ? '' : error;

        return (
            <div
                data-test-id={dataTestId}
                className={cn(
                    styles.component,
                    colorStyles[colors].component,
                    className,
                    styles[size],
                    {
                        [styles.block]: block,
                        [styles.hasLeftAddons]: leftAddons,
                        [styles.hasRightAddons]: rightAddons || error,
                    },
                )}
            >
                <div
                    {...restProps}
                    className={cn(fieldClassName, styles.inner, colorStyles[colors].inner, {
                        [styles.disabled]: disabled,
                        [colorStyles[colors].disabled]: disabled,
                        [styles.filled]: filled,
                        [styles.hasLabel]: label,
                        [styles.focused]: focused,
                        [colorStyles[colors].focused]: focused,
                        [styles.hasError]: error,
                        [colorStyles[colors].hasError]: error,
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
                            <React.Fragment>
                                <span className={styles.hiddenLabel} aria-hidden={true}>
                                    {label}
                                </span>
                                <div
                                    className={cn(
                                        styles.label,
                                        colorStyles[colors].label,
                                        labelClassName,
                                    )}
                                >
                                    <span className={styles.labelInner}>{label}</span>
                                </div>
                            </React.Fragment>
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
                    <span className={cn(styles.sub, styles.error, colorStyles[colors].error)}>
                        {errorMessage}
                    </span>
                )}

                {hint && !errorMessage && (
                    <span className={cn(styles.sub, colorStyles[colors].hint)}>{hint}</span>
                )}
            </div>
        );
    },
);
