import { ReactElement, ComponentType } from 'react';
import { TagProps } from '@alfalab/core-components-tag';

export type SelectedId = string | number;

export type Gaps = {
    /**
     * Управление размером отступов между заголовками (desktop only)
     */
    gaps?: 'default' | 'wide';
};

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
     * Внешний вид заголовков табов
     */
    view?: 'primary' | 'secondary';

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
    Tablist: ComponentType<TablistProps>;

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

export type SecondaryTablistProps = TablistProps & {
    tagSize?: TagProps['size'];
};

export type UseTabsProps = TablistProps;

export type Styles = {
    styles: { [key: string]: string };
};
