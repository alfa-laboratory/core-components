import { ChangeEvent } from 'react';
import { BaseSelectProps, OptionShape } from '@alfalab/core-components-select';

export type OptionMatcher = (option: OptionShape, inputValue: string) => boolean;

export type SelectWithTagsProps = Omit<
    BaseSelectProps,
    'Field' | 'nativeSelect' | 'multiple' | 'autocomplete' | 'selected' | 'onChange'
> & {
    /**
     * Значение поля ввода
     */
    value: string;

    /**
     * Обработчик ввода
     */
    onInput: (event: ChangeEvent<HTMLInputElement>) => void;

    /**
     * Список выбранных пунктов (controlled-селект)
     */
    selected?: Array<OptionShape | string>;

    /**
     * Обработчик выбора
     */
    onChange?: (payload: { selectedMultiple: Array<OptionShape | string>; name?: string }) => void;

    /**
     * Режим автокомплита
     */
    autocomplete?: boolean;

    /**
     * Функция сравнения при поиске
     */
    match?: OptionMatcher;

    /**
     * Будет отображаться, если компонент списка пустой
     */
    emptyListPlaceholder?: string;
};
