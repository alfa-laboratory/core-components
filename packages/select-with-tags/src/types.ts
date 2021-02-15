import { ChangeEvent, FC } from 'react';
import { BaseSelectProps, OptionShape } from '@alfalab/core-components-select';
import { TagProps as TagPropsBase } from '@alfalab/core-components-tag';

export type OptionMatcher = (option: OptionShape, inputValue: string) => boolean;

export type TagProps = {
    option: OptionShape;
    handleDeleteTag?: (key: string) => void;
} & TagPropsBase;

export type TagComponent = FC<TagProps>;

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

    /**
     * Компонент Тэг
     */
    Tag?: TagComponent;

    /**
     * Показывать тэги только в одном ряду, а если не помещаются в один ряд - схлопнуть в одну кнопку
     */
    collapseTagList?: boolean;

    /**
     * Если текст не помещается в инпут, то нужно перенести инпут на новую строку.
     */
    moveInputToNewLine?: boolean;

    /**
     * Текст Компонента Тэг который отображает общее количество выбранных элементов
     */
    collapsedTagText?: (collapsedCount: number) => string;
};
