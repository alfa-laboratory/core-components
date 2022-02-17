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
