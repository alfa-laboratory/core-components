import React, { ReactNode } from 'react';
import cn from 'classnames';
import { FormControl, FormControlProps } from '@alfalab/core-components-form-control';
import { BaseFieldProps, OptionShape } from '../../typings';

import styles from './index.module.css';

export type FieldProps = BaseFieldProps &
    Pick<FormControlProps, 'leftAddons' | 'rightAddons' | 'label' | 'placeholder' | 'size'> & {
        /**
         * Кастомный рендер выбранного пункта
         */
        valueRenderer?: (options: OptionShape[]) => ReactNode;
    };

export const Field = ({
    size = 'm',
    open,
    disabled,
    filled,
    focused,
    label,
    placeholder,
    value,
    leftAddons,
    rightAddons,
    valueRenderer,
}: FieldProps) => {
    return (
        <FormControl
            className={cn(styles.component, styles[size], {
                [styles.open]: open,
                [styles.hasLabel]: label,
            })}
            size={size}
            focused={open || focused}
            disabled={disabled}
            filled={filled || !!placeholder}
            label={label}
            rightAddons={rightAddons}
            leftAddons={leftAddons}
        >
            <div className={styles.contentWrapper}>
                {placeholder && !filled && (
                    <span className={styles.placeholder}>{placeholder}</span>
                )}
                {filled && (
                    <span className={styles.value}>
                        {valueRenderer
                            ? valueRenderer(value)
                            : value.reduce((acc: Array<ReactNode | string>, option, index) => {
                                  if (React.isValidElement(option.text)) {
                                      acc.push(
                                          React.cloneElement(option.text, { key: option.value }),
                                      );
                                  } else {
                                      acc.push(option.text || option.value);
                                  }

                                  if (index < value.length - 1) acc.push(', ');
                                  return acc;
                              }, [])}
                    </span>
                )}
            </div>
        </FormControl>
    );
};
