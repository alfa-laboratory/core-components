import React, { useState, useEffect, useCallback, RefObject, ReactNode, useRef } from 'react';
import NodeResolver from 'react-node-resolver';

let prevInputMethod: 'mouse' | 'keyboard';

const handleKeyDown = () => {
    prevInputMethod = 'keyboard';
};

const handleMouseDown = () => {
    prevInputMethod = 'mouse';
};

/**
 * Навешивает несколько глобальных обработчиков и отслеживает метод ввода - мышь или клавиатура.
 * Note: Повторный вызов функции не дублирует обработчики
 */
function addGlobalListeners() {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('touchstart', handleMouseDown);
}

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

    useEffect(() => {
        addGlobalListeners();
    }, []);

    return {
        focused,
    };
}

type KeyboardFocusableProps = {
    /**
     * Рендер-проп, в который передается состояние фокуса
     */
    children?: (focused: boolean) => ReactNode;
};

export const KeyboardFocusable = ({ children }: KeyboardFocusableProps) => {
    const targetRef = useRef<HTMLElement | null>(null);

    const { focused } = useKeyboardFocusable(targetRef);

    const handleTargetRef = useCallback(node => {
        targetRef.current = node;
    }, []);

    return <NodeResolver innerRef={handleTargetRef}>{children && children(focused)}</NodeResolver>;
};
