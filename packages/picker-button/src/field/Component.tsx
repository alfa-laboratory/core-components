import React, { FC, SVGProps } from 'react';
import cn from 'classnames';
import { Button, ButtonProps } from '@alfalab/core-components-button';
import { FieldProps as BaseFieldProps } from '@alfalab/core-components-select/src/typings';
import { ArrowDownMIcon } from '@alfalab/icons-classic/ArrowDownMIcon';
import { ArrowDownSIcon } from '@alfalab/icons-classic/ArrowDownSIcon';

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
    const Icon: FC<SVGProps<SVGSVGElement>> = buttonSize === 'xs' ? ArrowDownSIcon : ArrowDownMIcon;

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
