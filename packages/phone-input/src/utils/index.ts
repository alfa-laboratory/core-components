/**
 * Удаляет форматирование номера телефона
 * @param phone Номер телефона
 */

export const deleteFormatting = (phone: string) =>
    phone
        .replace('+', '')
        .replace(/^7/, '')
        .replace(/\s/g, '')
        .replace(/-/g, '');

export function setCaretPosition({
    position,
    inputRef,
}: {
    position: number;
    inputRef: React.RefObject<HTMLInputElement>;
}) {
    window.requestAnimationFrame(() => {
        if (inputRef === null || !inputRef.current) return;

        inputRef.current.setSelectionRange(position, position);
    });
}
