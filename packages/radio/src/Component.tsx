import React, {
    InputHTMLAttributes,
    forwardRef,
    ChangeEvent,
    ReactNode,
    useRef,
    useImperativeHandle,
} from 'react';
import cn from 'classnames';
import { useFocus } from '@alfalab/hooks';

import styles from './index.module.css';

type NativeProps = InputHTMLAttributes<HTMLInputElement>;

export type RadioProps = Omit<
    NativeProps,
    'type' | 'onChange' | 'checked' | 'disabled' | 'name' | 'className'
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
        { onChange, className, name, disabled, dataTestId, label, checked, hint, ...restProps },
        ref,
    ) => {
        const labelRef = useRef<HTMLLabelElement>(null);

        // Оставляет возможность прокинуть реф извне
        useImperativeHandle(ref, () => labelRef.current as HTMLLabelElement);

        const [focused] = useFocus('keyboard', labelRef);

        const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
            if (onChange) {
                onChange(event, { checked: event.target.checked, name });
            }
        };

        return (
            // eslint-disable-next-line jsx-a11y/label-has-associated-control
            <label
                className={cn(styles.container, className, {
                    [styles.disabled]: disabled,
                    [styles.checked]: checked,
                    [styles.focused]: focused,
                })}
                ref={labelRef}
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
