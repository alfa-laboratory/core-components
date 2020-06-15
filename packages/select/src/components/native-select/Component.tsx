import React from 'react';
import { OptionShape, GroupShape, BaseSelectProps } from '../../typings';
import { isGroup } from '../../utils';

export type NativeSelectProps = Pick<
    BaseSelectProps,
    'disabled' | 'className' | 'options' | 'multiple' | 'onChange' | 'name'
> & {
    /**
     * Значение селекта
     */
    value: string | string[];
};

const Option = ({ value, text, nativeText, disabled }: OptionShape) => (
    <option value={value} disabled={disabled}>
        {nativeText || text || value}
    </option>
);

const Group = ({ label, options }: GroupShape) => (
    <optgroup label={label}>
        {options.map(option => (
            <Option {...option} key={option.value} />
        ))}
    </optgroup>
);

export const NativeSelect = ({
    className,
    disabled,
    multiple,
    value,
    name,
    options,
    onChange,
}: NativeSelectProps) => (
    <select
        className={className}
        disabled={disabled}
        multiple={multiple}
        name={name}
        value={value}
        onChange={onChange}
    >
        {options.map(option =>
            isGroup(option) ? (
                <Group {...option} key={option.label} />
            ) : (
                <Option {...option} key={option.value} />
            ),
        )}
    </select>
);
