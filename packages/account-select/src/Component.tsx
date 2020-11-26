import React, { forwardRef, useMemo } from 'react';
import { Arrow, OptionShape } from '@alfalab/core-components-select';
import {
    InputAutocomplete,
    InputAutocompleteProps,
} from '@alfalab/core-components-input-autocomplete';
import { Option } from './components/option';
import { TagList } from './components/tag-list';
import { OptionList } from './components/option-list';
import styles from './index.module.css';

export type AccountSelectProps = InputAutocompleteProps & {
    selected: OptionShape[];
    onSelectAll?: () => void;
    onDeleteTag: (tag: string) => void;
};

export const AccountSelect = forwardRef<HTMLInputElement, AccountSelectProps>(props => {
    const { selected, onSelectAll, multiple, placeholder, label, onDeleteTag } = props;

    const { selectedTags, selectedKeys } = useMemo(() => {
        const tags: string[] = [];
        const keys: string[] = [];
        selected.forEach(selectedOption => {
            const {
                key,
                value: { number },
            } = selectedOption;
            tags.push(number);
            keys.push(key);
        });
        return { selectedTags: tags, selectedKeys: keys };
    }, [selected]);

    const isTitlesVisible = useMemo(() => !selected || selected.length === 0, [selected]);

    return (
        <InputAutocomplete
            {...props}
            Arrow={Arrow}
            Option={optionProps => <Option {...optionProps} />}
            OptionsList={optionsListProps => (
                <OptionList {...optionsListProps} onSelectAll={onSelectAll} multiple={multiple} />
            )}
            inputProps={{
                leftAddons: <TagList selectedTags={selectedTags} onDeleteTag={onDeleteTag} />,
                className: isTitlesVisible ? styles.input : styles.inputFilled,
                addonsClassName: styles.addons,
            }}
            selected={selectedKeys}
            label={isTitlesVisible ? label : ''}
            placeholder={isTitlesVisible ? placeholder : ''}
        />
    );
});
