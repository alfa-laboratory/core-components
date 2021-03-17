import {
    ReactNode,
    FC,
    RefAttributes,
    AriaAttributes,
    FocusEvent,
    MouseEvent,
    ReactElement,
} from 'react';
import { PopoverProps } from '@alfalab/core-components-popover';

export type OptionShape = {
    /**
     * Текстовое представление пункта
     */
    key: string;

    /**
     * Контент, который будет отрисован в выпадающем списке и в поле при выборе
     */
    content?: ReactNode;

    /**
     * Блокирует данный пункт для выбора
     */
    disabled?: boolean;

    /**
     * Дополнительные данные
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value?: any;
};

export type GroupShape = {
    /**
     * Заголовок группы
     */
    label?: string;

    /**
     * Дочерние элементы
     */
    options: OptionShape[];
};

export type BaseSelectProps = {
    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Дополнительный класс для поля
     */
    fieldClassName?: string;

    /**
     * Дополнительный класс выпадающего меню
     */
    optionsListClassName?: string;

    /**
     * Дополнительный класс для пункта меню
     */
    optionClassName?: string;

    /**
     * Список вариантов выбора
     */
    options: Array<OptionShape | GroupShape>;

    /**
     * Атрибут id
     */
    id?: string;

    /**
     * Атрибут name
     */
    name?: string;

    /**
     * Управление возможностью выбора значения
     */
    disabled?: boolean;

    /**
     * Начальное состояние селекта
     */
    defaultOpen?: boolean;

    /**
     * Возможность выбрать несколько значений
     */
    multiple?: boolean;

    /**
     * Размер компонента
     */
    size?: 's' | 'm' | 'l' | 'xl';

    /**
     * Растягивает компонент на ширину контейнера
     */
    block?: boolean;

    /**
     * Управляет шириной выпадающего меню.
     * Ширину определяет контент, либо ширина равна ширине поля
     */
    optionsListWidth?: 'content' | 'field';

    /**
     * Лейбл поля
     */
    label?: ReactNode;

    /**
     * Плейсхолдер поля
     */
    placeholder?: string;

    /**
     * Отображение ошибки
     */
    error?: string | boolean;

    /**
     * Подсказка под полем
     */
    hint?: string;

    /**
     * Возможность использовать селект как input-autocomplete
     */
    autocomplete?: boolean;

    /**
     * Позволяет снять выбранное значение
     */
    allowUnselect?: boolean;

    /**
     * Закрывать меню после выбора?
     */
    closeOnSelect?: boolean;

    /**
     * При навигации с клавиатуры переходить от последнего пункта меню к первому и наоборот.
     */
    circularNavigation?: boolean;

    /**
     * Запрещает поповеру менять свою позицию.
     * Например, если места снизу недостаточно,то он все равно будет показан снизу
     */
    preventFlip?: boolean;

    /**
     * Список value выбранных пунктов (controlled-селект)
     */
    selected?: Array<string | OptionShape> | string | OptionShape | null;

    /**
     * Рендерит нативный селект вместо выпадающего меню. (на десктопе использовать только с multiple=false)
     */
    nativeSelect?: boolean;

    /**
     * Позиционирование выпадающего списка
     */
    popoverPosition?: PopoverProps['position'];

    /**
     * Количество видимых пунктов меню (5 = 5.5)
     */
    visibleOptions?: number;

    /**
     * Кастомный рендер выбранного пункта
     */
    valueRenderer?: ({
        selected,
        selectedMultiple,
    }: {
        selected?: OptionShape;
        selectedMultiple: OptionShape[];
    }) => ReactNode;

    /**
     * Компонент стрелки
     */
    Arrow?: FC<ArrowProps> | null | false;

    /**
     * Компонент поля
     */
    Field?: FC<FieldProps>;

    /**
     * Пропсы, которые будут прокинуты в компонент поля
     */
    fieldProps?: unknown;

    /**
     * Пропсы, которые будут прокинуты в компонент списка
     */
    optionsListProps?: unknown;

    /**
     * Пропсы, которые будут прокинуты в компонент пункта меню
     */
    optionProps?: unknown;

    /**
     * Компонент выпадающего меню
     */
    OptionsList?: FC<OptionsListProps>;

    /**
     * Компонент группы
     */
    Optgroup?: FC<OptgroupProps>;

    /**
     * Компонент пункта меню
     */
    Option?: FC<OptionProps>;

    /**
     * Обработчик выбора
     */
    onChange?: (payload: {
        selected: OptionShape | null;
        selectedMultiple: OptionShape[];
        name?: string;
    }) => void;

    /**
     * Обработчик открытия\закрытия селекта
     */
    onOpen?: (payload: { open?: boolean; name?: string }) => void;

    /**
     * Обработчик фокуса поля
     */
    onBlur?: (event: FocusEvent<HTMLDivElement | HTMLInputElement>) => void;

    /**
     * Обработчик блюра поля
     */
    onFocus?: (event: FocusEvent<HTMLDivElement | HTMLInputElement>) => void;

    /**
     * Хранит функцию, с помощью которой можно обновить положение поповера
     */
    updatePopover?: PopoverProps['update'];

    /**
     * Показывать OptionsList, если он пустой
     */
    showEmptyOptionsList?: boolean;
};

