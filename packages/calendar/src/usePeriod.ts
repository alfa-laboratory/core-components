import { useCallback, useState } from 'react';
import { useDidUpdateEffect } from './utils';

type usePeriodProps = {
    /**
     * Обработчик изменения выделенного периода
     */
    onPeriodChange?: (selectedFrom?: number, selectedTo?: number) => void;
};

export function usePeriod({ onPeriodChange }: usePeriodProps) {
    const [selectedFrom, setSelectedFrom] = useState<number>();
    const [selectedTo, setSelectedTo] = useState<number>();

    const resetPeriod = useCallback(() => {
        setSelectedFrom(undefined);
        setSelectedTo(undefined);
    }, []);

    const setStart = useCallback((date?: number) => {
        setSelectedFrom(date);
    }, []);

    const setEnd = useCallback((date?: number) => {
        setSelectedTo(date);
    }, []);

    const updatePeriod = useCallback(
        (date?: number) => {
            // сбрасываем выделение
            if (date === undefined) {
                resetPeriod();
                return;
            }

            // начинаем выделение
            if (!selectedFrom) {
                setSelectedFrom(date);
                return;
            }

            // заканчиваем выделение
            if (!selectedTo) {
                setSelectedFrom(Math.min(date, selectedFrom));
                setSelectedTo(Math.max(date, selectedFrom));
                return;
            }

            // если новая дата за выделенным периодом — расширяем интервал
            if (date > selectedFrom) {
                setSelectedTo(date);
                return;
            }

            /**
             * если новая дата находится раньше начала выделения —
             * сбрасываем конец периода и начинаем выделение с этой даты
             */
            if (date < selectedFrom) {
                setSelectedTo(undefined);
                setSelectedFrom(date);
            }
        },
        [resetPeriod, selectedFrom, selectedTo],
    );

    useDidUpdateEffect(() => {
        if (onPeriodChange) {
            onPeriodChange(selectedFrom, selectedTo);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFrom, selectedTo]);

    return {
        selectedFrom,
        selectedTo,
        setStart,
        setEnd,
        resetPeriod,
        updatePeriod,
    };
}
