import React, { InputHTMLAttributes, useCallback, ChangeEvent } from 'react';
import cn from 'classnames';

import styles from './index.module.css';

export type SwitchProps = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'hint' | 'onChange'
> & {
    /**
     * Управление состоянием вкл/выкл компонента
     */
    checked?: boolean;

    /**
     * Текст подписи к переключателю
     */
    label?: string;

    /**
     * Текст подсказки снизу
     */
    hint?: string;

    /**
     * Растягивает компонент на ширину контейнера
     */
    block?: boolean;

    /**
     * Кастомный контент
     */
    children?: React.ReactNode;

    /**
     * Сторона, с которой будет отображаться контент
     */
    contentAlign?: 'left' | 'right';

    /**
     * Обработчик переключения компонента
     */
    onChange?: (
        event?: ChangeEvent<HTMLInputElement>,
        payload?: {
            checked: boolean;
            name: InputHTMLAttributes<HTMLInputElement>['name'];
            value: InputHTMLAttributes<HTMLInputElement>['value'];
        },
    ) => void;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export const Switch = ({
    contentAlign = 'right',
    checked = false,
    disabled,
    label,
    hint,
    name,
    value,
    children,
    className,
    onChange,
    block,
    dataTestId,
    ...restProps
}: SwitchProps) => {
    const hasContent = label || hint || children;

    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            if (onChange) {
                onChange(e, { checked: e.target.checked, name, value });
            }
        },
        [onChange, name, value],
    );

    return (
        // eslint-disable-next-line jsx-a11y/label-has-associated-control
        <label
            className={cn(styles.component, className, {
                [styles.disabled]: disabled,
                [styles.checked]: checked,
                [styles.block]: block,
                [styles.alignLeft]: contentAlign === 'left',
            })}
        >
            <input
                type='checkbox'
                onChange={handleChange}
                disabled={disabled}
                checked={checked}
                name={name}
                value={value}
                data-test-id={dataTestId}
                {...restProps}
            />

            <span className={styles.switch} />

            {hasContent && (
                <div className={styles.content}>
                    {label && <span className={styles.label}>{label}</span>}
                    {hint && <span className={styles.hint}>{hint}</span>}
                    {children}
                </div>
            )}
        </label>
    );
};
