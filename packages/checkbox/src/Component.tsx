import React, { InputHTMLAttributes, forwardRef, ReactNode, ChangeEvent, useRef } from 'react';
import cn from 'classnames';
import { useFocus } from '@alfalab/hooks';
import mergeRefs from 'react-merge-refs';

import CheckedIcon from '@alfalab/icons-classic/TickXsWhiteIcon';
import IndeterminateIcon from '@alfalab/icons-classic/CheckIndeterminateSWhiteIcon';

import styles from './index.module.css';

type NativeProps = InputHTMLAttributes<HTMLInputElement>;
type Align = 'start' | 'center';

export type CheckboxProps = Omit<NativeProps, 'size' | 'onChange'> & {
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
     * Размер компонента
     */
    size?: 's' | 'm';

    /**
     * Выравнивание
     */
    align?: Align;

    /**
     * Дополнительный слот
     */
    addons?: React.ReactNode;

    /**
     * Растягивать ли компонент на всю ширину
     */
    block?: boolean;

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
            size = 's',
            align = 'start',
            addons,
            block,
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
                className={cn(styles.component, styles[size], styles[align], className, {
                    [styles.disabled]: disabled,
                    [styles.checked]: checked,
                    [styles.indeterminate]: indeterminate,
                    [styles.focused]: focused,
                    [styles.block]: block,
                })}
                ref={mergeRefs([labelRef, ref])}
            >
                <span className={styles.box}>
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
                        <IndeterminateIcon className={styles.indeterminateIcon} />
                    )}
                </span>

                {(label || hint) && (
                    <span className={styles.content}>
                        {label && <span className={styles.label}>{label}</span>}
                        {hint && <span className={styles.hint}>{hint}</span>}
                    </span>
                )}

                {addons && <span className={styles.addons}>{addons}</span>}
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
