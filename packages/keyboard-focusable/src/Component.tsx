import React, { useState, useEffect, useCallback, RefObject, ReactNode } from 'react';
import NodeResolver from 'react-node-resolver';

let prevInputMethod: 'mouse' | 'keyboard';

if (typeof document !== 'undefined') {
    /**
     * Навешиваем несколько глобальных обработчиков и отслеживаем метод ввода - мышь или клавиатура
     */

    document.addEventListener('keydown', () => {
        prevInputMethod = 'keyboard';
    });

    const handleMouseDown = () => {
        prevInputMethod = 'mouse';
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('touchstart', handleMouseDown);
}

type KeyboardFocusableProps = {
    /**
     * Рендер-проп, в который передается состояние фокуса
     */
    children?: (focused: boolean) => ReactNode;
};

export const KeyboardFocusable = ({ children }: KeyboardFocusableProps) => {
    const [focused, setFocused] = useState(false);

    const handleFocus = useCallback(() => {
        if (prevInputMethod === 'keyboard') {
            setFocused(true);
        }
    }, []);

    const handleBlur = useCallback(() => {
        setFocused(false);
    }, []);

    const handleTargetRef = useCallback(
        node => {
            if (node) {
                node.addEventListener('focusin', handleFocus);
                node.addEventListener('focusout', handleBlur);
            }
        },
        [handleBlur, handleFocus],
    );

    return <NodeResolver innerRef={handleTargetRef}>{children && children(focused)}</NodeResolver>;
};

export function useKeyboardFocusable(ref: RefObject<HTMLElement>) {
    const [focused, setFocused] = useState(false);

    const handleFocus = useCallback(() => {
        if (prevInputMethod === 'keyboard') {
            setFocused(true);
        }
    }, []);

    const handleBlur = useCallback(() => {
        setFocused(false);
    }, []);

    useEffect(() => {
        const node = ref.current;

        if (node) {
            node.addEventListener('focusin', handleFocus);
            node.addEventListener('focusout', handleBlur);
        }

        return () => {
            if (node) {
                node.removeEventListener('focusin', handleFocus);
                node.removeEventListener('focusout', handleBlur);
            }
        };
    }, [handleBlur, handleFocus, ref]);

    return {
        focused,
    };
}
