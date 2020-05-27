import React, { ReactNode, useCallback } from 'react';
import cn from 'classnames';
import ArrowIcon from '@alfalab/icons-classic/ArrowDownMBlackIcon';
import { FormControl, FormControlProps } from '@alfalab/core-components-form-control';
import { FieldProps as CommonFieldProps } from '../../Component';

import styles from './index.module.css';

type FieldProps = CommonFieldProps & Pick<FormControlProps, 'leftAddons' | 'rightAddons'>;

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
    showArrow = true,
    valueRenderer,
}: FieldProps) => {
    const rightAddonsRenderer = useCallback(
        () =>
            (rightAddons || showArrow) && (
                <React.Fragment>
                    {rightAddons}
                    {showArrow && <ArrowIcon className={styles.arrow} />}
                </React.Fragment>
            ),
        [rightAddons, showArrow],
    );

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
            rightAddons={rightAddonsRenderer()}
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
