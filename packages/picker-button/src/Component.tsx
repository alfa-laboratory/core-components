import React, { forwardRef } from 'react';
import cn from 'classnames';
import { ButtonProps } from '@alfalab/core-components-button';

import {
    BaseSelectProps,
    OptionsList as DefaultOptionsList,
    Option as DefaultOption,
    Optgroup as DefaultOptgroup,
    BaseSelect,
} from '@alfalab/core-components-select';

import { Field as DefaultField } from './field';
import styles from './index.module.css';

const SIDE_POSITIONS = ['right', 'right-start', 'right-end', 'left', 'left-start', 'left-end'];

export type PickerButtonSize = 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl';

export type PickerButtonProps = Omit<
    BaseSelectProps,
    | 'Field'
    | 'placeholder'
    | 'Arrow'
    | 'autocomplete'
    | 'size'
    | 'onFocus'
    | 'selected'
    | 'closeOnSelect'
    | 'multiple'
    | 'fieldProps'
    | 'hint'
    | 'allowUnselect'
> &
    Pick<ButtonProps, 'view' | 'loading' | 'leftAddons' | 'rightAddons'> & {
        /**
         * Размер кнопки
         */
        size?: PickerButtonSize;
    };

export const PickerButton = forwardRef<HTMLInputElement, PickerButtonProps>(
    (
        {
            OptionsList = DefaultOptionsList,
            Optgroup = DefaultOptgroup,
            Option = DefaultOption,
            view,
            loading,
            size = 'm',
            className,
            leftAddons,
            rightAddons,
            popperClassName,
            optionsListClassName,
            ...restProps
        },
        ref,
    ) => {
        const isSideGap =
            !!restProps.popoverPosition && SIDE_POSITIONS.includes(restProps.popoverPosition);

        return (
            <BaseSelect
                {...restProps}
                ref={ref}
                Option={Option}
                Field={DefaultField}
                size={size === 'm' ? 'm' : 's'}
                fieldProps={{
                    view,
                    loading,
                    /** size у select, button несовместимы */
                    buttonSize: size,
                    leftAddons,
                    rightAddons,
                }}
                Optgroup={Optgroup}
                OptionsList={OptionsList}
                className={cn(styles.container, className)}
                popperClassName={cn(styles.optionsPopover, popperClassName, {
                    [styles.sideGap]: isSideGap,
                })}
                optionsListClassName={cn(styles.optionsListContainer, optionsListClassName)}
                selected={[]}
                closeOnSelect={true}
            />
        );
    },
);
