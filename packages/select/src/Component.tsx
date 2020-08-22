import React from 'react';
import { Field as DefaultField } from './components/field';
import { Arrow as DefaultArrow } from './components/arrow';
import { OptionsList as DefaultOptionsList } from './components/options-list';
import { Option as DefaultOption } from './components/option';
import { Optgroup as DefaultOptgroup } from './components/optgroup';
import { BaseSelect } from './components/base-select';
import { SelectProps } from './typings';

export const Select = ({
    Arrow = DefaultArrow,
    Field = DefaultField,
    OptionsList = DefaultOptionsList,
    Optgroup = DefaultOptgroup,
    Option = DefaultOption,
    ...restProps
}: SelectProps) => (
    <BaseSelect
        Option={Option}
        Field={Field}
        Optgroup={Optgroup}
        OptionsList={OptionsList}
        Arrow={Arrow}
        {...restProps}
    />
);
