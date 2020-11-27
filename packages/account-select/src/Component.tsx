import React, { forwardRef, useCallback, useMemo } from 'react';
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

    /**
     * Обработчик кнопки выбора всех элементов из списка
     */
    onSelectAll?: () => void;

    /**
     * Обработчик кнопки удаления элемента (крестик из чипсов)
     */
    onDeleteTag: (tag: string) => void;

    /**
     * Мод для компонента, если single - обычный дивчик с текстом
     */
    view: 'single' | 'multiple';
};

export const AccountSelect = forwardRef<HTMLInputElement, AccountSelectProps>(props => {
    const {
        label,
        options,
        selected,
        multiple,
        onSelectAll,
        placeholder,
        onDeleteTag,
        view = 'multiple',
    } = props;

    const { selectedTags } = useMemo(() => {
        const tags: string[] = [];
        (selected as OptionShape[]).forEach(selectedOption => {
            const {
                value: { number },
            } = selectedOption;
            tags.push(number);
        });
        return { selectedTags: tags };
    }, [selected]);

    const isTitlesVisible = useMemo(() => !selected || selected.length === 0, [selected]);

    const renderOptionsList = useCallback(
        optionsListProps => (
            <OptionList {...optionsListProps} onSelectAll={onSelectAll} multiple={multiple} />
        ),
        [multiple, onSelectAll],
    );

    if (view === 'single') {
        return (
            <Option
                index={0}
                view={view}
                option={options[0] as OptionShape}
                innerProps={{
                    id: '',
                    role: '',
                    onClick: () => [],
                    onMouseDown: () => [],
                    onMouseMove: () => [],
                }}
            />
        );
    }
    return (
        <InputAutocomplete
            {...props}
            Arrow={Arrow}
            Option={optionProps => <Option {...optionProps} />}
            OptionsList={renderOptionsList}
            inputProps={{
                leftAddons: <TagList selectedTags={selectedTags} onDeleteTag={onDeleteTag} />,
                className: isTitlesVisible ? styles.input : styles.inputFilled,
                addonsClassName: styles.addons,
            }}
            label={isTitlesVisible ? label : ''}
            placeholder={isTitlesVisible ? placeholder : ''}
        />
    );
});

AccountSelect.defaultProps = {
    view: 'multiple',
};
