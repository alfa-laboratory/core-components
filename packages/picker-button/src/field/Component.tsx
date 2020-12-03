import React from 'react';
import cn from 'classnames';
import { Button, ButtonProps } from '@alfalab/core-components-button';
import { FieldProps as BaseFieldProps } from '@alfalab/core-components-select/src/typings';
import { ChevronDownMIcon } from '@alfalab/icons-glyph';

import styles from './index.module.css';

type FieldProps = BaseFieldProps & ButtonProps;

export const Field = ({
    size = 'm',
    open,
    multiple,
    error,
    hint,
    label,
    placeholder,
    selected,
    rightAddons,
    Arrow,
    innerProps,
    className,
    ...restProps
}: FieldProps) => {
    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        <Button
            rightAddons={
                <span className={cn(styles[size], styles.iconContainer, open && styles.open)}>
                    <ChevronDownMIcon className={styles.icon} />
                </span>
            }
            block={true}
            size={size}
            {...restProps}
            {...innerProps}
        >
            {label}
        </Button>
    );
};
