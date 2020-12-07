import React, { FC, SVGProps } from 'react';
import cn from 'classnames';
import { Button, ButtonProps } from '@alfalab/core-components-button';
import { FieldProps as BaseFieldProps } from '@alfalab/core-components-select/src/typings';
import {
    ArrowDownMBlackIcon,
    ArrowDownSBlackIcon,
    ArrowDownMWhiteIcon,
    ArrowDownSWhiteIcon,
} from '@alfalab/icons-classic';

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
    view,
    ...restProps
}: FieldProps) => {
    let Icon: FC<SVGProps<SVGSVGElement>>;
    if (view === 'primary') {
        Icon = size === 'xs' ? ArrowDownSWhiteIcon : ArrowDownMWhiteIcon;
    } else {
        Icon = size === 'xs' ? ArrowDownSBlackIcon : ArrowDownMBlackIcon;
    }

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
            view={view}
            {...restProps}
            {...innerProps}
        >
            {label}
        </Button>
    );
};
