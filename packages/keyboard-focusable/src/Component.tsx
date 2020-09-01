/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, RefObject } from 'react';

import { useFocus } from '@alfalab/hooks';

type KeyboardFocusableProps = {
    /**
     * Рендер-проп, в который передается состояние фокуса и реф.
     *
     * Реф нужно установить на интерактивный элемент или на одного из его родителей.
     */
    children: (ref: RefObject<any>, focused: boolean) => JSX.Element;
};

export const KeyboardFocusable = ({ children }: KeyboardFocusableProps) => {
    const targetRef = useRef<HTMLElement | null>(null);

    const [focused] = useFocus(targetRef, 'keyboard');

    return children(targetRef, focused);
};
