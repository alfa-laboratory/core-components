import { ReactElement, ComponentType } from 'react';

export type SelectedId = string | number;

export type TabsProps = {
    /**
     * Id активного таба
     */
    selectedId?: SelectedId;

    /**
     * Рендерить неактивные табы
     */
    keepMounted?: boolean;

    /**
     * Рендерить заголовки табов в контейнере со скроллом
     */
    scrollable?: boolean;

    /**
     * Компоненты табов
     */
    children: Array<ReactElement<TabProps>>;

    /**
     * Компонент заголовков табов
     */
    TabList: ComponentType<TablistProps>;

    /**
     * Обработчик переключения табов
     */
    onChange?: (event: MouseEvent, payload: { selectedId: SelectedId }) => void;
};

export type TabProps = {
    /**
     * Id таба
     */
    id: SelectedId;

    /**
     * Заголовок таба
     */
    title: string;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Управление видимостью таба
     */
    hidden?: boolean;

    /**
     * Рендерить таб, если он неактивен
     */
    keepMounted?: boolean;

    /**
     * Контент таба
     */
    children: ReactNode;
};

export type TablistProps = Pick<TabsProps, 'selectedId' | 'scrollable' | 'onChange'> & {
    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Заголовки табов
     */
    titles: Array<{
        title: string;
        id: SelectedId;
    }>;
};

export type UseTabsProps = TabsListProps;
