import { ReactNode, ChangeEvent, FC } from 'react';

export type OptionShape = {
    /**
     * Значение выбранного пункта (например, для отправки на сервер)
     */
    value: string;

    /**
     * Контент, который будет отрендерен в выпадающем списке и в поле при выборе
     */
    text?: ReactNode;

    /**
     * Текст для нативного option (nativeSelect)
     */
    nativeText?: string;

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
    Arrow?: FC<BaseArrowProps>;

    /**
     * Компонент поля
     */
    Field?: FC<BaseFieldProps>;

    /**
     * Компонент выпадающего меню
     */
    OptionsList?: FC<BaseOptionsListProps>;

    /**
     * Компонент группы
     */
    Optgroup?: FC<BaseOptgroupProps>;

    /**
     * Компонент пункта меню
     */
    Option?: FC<BaseOptionProps>;

    /**
     * Обработчик выбора
     */
    onChange?: (
        event?: ChangeEvent,
        payload?: {
            selected?: OptionShape | OptionShape[];
            value?: string | number | Array<string | number>;
            name?: string;
        },
    ) => void;

    /**
     * Обработчик открытия\закрытия селекта
     */
    onOpen?: (payload?: { open?: boolean; name?: string }) => void;
};

export type BaseFieldProps = {
    /**
     * Размер компонента
     */
    size?: 's' | 'm' | 'l';

    /**
     * Список выбранных пунктов
     */
    selected: OptionShape[];

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
     * Флаг, есть ли выбранные пункты
     */
    filled?: boolean;

    /**
     * Флаг, поле находится в фокусе
     */
    focused?: boolean;

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
     * Апи для управления открытием меню
     */
    toggleMenu: () => void;

    /**
     * Компонент стрелки
     */
    Arrow?: BaseSelectProps['Arrow'];
};

export type BaseArrowProps = {
    /**
     * Флаг, открыто ли меню
     */
    open?: boolean;
};

export type BaseOptionsListProps = {
    /**
     * Размер компонента
     */
    size?: 's' | 'm' | 'l';

    /**
     * Компонент пункта меню
     */
    children: (props: Pick<BaseOptionProps, 'option' | 'index'>) => ReactNode;

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

export type BaseOptgroupProps = {
    /**
     * Заголовок группы
     */
    label?: string;

    /**
     * Дочерние элементы
     */
    children?: ReactNode;
};

export type BaseOptionProps = {
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
