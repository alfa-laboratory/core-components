import React, { useContext, FC, ReactNode } from 'react';

import { StackingContext, stackingOrder } from './context';

export type StackProps = {
    /**
     * Render prop, в который передается функция.
     * Функция принимает аргумент со значением z-index из текущего контекста.
     */
    children: (value: number) => ReactNode;

    /**
     * Исходное значение для z-index.
     * @default 5
     */
    value?: number;
};

export const Stack: FC<StackProps> = ({ children, value = stackingOrder.DEFAULT }) => {
    const previousValue = useContext(StackingContext);
    const currentValue = Math.max(value, previousValue);
    const nextValue = currentValue + 1;

    return (
        <StackingContext.Provider value={nextValue}>
            {children(currentValue)}
        </StackingContext.Provider>
    );
};
