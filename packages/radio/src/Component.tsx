import React, { InputHTMLAttributes, forwardRef, ChangeEvent, ReactNode, useRef } from 'react';
import cn from 'classnames';
import mergeRefs from 'react-merge-refs';
import { useFocus } from '@alfalab/hooks';

import styles from './index.module.css';

type NativeProps = InputHTMLAttributes<HTMLInputElement>;
type Align = 'start' | 'center';

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
     * Управление состоянием включен / выключен
     */
    disabled?: boolean;

    /**
     * Управление состоянием активен / неактивен
     */
    inactive?: boolean;

    /**
     * Html аттрибут name инпута
     */
    name?: string;

    /**
     * Класс компонента
     */
    className?: string;

    /**
     * Доп. класс радио кнопки
     */
    circleClassName?: string;

    /**
     * Доп. класс контента
     */
    contentClassName?: string;

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
            circleClassName,
            contentClassName,
            name,
            disabled,
            inactive,
            dataTestId,
            label,
            checked,
            hint,
            size = 's',
            align = 'start',
            addons,
            block,
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
                className={cn(styles.container, styles[size], styles[align], className, {
                    [styles.disabled]: disabled,
                    [styles.inactive]: inactive,
                    [styles.checked]: checked,
                    [styles.focused]: focused,
                    [styles.block]: block,
                })}
                ref={mergeRefs([labelRef, ref])}
            >
                <input
                    type='radio'
                    onChange={handleChange}
                    data-test-id={dataTestId}
                    disabled={disabled || inactive}
                    checked={checked}
                    name={name}
                    {...restProps}
                />
                <span className={cn(styles.circle, circleClassName)} />
                {(label || hint) && (
                    <span className={cn(styles.content, contentClassName)}>
                        {label && <span className={styles.label}>{label}</span>}
                        {hint && <span className={styles.hint}>{hint}</span>}
                    </span>
                )}
                {addons && <span className={styles.addons}>{addons}</span>}
            </label>
        );
    },
);
