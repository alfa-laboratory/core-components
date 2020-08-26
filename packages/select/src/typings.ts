import { ReactNode, FC, HTMLAttributes } from 'react';

export type OptionShape = {
    /**
     * Значение выбранного пункта (например, для отправки на сервер)
     */
    value: string;

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

export type SelectProps = {
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
     * Список выбранных пунктов (controlled-селект)
     */
    selected?: OptionShape | OptionShape[];

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
    fieldProps?: Record<string, unknown>;

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
        selected?: OptionShape | OptionShape[];
        value?: string | number | Array<string | number>;
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
    selectedItems: OptionShape[];

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
     * Атрибут name
     */
    name?: string;

    /**
     * Компонент стрелки
     */
    Arrow?: ReactNode;

    /**
     * Кастомный рендер выбранного пункта
     */
    valueRenderer?: (options: OptionShape[]) => ReactNode;

    /**
     * Слот справа (иконка)
     */
    rightAddons?: ReactNode;

    /**
     * Внутренние свойства, которые должны быть установлены компоненту.
     */
    innerProps: HTMLAttributes;
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
    Optgroup?: SelectProps['Optgroup'];
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
