import { useCallback, useState } from 'react';
import { useDidUpdateEffect } from '@alfalab/hooks';
import { differenceInDays } from 'date-fns';

type usePeriodProps = {
    /**
     * Обработчик изменения выделенного периода
     */
    onPeriodChange?: (selectedFrom?: number, selectedTo?: number) => void;

    /**
     * Начальное значение начала выделенного периода
     */
    initialSelectedFrom?: number;

    /**
     * Начальное значение конца выделенного периода
     */
    initialSelectedTo?: number;
};

export function usePeriod({
    onPeriodChange,
    initialSelectedFrom,
    initialSelectedTo,
}: usePeriodProps) {
    const [selectedFrom, setSelectedFrom] = useState<number | undefined>(initialSelectedFrom);
    const [selectedTo, setSelectedTo] = useState<number | undefined>(initialSelectedTo);

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
            // сбрасываем начало, если выбранная дата совпадает с ним
            if (date === selectedFrom) {
                setSelectedFrom(undefined);
                return;
            }

            // сбрасываем конец, если выбранная дата совпадает с ним
            if (date === selectedTo) {
                setSelectedTo(undefined);
                return;
            }

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

            // сдвигаем тот конец выделения, который ближе к выбранной дате
            if (
                Math.abs(differenceInDays(date, selectedTo)) >
                Math.abs(differenceInDays(date, selectedFrom))
            ) {
                setSelectedFrom(date);
            } else {
                setSelectedTo(date);
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
