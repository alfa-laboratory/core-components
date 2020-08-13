import React, {
    FC,
    ReactNode,
    Children,
    cloneElement,
    ReactElement,
    ChangeEvent,
    MouseEvent,
    isValidElement,
    useState,
} from 'react';
import cn from 'classnames';

import styles from './index.module.css';

export type Direction = 'horizontal' | 'vertical';
export type RadioGroupType = 'radio' | 'tag';

export type RadioGroupProps = {
    /**
     * Заголовок группы
     */
    label?: ReactNode;

    /**
     * Направление
     */
    direction?: Direction;

    /**
     * Тип компонента
     */
    type?: RadioGroupType;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Текст ошибки
     */
    error?: string;

    /**
     * Дочерние элементы. Ожидаются компоненты `Radio` или `Tag`
     */
    children: ReactNode;

    /**
     * Обработчик изменения значения 'checked' одного из дочерних компонентов
     */
    onChange?: (
        event?: ChangeEvent | MouseEvent,
        payload?: {
            value: string;
            name?: string;
        },
    ) => void;

    /**
     * Управление возможностью изменения состояния 'checked' дочерних компонентов Radio | Tag
     */
    disabled?: boolean;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;

    /**
     * Атрибут name для всех дочерних компонентов
     */
    name?: string;

    /**
     * Value выбранного дочернего элемента
     */
    value?: string;
};

export const RadioGroup: FC<RadioGroupProps> = ({
    children,
    className,
    direction = 'vertical',
    label,
    error,
    onChange,
    type = 'radio',
    dataTestId,
    disabled = false,
    name,
    value,
}) => {
    const [stateValue, setStateValue] = useState<string | undefined>('');

    const renderChild = (child: ReactElement) => {
        const { className: childClassName } = child.props;
        const checked = (value || stateValue) === child.props.value;
        const handleChange = (event: ChangeEvent | MouseEvent) => {
            setStateValue(child.props.value);
            if (onChange) {
                onChange(event, { name, value: child.props.value });
            }
        };

        if (type === 'radio') {
            return cloneElement(child, {
                onChange: handleChange,
                disabled,
                ...child.props,
                checked,
                name,
                className: cn(childClassName, styles.radio),
            });
        }

        const clone = cloneElement(child, {
            onClick: handleChange,
            disabled,
            ...child.props,
            checked,
            name,
        });

        return (
            // eslint-disable-next-line jsx-a11y/label-has-associated-control
            <label className={cn(styles.radio, styles.tagLabel)}>
                {clone}
                <input
                    type='radio'
                    autoComplete='off'
                    onChange={handleChange}
                    disabled={disabled || child.props.disabled}
                    name={name}
                    checked={checked}
                    className={styles.hiddenInput}
                />
            </label>
        );
    };

    return (
        <div
            className={cn(
                styles.component,
                styles[type],
                styles[direction],
                { [styles.error]: error },
                className,
            )}
            data-test-id={dataTestId}
        >
            {label ? <span className={styles.label}>{label}</span> : null}

            {children ? (
                <div className={cn(styles.radioList)}>
                    {Children.map(children, child =>
                        isValidElement(child) ? renderChild(child) : null,
                    )}
                </div>
            ) : null}

            {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
    );
};

RadioGroup.defaultProps = {
    direction: 'vertical',
    type: 'radio',
    disabled: false,
};
