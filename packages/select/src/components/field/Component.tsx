import React, { ReactNode } from 'react';
import cn from 'classnames';
import { FormControl, FormControlProps } from '@alfalab/core-components-form-control';
import { BaseFieldProps, OptionShape } from '../../typings';
import { joinOptions } from '../../utils';

import styles from './index.module.css';

export type FieldProps = BaseFieldProps &
    Pick<FormControlProps, 'leftAddons' | 'rightAddons'> & {
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
    selected,
    leftAddons,
    rightAddons,
    valueRenderer = joinOptions,
    Arrow,
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
            rightAddons={
                <React.Fragment>
                    {rightAddons}
                    {Arrow}
                </React.Fragment>
            }
            leftAddons={leftAddons}
        >
            <div className={styles.contentWrapper}>
                {placeholder && !filled && (
                    <span className={styles.placeholder}>{placeholder}</span>
                )}
                {filled && <span className={styles.value}>{valueRenderer(selected)}</span>}
            </div>
        </FormControl>
    );
};
