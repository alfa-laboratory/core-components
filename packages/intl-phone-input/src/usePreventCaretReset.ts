import { RefObject, useCallback, useEffect } from 'react';

type Args = {
    inputRef: RefObject<HTMLInputElement>;
    countryCodeLength: number;
    clearableCountryCode: boolean;
};

export function usePreventCaretReset({ inputRef, clearableCountryCode, countryCodeLength }: Args) {
    const handleDeleteChar = useCallback(
        (event: KeyboardEvent) => {
            const input = event.target as HTMLInputElement;
            const caretPosition = input.selectionStart;

            if (event.key === 'ArrowRight' || event.key === 'ArrowLeft' || !caretPosition) return;

            if (!clearableCountryCode && caretPosition <= countryCodeLength) {
                event.preventDefault();
                return;
            }

            const newPosition = event.key === 'Backspace' ? caretPosition - 1 : caretPosition + 1;

            requestAnimationFrame(() => {
                input.setSelectionRange(newPosition, newPosition);
            });
        },
        [clearableCountryCode, countryCodeLength],
    );

    useEffect(() => {
        const input = inputRef.current;

        if (!input) return;

        input.addEventListener('keydown', handleDeleteChar);

        // eslint-disable-next-line consistent-return
        return () => {
            input.removeEventListener('keydown', handleDeleteChar);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleDeleteChar]);
}
