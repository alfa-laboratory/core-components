import { CurrencyCodes } from '@alfalab/data';

export type AmountProps = {
    /**
     * Денежное значение в минорных единицах
     */
    value: number;

    /**
     * Валюта
     */
    currency: CurrencyCodes;

    /**
     * Количество минорных единиц в валюте
     */
    minority: number;

    /**
     * default - не отображаем копейки, если их значение 0
     * withZeroMinorPart - отображаем копейки, даже если их значение равно 0
     */
    view?: 'default' | 'withZeroMinorPart';

    /**
     * Делает мажорную часть жирной
     */
    majorBold?: boolean;

    /**
     * Делает минорную часть жирной
     */
    minorBold?: boolean;

    /**
     * Вид минорной части
     * inherit — наследует стили мажорной части
     * transparent — делает минорную часть прозрачной
     */
    minorColor?: 'inherit' | 'transparent';

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Дополнительный класс для минорной части
     */
    minorClassName?: string;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};
