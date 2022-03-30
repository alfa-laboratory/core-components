import { CurrencyCodes } from '@alfalab/data';
import { ReactNode } from 'react';

export type AmountProps = {
    /**
     * Денежное значение в минорных единицах
     */
    value: number;

    /**
     * Валюта
     */
    currency?: CurrencyCodes;

    /**
     * Слот справа
     */
    rightAddons?: ReactNode;

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
     * Управление жирностью
     */
    bold?: 'full' | 'major' | 'none';

    /**
     * Делает минорную часть полупрозрачной
     */
    transparentMinor?: boolean;

    /**
     * Показывать значок + для положительных значений
     */
    showPlus?: boolean;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};
