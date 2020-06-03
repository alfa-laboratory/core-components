import { ReactNode, ChangeEvent, ComponentType } from 'react';

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
     * Компонент поля
     */
    Field: ComponentType<BaseFieldProps>;

    /**
     * Компонент выпадающего меню
     */
    OptionsList: ComponentType<BaseOptionsListProps>;

    /**
     * Компонент группы
     */
    Optgroup: ComponentType<BaseOptgroupProps>;

    /**
     * Компонент пункта меню
     */
    Option: ComponentType<BaseOptionProps>;

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

export type BaseFieldProps = Pick<BaseSelectProps, 'multiple' | 'disabled'> & {
    /**
     * Список выбранных пунктов
     */
    value: OptionShape[];

    /**
     * Флаг, открыто ли меню
     */
    open?: boolean;

    /**
     * Флаг, есть ли выбранные пункты
     */
    filled?: boolean;

    /**
     * Флаг, поле находится в фокусе
     */
    focused?: boolean;
};

export type BaseArrowProps = {
    /**
     * Флаг, открыто ли меню
     */
    open?: boolean;
};

export type BaseOptionsListProps = Pick<BaseSelectProps, 'multiple' | 'options' | 'Optgroup'> & {
    /**
     * Список пунктов меню
     */
    children: (props: Pick<BaseOptionProps, 'option' | 'index'>) => ReactNode;

    /**
     * Плоский список пунктов меню (например, нужно для виртуализации)
     */
    flatOptions: OptionShape[];

    /**
     * Индекс выделенного пункта
     */
    highlightedIndex: number;

    /**
     * Флаг, открыто ли меню
     */
    open: boolean;
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
