import React, { forwardRef, useCallback, SelectHTMLAttributes } from 'react';
import { OptionShape, GroupShape } from '../../typings';
import { isGroup } from '../../utils';

export type NativeSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
    /**
     * Список вариантов выбора
     */
    options: Array<OptionShape | GroupShape>;

    /**
     * Значение селекта
     */
    value: string | string[];
};

const Option = ({ value, text, disabled }: OptionShape) => (
    <option value={value} disabled={disabled}>
        {text || value}
    </option>
);

const Group = ({ label, options }: GroupShape) => (
    <optgroup label={label}>
        {options.map(option => (
            <Option {...option} key={option.value} />
        ))}
    </optgroup>
);

export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
    ({ className, disabled, multiple, value, name, options, onChange, ...restProps }, ref) => {
        const handleClick = useCallback(event => {
            event.stopPropagation();
        }, []);

        return (
            <select
                className={className}
                disabled={disabled}
                multiple={multiple}
                name={name}
                value={value}
                onChange={onChange}
                onClick={handleClick}
                ref={ref}
                {...restProps}
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
    },
);
