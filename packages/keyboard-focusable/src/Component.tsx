import React, { useState, useEffect, useCallback, RefObject } from 'react';
import NodeResolver from 'react-node-resolver';

let prevInputMethod: 'mouse' | 'keyboard';

if (typeof window !== 'undefined') {
    /**
     * Навешиваем несколько глобальных обработчиков и отслеживаем метод ввода - мышь или клавиатура
     */

    window.addEventListener('keydown', () => {
        prevInputMethod = 'keyboard';
    });

    const handleMouseDown = () => {
        prevInputMethod = 'mouse';
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('touchstart', handleMouseDown);
}

type KeyboardFocusableProps = {
    children?: (focused: boolean) => void;
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
        if (ref.current) {
            ref.current.addEventListener('focusin', handleFocus);
            ref.current.addEventListener('focusout', handleBlur);
        }
    }, [handleBlur, handleFocus, ref]);

    return {
        focused,
    };
}
