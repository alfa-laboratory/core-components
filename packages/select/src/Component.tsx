import React, { forwardRef } from 'react';
import { Field as DefaultField } from './components/field';
import { Arrow as DefaultArrow } from './components/arrow';
import { OptionsList as DefaultOptionsList } from './components/options-list';
import { Option as DefaultOption } from './components/option';
import { Optgroup as DefaultOptgroup } from './components/optgroup';
import { BaseSelect } from './components/base-select';
import { BaseSelectProps } from './typings';
import { FormControlProps } from '../../form-control/src/Component';

export type SelectProps = Omit<BaseSelectProps, 'fieldProps'> & {
    /**
     * Пропсы, которые будут прокинуты в компонент поля
     */
    fieldProps?: FormControlProps & Record<string, unknown>;
};

export const Select = forwardRef<HTMLDivElement, SelectProps>(
    (
        {
            Arrow = DefaultArrow,
            Field = DefaultField,
            OptionsList = DefaultOptionsList,
            Optgroup = DefaultOptgroup,
            Option = DefaultOption,
            ...restProps
        },
        ref,
    ) => (
        <BaseSelect
            ref={ref}
            Option={Option}
            Field={Field}
            Optgroup={Optgroup}
            OptionsList={OptionsList}
            Arrow={Arrow}
            {...restProps}
        />
    ),
);
