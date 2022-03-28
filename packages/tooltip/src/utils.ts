import { useCallback, useRef, useState } from 'react';

export function useControlled<T>(controlledValue: T, defaultValue: T): [T, (value: T) => void] {
    const { current: isControlled } = useRef<boolean>(controlledValue !== undefined);
    const [uncontrolledValue, setUncontrolledValue] = useState<T>(defaultValue);
    const value = isControlled ? controlledValue : uncontrolledValue;

    const setValueIfUncontrolled = useCallback(
        (newValue: T) => {
            if (!isControlled) {
                setUncontrolledValue(newValue);
            }
        },
        [isControlled],
    );

    return [value, setValueIfUncontrolled];
}
