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
     * Дополнительный класс
     */
    className?: string;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};
