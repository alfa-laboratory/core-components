import { createContext } from 'react';

/**
 * Набор констант для z-index соответствующих классов компонентов.
 * Значения выбраны по приоритету.
 */
export const stackingOrder = {
    /**
     * Для компонентов с возможностью фокуса: кнопки, поля ввода
     */
    FOCUSED: 2,

    /**
     * Значение по-умолчанию
     */
    DEFAULT: 10,

    /**
     * Компоненты, которые управляют своей позицией, например, поповер, тултип
     */
    POPOVER: 50,

    /**
     * Для модальных окон с оверлеем
     */
    MODAL: 100,

    /**
     * Для тостов и нотификаций
     */
    TOAST: 1000,
};

export const StackingContext = createContext(stackingOrder.DEFAULT);
