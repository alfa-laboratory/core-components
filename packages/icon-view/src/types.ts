import { ReactNode } from 'react';

export type ShapeProps = {
    /**
     * Размер компонента
     */
    size?: '48' | '64' | '80' | '128';

    /**
     * Цвет заливки
     */
    backgroundColor?: string;

    /**
     * Видимость бордера
     */
    border?: boolean;

    /**
     * Фоновое изображение. Имеет приоритет над иконкой и заливкой
     */
    imageUrl?: string;

    /**
     * Сss класс для стилизации общей обёртки
     */
    className?: string;

    /**
     * Слот сверху
     */
    topAddons?: ReactNode;

    /**
     * Слот снизу
     */
    bottomAddons?: ReactNode;
};
