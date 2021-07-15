export const IS_BROWSER = typeof window !== 'undefined';
export const SUPPORTS_INPUT_TYPE_DATE = IS_BROWSER && isInputDateSupported();

/**
 * Возвращает `true`, если поддерживается `input[type="date"]`
 */
export function isInputDateSupported() {
    const input = document.createElement('input');
    const value = 'a';

    input.setAttribute('type', 'date');
    input.setAttribute('value', value);

    return input.value !== value;
}
