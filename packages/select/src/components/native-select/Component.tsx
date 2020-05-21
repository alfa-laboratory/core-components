import React from 'react';
import { OptionShape, GroupShape, SelectProps } from '../../Component';

type NativeSelectProps = Pick<
    SelectProps,
    'disabled' | 'className' | 'options' | 'multiple' | 'onChange' | 'name'
> & {
    /**
     * Значение селекта
     */
    value: string | string[];
};

const Option = ({ value, text, nativeText, disabled }: OptionShape) => (
    <option value={value} disabled={disabled} key={value}>
        {nativeText || text || value}
    </option>
);

const Group = ({ label, options }: GroupShape) => (
    <optgroup label={label} key={label}>
        {options.map(option => (
            <Option {...option} />
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
        tabIndex={0}
    >
        {options.map(option =>
            'options' in option ? <Group {...option} /> : <Option {...option} />,
        )}
    </select>
);
