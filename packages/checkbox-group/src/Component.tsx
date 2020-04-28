import React, {
    FC,
    ReactNode,
    Children,
    cloneElement,
    ReactElement,
    ChangeEvent,
    isValidElement,
} from 'react';
import cn from 'classnames';

import styles from './index.module.css';

export type Direction = 'horizontal' | 'vertical';
export type CheckboxGroupType = 'checkbox' | 'tag';

type ChildProps = {
    [key: string]: unknown;
};

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
     * Текст ошибки
     */
    error?: string;

    /**
     * Дочерние элементы. Ожидаются компоненты `Checkbox` или `Tag`
     */
    children: ReactNode;

    /**
     * Обработчик изменения значения 'checked' одного из дочерних компонентов
     */
    onChange?: (
        event?: ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>,
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
    onChange,
    type = 'checkbox',
    dataTestId,
    disabled = false,
}) => {
    const renderCheckbox = (child: ReactElement, props: ChildProps) => {
        const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
            if (onChange) {
                onChange(event, { name: child.props.name, checked: event.target.checked });
            }
        };

        return cloneElement(child, { onChange: handleChange, ...props });
    };

    const renderTag = (child: ReactElement, props: ChildProps) => {
        const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            if (onChange) {
                onChange(event, { name: child.props.name, checked: !child.props.checked });
            }
        };

        return cloneElement(child, { onClick: handleClick, ...props });
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
            {label ? <span className={styles.label}>{label}</span> : null}

            {children ? (
                <div className={cn(styles.checkboxList)}>
                    {Children.map(children, child => {
                        if (isValidElement(child)) {
                            const props = {
                                disabled,
                                ...child.props,
                                className: cn(child.props.className, styles.checkbox),
                            };

                            return type === 'checkbox'
                                ? renderCheckbox(child, props)
                                : renderTag(child, props);
                        }

                        return null;
                    })}
                </div>
            ) : null}

            {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
    );
};
