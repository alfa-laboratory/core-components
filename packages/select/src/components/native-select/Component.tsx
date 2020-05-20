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

export const NativeSelect = ({
    className,
    disabled,
    multiple,
    value,
    name,
    options,
    onChange,
}: NativeSelectProps) => {
    const renderOption = (option: OptionShape) => (
        <option value={option.value} disabled={option.disabled} key={option.value}>
            {option.nativeText || option.text || option.value}
        </option>
    );

    const renderGroup = (group: GroupShape) => (
        <optgroup label={group.label} key={group.label}>
            {group.options.map(renderOption)}
        </optgroup>
    );

    return (
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
                'options' in option ? renderGroup(option) : renderOption(option),
            )}
        </select>
    );
};
