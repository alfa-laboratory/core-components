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

export type PickerButtonSize = 'xs' | 's' | 'm';

export type PickerButtonProps = Omit<
    BaseSelectProps,
    'Field' | 'placeholder' | 'Arrow' | 'autocomplete' | 'size' | 'onFocus'
> &
    Pick<ButtonProps, 'view' | 'loading'> & {
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
            closeOnSelect = false,
            view,
            loading,
            size = 'm',
            className,
            ...restProps
        },
        ref,
    ) => (
        <BaseSelect
            ref={ref}
            closeOnSelect={closeOnSelect}
            Option={Option}
            Field={DefaultField}
            size={size === 'm' ? 'm' : 's'}
            fieldProps={{
                view,
                loading,
                /** size у select, button несовместимы */
                buttonSize: size,
            }}
            Optgroup={Optgroup}
            OptionsList={OptionsList}
            className={cn(styles.container, className)}
            {...restProps}
        />
    ),
);
