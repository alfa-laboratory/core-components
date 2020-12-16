import React, { ChangeEvent, forwardRef, useCallback, useRef, useState } from 'react';
import {
    BaseSelectProps,
    OptionsList as DefaultOptionsList,
    Option as DefaultOption,
    Optgroup as DefaultOptgroup,
    BaseSelect,
    Arrow as DefaultArrow,
} from '@alfalab/core-components-select';

import { TagList } from './components';
import { filterOptions } from './utils';
import { SelectWithTagsProps } from './types';

export const SelectWithTags = forwardRef<HTMLInputElement, SelectWithTagsProps>(
    (
        {
            OptionsList = DefaultOptionsList,
            Optgroup = DefaultOptgroup,
            Option = DefaultOption,
            Arrow = DefaultArrow,
            value,
            selected,
            size = 'l',
            onInput,
            onChange,
            options,
            autocomplete = false,
            match,
            ...restProps
        },
        ref,
    ) => {
        const controlled = Boolean(selected);

        const [selectedTags, setSelectedTags] = useState(selected || []);

        const inputRef = useRef<HTMLInputElement>();

        const handleDeleteTag = useCallback(
            (deletedKey: string) => {
                let tags = selected || selectedTags;

                tags = tags.filter(tag => {
                    const key = typeof tag === 'string' ? tag : tag.key;

                    return deletedKey !== key;
                });

                if (onChange) {
                    onChange({ selectedMultiple: tags });
                }

                if (!controlled) {
                    setSelectedTags(tags);
                }
            },
            [controlled, onChange, selected, selectedTags],
        );

        const handleChange = useCallback<Required<BaseSelectProps>['onChange']>(
            ({ selectedMultiple, name }) => {
                if (onChange) {
                    onChange({ selectedMultiple, name });
                }

                if (!controlled) {
                    setSelectedTags(selectedMultiple);
                }

                if (value) {
                    const event = { target: { value: '' } };
                    onInput(event as ChangeEvent<HTMLInputElement>);
                }

                if (inputRef.current) {
                    inputRef.current.focus();
                }
            },
            [onChange, controlled, value, onInput],
        );

        const filteredOptions = filterOptions(options, value, match);

        const isAutocomplete = autocomplete || Boolean(match);

        return (
            <BaseSelect
                {...restProps}
                ref={ref}
                Option={Option}
                Field={TagList}
                Optgroup={Optgroup}
                OptionsList={OptionsList}
                Arrow={Arrow}
                multiple={true}
                fieldProps={{
                    value,
                    inputRef,
                    autocomplete: isAutocomplete,
                    onInput,
                    handleDeleteTag,
                }}
                selected={selected || selectedTags}
                onChange={handleChange}
                autocomplete={isAutocomplete}
                size={size}
                options={filteredOptions}
            />
        );
    },
);