// TODO: использовать InputProps
export type FieldProps = {
    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Размер компонента
     */
    size?: 's' | 'm' | 'l' | 'xl';

    /**
     * Выбранный пункт
     */
    selected?: OptionShape;

    /**
     * Список выбранных пунктов
     */
    selectedMultiple?: OptionShape[];

    /**
     * Флаг, можно ли выбрать несколько значений
     */
    multiple?: boolean;

    /**
     * Флаг, открыто ли меню
     */
    open?: boolean;

    /**
     * Флаг, поле заблокировано
     */
    disabled?: boolean;

    /**
     * Лейбл поля
     */
    label?: ReactNode;

    /**
     * Плейсхолдер поля
     */
    placeholder?: string;

    /**
     * Отображение ошибки
     */
    error?: string | boolean;

    /**
     * Отображение иконки успеха
     */
    success?: boolean;

    /**
     * Подсказка под полем
     */
    hint?: string;

    /**
     * Компонент стрелки
     */
    Arrow?: ReactElement | false | null;

    /**
     * Кастомный рендер выбранного пункта
     */
    valueRenderer?: BaseSelectProps['valueRenderer'];

    /**
     * Внутренние свойства, которые должны быть установлены компоненту.
     */
    innerProps: {
        onBlur?: (event: FocusEvent<HTMLDivElement | HTMLInputElement>) => void;
        onFocus?: (event: FocusEvent<HTMLDivElement | HTMLInputElement>) => void;
        onClick?: (event: MouseEvent<HTMLDivElement | HTMLInputElement>) => void;
        tabIndex: number;
        id: string;
    } & RefAttributes<HTMLDivElement | HTMLInputElement> &
        AriaAttributes;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export type ArrowProps = {
    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Флаг, открыто ли меню
     */
    open?: boolean;
};

export type OptionsListProps = {
    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Размер компонента
     */
    size?: 's' | 'm' | 'l' | 'xl';

    /**
     * Компонент пункта меню
     */
    Option: (props: { option: OptionShape; index: number }) => JSX.Element | null;

    /**
     * Список вариантов выбора
     */
    options?: Array<OptionShape | GroupShape>;

    /**
     * Плоский список пунктов меню (например, нужно для виртуализации)
     */
    flatOptions?: OptionShape[];

    /**
     * Индекс выделенного пункта
     */
    highlightedIndex?: number;

    /**
     * Флаг, открыто ли меню
     */
    open?: boolean;

    /**
     * Компонент группы
     */
    Optgroup?: BaseSelectProps['Optgroup'];

    /**
     * Будет отображаться, если компонент пустой
     */
    emptyPlaceholder?: string;

    /**
     * Количество видимых пунктов меню (5 = 5.5)
     */
    visibleOptions?: number;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export type OptgroupProps = {
    /**
     * Размер компонента
     */
    size?: 's' | 'm' | 'l' | 'xl';

    /**
     * Заголовок группы
     */
    label?: string;

    /**
     * Дочерние элементы
     */
    children?: ReactNode;
};

export type OptionProps = {
    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Размер компонента
     */
    size?: 's' | 'm' | 'l' | 'xl';

    /**
     * Контент пункта меню
     */
    children?: ReactNode;

    /**
     * Данные пункта меню
     */
    option: OptionShape;

    /**
     * Индект пункта
     */
    index: number;

    /**
     * Флаг, выбран ли данный пункт
     */
    selected?: boolean;

    /**
     * Флаг, подсвечен ли данный пункт
     */
    highlighted?: boolean;

    /**
     * Флаг, заблокирован ли данный пункт
     */
    disabled?: boolean;

    /**
     * Компонент пункта меню
     */
    Checkmark?: FC<CheckmarkProps>;

    /**
     * Внутренние свойства, которые должны быть установлены компоненту.
     */
    innerProps: {
        id: string;
        onClick: (event: MouseEvent<HTMLDivElement>) => void;
        onMouseDown: (event: MouseEvent<HTMLDivElement>) => void;
        onMouseMove: (event: MouseEvent<HTMLDivElement>) => void;
        role: string;
    } & RefAttributes<HTMLDivElement> &
        AriaAttributes;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export type CheckmarkProps = {
    /**
     * Флаг, данный пункт выбран
     */
    selected?: boolean;
};
