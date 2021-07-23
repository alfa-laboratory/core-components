import { useCallback, useEffect, RefObject } from 'react';

type Args = {
    inputRef: RefObject<HTMLInputElement>;
    countryCodeLength: number;
    clearableCountryCode: boolean;
};

export function useCaretAvoidCountryCode({
    inputRef,
    countryCodeLength,
    clearableCountryCode,
}: Args) {
    const input = inputRef.current;

    const moveCaretFromCountryCode = useCallback(() => {
        if (!input) return;

        const selectionStart = input.selectionStart || 0;

        if (selectionStart < countryCodeLength) {
            input.focus();
            input.setSelectionRange(countryCodeLength, countryCodeLength);
        }
    }, [input, countryCodeLength]);

    const preventCaretMovingOnCountryCode = useCallback(
        (event: KeyboardEvent) => {
            if (!input) return;

            const selectionStart = input.selectionStart || 0;
            const toLeftKey = event.keyCode === 37;

            if (toLeftKey && selectionStart <= countryCodeLength) {
                event.preventDefault();
            }
        },
        [input, countryCodeLength],
    );

    useEffect(() => {
        if (!input || clearableCountryCode) return;

        input.addEventListener('click', moveCaretFromCountryCode);
        input.addEventListener('keydown', preventCaretMovingOnCountryCode);

        // eslint-disable-next-line consistent-return
        return () => {
            input.removeEventListener('click', moveCaretFromCountryCode);
            input.removeEventListener('keydown', preventCaretMovingOnCountryCode);
        };
    }, [clearableCountryCode, input, preventCaretMovingOnCountryCode, moveCaretFromCountryCode]);
}
