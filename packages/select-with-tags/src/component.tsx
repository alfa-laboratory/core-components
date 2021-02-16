import React, { ChangeEvent, forwardRef, useCallback, useState, useRef } from 'react';
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
            autocomplete = true,
            match,
            allowUnselect = true,
            collapseTagList = false,
            moveInputToNewLine = true,
            emptyListPlaceholder = 'Ничего не найдено',
            collapsedTagText,
            Tag,
            ...restProps
        },
        ref,
    ) => {
        const controlled = Boolean(selected);

        const [selectedTags, setSelectedTags] = useState(selected || []);
        const [isPopoverOpen, setPopoverOpen] = useState<boolean | undefined>(false);
        const updatePopover = useRef(() => null);

        const resetValue = useCallback(() => {
            const event = { target: { value: '' } };

            onInput(event as ChangeEvent<HTMLInputElement>);
        }, [onInput]);

        const handleUpdatePopover = useCallback(() => {
            if (updatePopover && updatePopover.current) {
                updatePopover.current();
            }
        }, []);

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
                    resetValue();
                }
            },
            [onChange, controlled, value, resetValue],
        );

        const handleOpen = useCallback<Required<BaseSelectProps>['onOpen']>(
            ({ open }) => {
                if (!open && value) {
                    resetValue();
                }
                setPopoverOpen(open);
            },
            [resetValue, value],
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
                updatePopover={updatePopover}
                allowUnselect={allowUnselect}
                showEmptyOptionsList={true}
                fieldProps={{
                    value,
                    autocomplete: isAutocomplete,
                    onInput,
                    handleDeleteTag,
                    Tag,
                    collapseTagList,
                    moveInputToNewLine,
                    collapsedTagText,
                    handleUpdatePopover,
                    isPopoverOpen,
                }}
                optionsListProps={{
                    emptyPlaceholder: emptyListPlaceholder,
                }}
                selected={selected || selectedTags}
                autocomplete={isAutocomplete}
                size={size}
                options={filteredOptions}
                onChange={handleChange}
                onOpen={handleOpen}
            />
        );
    },
);
