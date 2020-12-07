import React from 'react';
import cn from 'classnames';
import { Button, ButtonProps } from '@alfalab/core-components-button';
import { FieldProps as BaseFieldProps } from '@alfalab/core-components-select/src/typings';
import { ArrowDownMBlackIcon, ArrowDownSBlackIcon } from '@alfalab/icons-classic';

import styles from './index.module.css';

type FieldProps = Omit<BaseFieldProps, 'size'> & ButtonProps;

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
    const Icon = size === 'xs' ? ArrowDownSBlackIcon : ArrowDownMBlackIcon;

    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        <Button
            rightAddons={
                <span className={cn(styles.iconContainer, open && styles.open)}>
                    <Icon />
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
