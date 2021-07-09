export function permitCaretOnCountryCode(input: HTMLInputElement, countryCodeLength: number) {
    function resetCaret() {
        const selectionStart = input.selectionStart || 0;

        if (selectionStart < countryCodeLength) {
            input.focus();
            input.setSelectionRange(countryCodeLength, countryCodeLength);
        }
    }

    input.addEventListener('input', resetCaret);
    input.addEventListener('click', resetCaret);
}
