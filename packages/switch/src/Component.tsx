import React, {
    InputHTMLAttributes,
    useCallback,
    ChangeEvent,
    ReactNode,
    useRef,
    useImperativeHandle,
    forwardRef,
} from 'react';
import cn from 'classnames';
import { useFocus } from '@alfalab/hooks';

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

export const Switch = forwardRef<HTMLLabelElement, SwitchProps>(
    (
        {
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
        },
        ref,
    ) => {
        const labelRef = useRef<HTMLLabelElement>(null);

        // Оставляет возможность прокинуть реф извне
        useImperativeHandle(ref, () => labelRef.current as HTMLLabelElement);

        const [focused] = useFocus('keyboard', labelRef);

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
                    [styles.focused]: focused,
                })}
                ref={labelRef}
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
                    <span className={styles.content}>
                        {label && <span className={styles.label}>{label}</span>}
                        {hint && <span className={styles.hint}>{hint}</span>}
                    </span>
                )}
            </label>
        );
    },
);
