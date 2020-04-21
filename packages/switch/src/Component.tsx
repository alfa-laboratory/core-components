import React, { InputHTMLAttributes, useCallback, ChangeEvent, ReactNode } from 'react';
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
    label?: ReactNode;

    /**
     * Текст подсказки снизу
     */
    hint?: ReactNode;

    /**
     * Переключатель будет отрисован справа от контента
     */
    reversed?: boolean;

    /**
     * Обработчик переключения компонента
     */
    onChange?: (
        event?: ChangeEvent<HTMLInputElement>,
        payload?: {
            checked: boolean;
            name: InputHTMLAttributes<HTMLInputElement>['name'];
        },
    ) => void;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export const Switch = ({
    reversed = false,
    checked = false,
    disabled,
    label,
    hint,
    name,
    value,
    className,
    onChange,
    dataTestId,
    ...restProps
}: SwitchProps) => {
    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            if (onChange) {
                onChange(e, { checked: e.target.checked, name });
            }
        },
        [onChange, name],
    );

    return (
        // eslint-disable-next-line jsx-a11y/label-has-associated-control
        <label
            className={cn(styles.component, className, {
                [styles.disabled]: disabled,
                [styles.checked]: checked,
                [styles.reversed]: reversed,
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

            {(label || hint) && (
                <div className={styles.content}>
                    {label && <span className={styles.label}>{label}</span>}
                    {hint && <span className={styles.hint}>{hint}</span>}
                </div>
            )}
        </label>
    );
};
