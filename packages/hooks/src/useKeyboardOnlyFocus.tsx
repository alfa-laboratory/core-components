import styles from './useKeyboardOnlyFocus.css';

export function useKeyboardOnlyFocus() {
    return {
        wrapperProps: {
            className: styles.wrapper,
            tabIndex: 0,
        },

        focusProps: {
            className: styles.focus,
            tabIndex: -1,
        },
    };
}
