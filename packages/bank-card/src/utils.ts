/**
 * Проверяет номер карты по алгоритму Луна
 *
 * @param cardNumber - номер карты
 *
 */
export function validateCardNumber(cardNumber: string) {
    const digits = cardNumber.replace(/\s+/g, '');
    let sum = 0;

    for (let i = 0; i < digits.length; i++) {
        let cardNum = parseInt(digits[i], 10);

        if (cardNum > 9) return false;

        if ((digits.length - i) % 2 === 0) {
            cardNum *= 2;

            if (cardNum > 9) {
                cardNum -= 9;
            }
        }

        sum += cardNum;
    }

    return sum % 10 === 0;
}
