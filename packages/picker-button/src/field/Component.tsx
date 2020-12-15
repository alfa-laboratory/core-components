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
import { PickerButtonSize } from '..';

type FieldProps = Omit<BaseFieldProps, 'size'> &
    ButtonProps & {
        buttonSize?: PickerButtonSize;
    };

export const Field = ({
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
    buttonSize = 'm',
    ...restProps
}: FieldProps) => {
    let Icon: FC<SVGProps<SVGSVGElement>>;
    if (view === 'primary') {
        Icon = buttonSize === 'xs' ? ArrowDownSWhiteIcon : ArrowDownMWhiteIcon;
    } else {
        Icon = buttonSize === 'xs' ? ArrowDownSBlackIcon : ArrowDownMBlackIcon;
    }

    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        <Button
            rightAddons={
                <span className={cn(styles.iconContainer, open && styles.open)}>
                    <Icon data-test-id='picker-button-icon' />
                </span>
            }
            block={true}
            view={view}
            {...restProps}
            {...innerProps}
            size={buttonSize}
            className={cn(styles.component, view === 'primary' && styles.primary, className)}
        >
            {label}
        </Button>
    );
};
