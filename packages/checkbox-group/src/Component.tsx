import React, { FC, ReactNode, Children, cloneElement, ReactElement, ChangeEvent } from 'react';
import cn from 'classnames';

import styles from './index.module.css';

export type Direction = 'horizontal' | 'vertical';
export type CheckboxGroupType = 'checkbox' | 'tag';

export type CheckboxGroupProp = {
    /**
     * Заголовок для группы
     */
    label?: ReactNode;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Дополнительный класс для заголовка
     */
    labelClassName?: string;

    /**
     * Направление
     */
    direction?: Direction;

    /**
     * Текст ошибки
     */
    error?: string;

    /**
     * Дочерние элементы. Ожидаются компоненты `Checkbox` или `Tag`
     */
    children: ReactElement[];

    /**
     * Обработчик изменения значения 'checked' одного из дочерних компонентов
     */
    onChange?: (
        event?: ChangeEvent<HTMLInputElement>,
        payload?: {
            checked: boolean;
            name?: string;
        },
    ) => void;

    /**
     * Тип компонента
     */
    type?: CheckboxGroupType;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;

    /**
     * Управление возможностью изменения состояния 'checked' дочерних компонентов CheckBox
     */
    disabled?: boolean;
};

export const CheckboxGroup: FC<CheckboxGroupProp> = ({
    children,
    className,
    direction = 'vertical',
    label,
    labelClassName,
    error,
    onChange,
    type = 'checkbox',
    dataTestId,
    disabled = false,
}) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const renderChild = (child: ReactElement, props: any): ReactElement => {
        const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
            if (onChange) {
                onChange(event, { name: props.name, checked: event.target.checked });
            }
        };

        const handlerName = type === 'checkbox' ? 'onChange' : 'onClick';

        return cloneElement(child, { [handlerName]: handleChange, ...props });
    };

    return (
        <div
            className={cn(
                styles.component,
                styles[direction],
                { [styles.error]: error },
                className,
            )}
            data-test-id={dataTestId}
        >
            {label ? <span className={cn(styles.label, labelClassName)}>{label}</span> : null}

            <div className={cn(styles.checkboxList)}>
                {Children.map(children, child => {
                    if (child === null) {
                        return child;
                    }

                    const props = {
                        disabled,
                        ...child.props,
                        className: cn(child.props.className, styles.checkbox),
                    };

                    return renderChild(child, props);
                })}
            </div>

            {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
    );
};
