import { ReactNode } from 'react';

export type ShapeProps = {
    /**
     * Цвет заливки
     */
    backgroundColor?: string;

    /**
     * Видимость обводки
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
