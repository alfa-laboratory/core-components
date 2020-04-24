import React, {
    FC,
    ReactNode,
    Children,
    cloneElement,
    ReactElement,
    ChangeEvent,
    InputHTMLAttributes,
} from 'react';
import cn from 'classnames';

import styles from './index.module.css';

type NativeProps = InputHTMLAttributes<HTMLInputElement>;

export type Direction = 'horizontal' | 'vertical';
export type CheckboxGroupType = 'checkbox' | 'tag';

export type CheckboxGroupProp = {
    label?: ReactNode;
    className?: string;
    labelClassName?: string;
    direction?: Direction;
    error?: string;
    children: ReactElement[];
    onChange?: (
        event?: ChangeEvent<HTMLInputElement>,
        payload?: {
            checked: boolean;
            name: NativeProps['name'];
        },
    ) => void;
    type?: CheckboxGroupType;
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
        >
            {label ? <span className={cn(styles.label, labelClassName)}>{label}</span> : null}

            <div className={cn(styles.checkboxList)}>
                {Children.map(children, child => {
                    const props = {
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
