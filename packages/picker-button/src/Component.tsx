import React, { forwardRef } from 'react';
import { ButtonProps } from '@alfalab/core-components-button';

import {
    BaseSelectProps,
    OptionsList as DefaultOptionsList,
    Option as DefaultOption,
    Optgroup as DefaultOptgroup,
    BaseSelect,
} from '@alfalab/core-components-select';

import { Field as DefaultField } from './field';

export type PickerButtonProps = Omit<
    BaseSelectProps,
    'Field' | 'placeholder' | 'Arrow' | 'autocomplete'
> &
    Pick<ButtonProps, 'view' | 'loading'>;

export const PickerButton = forwardRef<HTMLInputElement, PickerButtonProps>(
    (
        {
            OptionsList = DefaultOptionsList,
            Optgroup = DefaultOptgroup,
            Option = DefaultOption,
            closeOnSelect = false,
            view,
            loading,
            ...restProps
        },
        ref,
    ) => (
        <BaseSelect
            ref={ref}
            closeOnSelect={closeOnSelect}
            Option={Option}
            Field={DefaultField}
            fieldProps={{
                view,
                loading,
            }}
            Optgroup={Optgroup}
            OptionsList={OptionsList}
            {...restProps}
        />
    ),
);
