import React from 'react';

// TODO: перенести в alfalab/utils

/**
 * passes {value} to {ref}
 *
 * WARNING: Be sure to only call this inside a callback that is passed as a ref.
 * Otherwise make sure to cleanup previous {ref} if it changes. See
 * https://github.com/mui-org/material-ui/issues/13539
 *
 * useful if you want to expose the ref of an inner component to the public api
 * while still using it inside the component
 *
 * @param ref a ref callback or ref object if anything falsy this is a no-op
 * @param value
 */
export function setRef<T>(
    ref: React.RefObject<T> | ((instance: T | null) => void) | null | undefined,
    value: T | null,
): void {
    if (typeof ref === 'function') {
        ref(value);
    } else if (ref) {
        // eslint-disable-next-line no-param-reassign
        (ref as React.MutableRefObject<T | null>).current = value;
    }
}

export function useForkRef<T>(refA: React.Ref<T>, refB: React.Ref<T>): React.Ref<T> {
    /**
     * This will create a new function if the ref props change and are defined.
     * This means react will call the old forkRef with `null` and the new forkRef
     * with the ref. Cleanup naturally emerges from this behavior
     */
    return React.useMemo(() => {
        if (refA == null && refB == null) {
            return null;
        }
        return refValue => {
            setRef(refA as React.MutableRefObject<T>, refValue);
            setRef(refB as React.MutableRefObject<T>, refValue);
        };
    }, [refA, refB]);
}

export function ownerDocument(node: Element | Document | null) {
    return (node && node.ownerDocument) || document;
}
