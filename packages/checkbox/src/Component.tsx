import React, { InputHTMLAttributes, forwardRef, ReactNode, ChangeEvent, useRef } from 'react';
import cn from 'classnames';
import { useFocus } from '@alfalab/hooks';
import mergeRefs from 'react-merge-refs';

import CheckedIcon from '@alfalab/icons-classic/TickXsWhiteIcon';
import IndeterminateIcon from '@alfalab/icons-classic/CheckIndeterminateSWhiteIcon';

import styles from './index.module.css';

type NativeProps = InputHTMLAttributes<HTMLInputElement>;

export type CheckboxProps = Omit<NativeProps, 'onChange'> & {
    /**
     * Управление состоянием вкл/выкл чекбокса (native prop)
     */
    checked?: boolean;

    /**
     * Обработчик переключения чекбокса
     */
    onChange?: (
        event?: ChangeEvent<HTMLInputElement>,
        payload?: {
            checked: boolean;
            name?: string;
        },
    ) => void;

    /**
     * Текст подписи к чекбоксу
     */
    label?: ReactNode;

    /**
     * Текст подсказки снизу
     */
    hint?: ReactNode;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;

    /**
     * Управление неопределенным состоянием чекбокса
     */
    indeterminate?: boolean;
};

export const Checkbox = forwardRef<HTMLLabelElement, CheckboxProps>(
    (
        {
            checked,
            label,
            hint,
            onChange,
            className,
            name,
            disabled,
            dataTestId,
            indeterminate = false,
            ...restProps
        },
        ref,
    ) => {
        const labelRef = useRef<HTMLLabelElement>(null);

        const [focused] = useFocus(labelRef, 'keyboard');

        const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
            if (onChange) {
                onChange(event, { checked: event.target.checked, name });
            }
        };

        return (
            // eslint-disable-next-line jsx-a11y/label-has-associated-control
            <label
                className={cn(styles.component, className, {
                    [styles.disabled]: disabled,
                    [styles.checked]: checked,
                    [styles.indeterminate]: indeterminate,
                    [styles.focused]: focused,
                })}
                ref={mergeRefs([labelRef, ref])}
            >
                <span className={cn(styles.box)}>
                    <input
                        type='checkbox'
                        onChange={handleChange}
                        disabled={disabled}
                        checked={checked}
                        data-test-id={dataTestId}
                        {...restProps}
                    />

                    {checked && <CheckedIcon />}

                    {indeterminate && !checked && (
                        <IndeterminateIcon className={cn(styles.indeterminateIcon)} />
                    )}
                </span>

                {(label || hint) && (
                    <span className={cn(styles.content)}>
                        {label && <span className={cn(styles.label)}>{label}</span>}
                        {hint && <span className={cn(styles.hint)}>{hint}</span>}
                    </span>
                )}
            </label>
        );
    },
);

/**
 * Для отображения в сторибуке
 */
Checkbox.defaultProps = {
    indeterminate: false,
};
