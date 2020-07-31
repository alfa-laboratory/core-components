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
