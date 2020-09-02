import { ReactNode, FC, HTMLAttributes, RefAttributes } from 'react';

export type OptionShape = {
    /**
     * Значение выбранного пункта (например, для отправки на сервер)
     */
    value: string | number;

    /**
     * Текстовое представление пункта
     */
    text: string;

    /**
     * Контент, который будет отрендерен в выпадающем списке и в поле при выборе
     */
    content?: ReactNode;

    /**
     * Блокирует данный пункт для выбора
     */
    disabled?: boolean;
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
     * Дополнительный класс
     */
    className?: string;

    /**
     * Список вариантов выбора
     */
    options: Array<OptionShape | GroupShape>;

    /**
     * Атрибут name
     */
    name?: string;

    /**
     * Управление возможностью выбора значения
     */
    disabled?: boolean;

    /**
     * Возможность выбрать несколько значений
     */
    multiple?: boolean;

    /**
     * Размер компонента
     */
    size?: 's' | 'm' | 'l';

    /**
     * Растягивает компонент на ширину контейнера
     */
    block?: boolean;

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
     * Список value выбранных пунктов (controlled-селект)
     */
    selected?: Array<OptionShape['value']>;

    /**
     * Рендерит нативный селект вместо выпадающего меню. (на десктопе использовать только с multiple=false)
     */
    nativeSelect?: boolean;

    /**
     * Смещение выпадающего меню по вертикали
     */
    popoverOffset?: number;

    /**
     * Компонент стрелки
     */
    Arrow?: FC<ArrowProps>;

    /**
     * Компонент поля
     */
    Field?: FC<FieldProps>;

    /**
     * Пропсы, которые будут прокинуты в компонент поля
     */
    fieldProps?: unknown;

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
        selected?: Array<OptionShape['value']>;
        selectedOptions?: OptionShape[];
        name?: string;
    }) => void;

    /**
     * Обработчик открытия\закрытия селекта
     */
    onOpen?: (payload: { open?: boolean; name?: string }) => void;
};

export type FieldProps = {
    /**
     * Размер компонента
     */
    size?: 's' | 'm' | 'l';

    /**
     * Список выбранных пунктов
     */
    selectedItems?: OptionShape[];

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
     * Компонент стрелки
     */
    Arrow?: ReactNode;

    /**
     * Кастомный рендер выбранного пункта
     */
    valueRenderer?: (options: OptionShape[]) => ReactNode;

    /**
     * Внутренние свойства, которые должны быть установлены компоненту.
     */
    innerProps?: HTMLAttributes<HTMLElement> & RefAttributes<HTMLDivElement | HTMLInputElement>;
};

export type ArrowProps = {
    /**
     * Флаг, открыто ли меню
     */
    open?: boolean;
};

export type OptionsListProps = {
    /**
     * Размер компонента
     */
    size?: 's' | 'm' | 'l';

    /**
     * Компонент пункта меню
     */
    Option: (props: Pick<OptionProps, 'option' | 'index'>) => JSX.Element;

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
};

export type OptgroupProps = {
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
     * Размер компонента
     */
    size?: 's' | 'm' | 'l';

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
};
