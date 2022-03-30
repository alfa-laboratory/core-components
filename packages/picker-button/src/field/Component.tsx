import React, { ButtonHTMLAttributes, FC, SVGProps } from 'react';
import cn from 'classnames';
import { Button, ButtonProps } from '@alfalab/core-components-button';
import { FieldProps as BaseFieldProps } from '@alfalab/core-components-select/src/typings';

import { PickerButtonSize, PickerButtonVariant } from '../Component';
import { getIcon } from '../utils';

import styles from './index.module.css';

type FieldProps = Omit<BaseFieldProps, 'size' | 'hint' | 'success' | 'error' | 'placeholder'> &
    ButtonProps & {
        buttonSize?: PickerButtonSize;
        buttonVariant?: PickerButtonVariant;
    };

export const Field = ({
    buttonSize = 'm',
    buttonVariant = 'default',
    view,
    label,
    open,
    multiple,
    rightAddons,
    Arrow,
    innerProps,
    className,
    selected,
    selectedMultiple,
    valueRenderer,
    ...restProps
}: FieldProps) => {
    const Icon: FC<SVGProps<SVGSVGElement>> = getIcon(buttonVariant, buttonSize);

    const { ref, ...restInnerProps } = innerProps;

    const buttonProps = {
        ...restProps,
        ...restInnerProps,
    } as ButtonHTMLAttributes<HTMLButtonElement>;

    return (
        <div ref={ref}>
            <Button
                {...buttonProps}
                rightAddons={
                    rightAddons ?? (
                        <span
                            className={cn(
                                styles.iconContainer,
                                buttonVariant !== 'compact' && open && styles.open,
                            )}
                        >
                            <Icon data-test-id='picker-button-icon' />
                        </span>
                    )
                }
                block={true}
                view={view}
                size={buttonSize}
                className={cn(styles.component, view === 'primary' && styles.primary, className)}
            >
                {buttonVariant !== 'compact' && label}
            </Button>
        </div>
    );
};
