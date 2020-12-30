import React, { InputHTMLAttributes, forwardRef, ChangeEvent, ReactNode, useRef } from 'react';
import cn from 'classnames';
import mergeRefs from 'react-merge-refs';
import { useFocus } from '@alfalab/hooks';

import styles from './index.module.css';

type NativeProps = InputHTMLAttributes<HTMLInputElement>;

export type RadioProps = Omit<
    NativeProps,
    'size' | 'type' | 'onChange' | 'checked' | 'disabled' | 'name' | 'className'
> & {
    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;

    /**
     * Текст подсказки снизу
     */
    hint?: ReactNode;

    /**
     * Текст подписи
     */
    label?: ReactNode;

    /**
     * Размер компонента
     */
    size?: 's' | 'm';

    /**
     * Управление состоянием отмечен/не отмечен
     */
    checked?: boolean;

    /**
     * Управление состоянием активен / не активен
     */
    disabled?: boolean;

    /**
     * Html аттрибут name инпута
     */
    name?: string;

    /**
     * Класс компонента
     */
    className?: string;

    /**
     * Обработчик на выбор элемента
     */
    onChange?: (
        event?: ChangeEvent<HTMLInputElement>,
        payload?: {
            checked: boolean;
            name?: string;
        },
    ) => void;
};

export const Radio = forwardRef<HTMLLabelElement, RadioProps>(
    (
        {
            onChange,
            className,
            name,
            disabled,
            dataTestId,
            label,
            checked,
            hint,
            size = 's',
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
                className={cn(styles.container, styles[size], className, {
                    [styles.disabled]: disabled,
                    [styles.checked]: checked,
                    [styles.focused]: focused,
                })}
                ref={mergeRefs([labelRef, ref])}
            >
                <input
                    type='radio'
                    onChange={handleChange}
                    data-test-id={dataTestId}
                    disabled={disabled}
                    checked={checked}
                    name={name}
                    {...restProps}
                />
                <span className={styles.circle} />
                <span className={styles.content}>
                    <span className={styles.label}>{label}</span>
                    {hint && <span className={styles.hint}>{hint}</span>}
                </span>
            </label>
        );
    },
);
