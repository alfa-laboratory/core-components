import React, {
    FC,
    ReactNode,
    Children,
    cloneElement,
    ReactElement,
    ChangeEvent,
    MouseEvent,
    isValidElement,
} from 'react';
import cn from 'classnames';

import styles from './index.module.css';

export type Direction = 'horizontal' | 'vertical';
export type CheckboxGroupType = 'checkbox' | 'tag';

export type CheckboxGroupProps = {
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
    type?: CheckboxGroupType;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Отображение ошибки
     */
    error?: ReactNode | boolean;

    /**
     * Текст подсказки снизу
     */
    hint?: ReactNode;

    /**
     * Дочерние элементы. Ожидаются компоненты `Checkbox` или `Tag`
     */
    children: ReactNode;

    /**
     * Обработчик изменения значения 'checked' одного из дочерних компонентов
     */
    onChange?: (
        event?: ChangeEvent | MouseEvent,
        payload?: {
            checked: boolean;
            name?: string;
        },
    ) => void;

    /**
     * Управление возможностью изменения состояния 'checked' дочерних компонентов CheckBox
     */
    disabled?: boolean;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export const CheckboxGroup: FC<CheckboxGroupProps> = ({
    children,
    className,
    direction = 'vertical',
    label,
    error,
    hint,
    onChange,
    type = 'checkbox',
    dataTestId,
    disabled = false,
}) => {
    const renderCheckbox = (child: ReactElement) => {
        const { name, checked, className: childClassName } = child.props;

        const handleChange = (event: ChangeEvent) => {
            if (onChange) {
                onChange(event, { name, checked: !checked });
            }
        };

        return cloneElement(child, {
            onChange: handleChange,
            disabled,
            ...child.props,
            className: cn(childClassName, styles.checkbox),
        });
    };

    const renderTag = (child: ReactElement) => {
        const { name, checked } = child.props;

        const handleChange = (event: ChangeEvent | MouseEvent) => {
            if (onChange) {
                onChange(event, { name, checked: !checked });
            }
        };

        const clone = cloneElement(child, { onClick: handleChange, disabled, ...child.props });

        return (
            // eslint-disable-next-line jsx-a11y/label-has-associated-control
            <label className={cn(styles.checkbox, styles.tagLabel)}>
                {clone}
                <input
                    type='checkbox'
                    autoComplete='off'
                    onChange={handleChange}
                    disabled={disabled || child.props.disabled}
                    checked={checked}
                    className={styles.hiddenInput}
                />
            </label>
        );
    };

    const errorMessage = typeof error === 'boolean' ? '' : error;

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
                <div className={styles.checkboxList}>
                    {Children.map(children, child => {
                        if (isValidElement(child)) {
                            return type === 'checkbox' ? renderCheckbox(child) : renderTag(child);
                        }

                        return null;
                    })}
                </div>
            ) : null}

            {errorMessage && (
                <span className={cn(styles.sub, styles.errorMessage)}>{errorMessage}</span>
            )}

            {hint && !errorMessage && <span className={cn(styles.sub, styles.hint)}>{hint}</span>}
        </div>
    );
};
