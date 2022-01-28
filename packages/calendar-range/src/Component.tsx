import React, { FC } from 'react';
import { CalendarInputProps } from '@alfalab/core-components-calendar-input';

import { CalendarRangePopover } from './views/popover';
import { CalendarRangeStatic } from './views/static';

export type CalendarRangeProps = {
    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Значение инпута (используется и для календаря)
     */
    valueFrom?: string;

    /**
     * Значение инпута (используется и для календаря)
     */
    valueTo?: string;

    /**
     * Месяц в календаре по умолчанию
     */
    defaultMonth?: number;

    /**
     * Минимальная дата, доступная для выбора (timestamp)
     */
    minDate?: number;

    /**
     * Максимальная дата, доступная для выбора (timestamp)
     */
    maxDate?: number;

    /**
     * Обработчик изменения даты от
     */
    onDateFromChange?: (payload: { date: number | null; value: string }) => void;

    /**
     * Обработчик изменения даты до
     */
    onDateToChange?: (payload: { date: number | null; value: string }) => void;

    /**
     * Список событий
     */
    events?: Array<Date | number>;

    /**
     * Список выходных
     */
    offDays?: Array<Date | number>;

    /**
     * Пропсы для инпута даты от
     */
    inputFromProps?: CalendarInputProps;

    /**
     * Пропсы для инпута даты до
     */
    inputToProps?: CalendarInputProps;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;

    /**
     * Определяет, как рендерить календарь — в поповере или снизу инпута
     */
    calendarPosition?: 'static' | 'popover';
};

export const CalendarRange: FC<CalendarRangeProps> = ({
    calendarPosition = 'static',
    ...restProps
}) => {
    const View = calendarPosition === 'popover' ? CalendarRangePopover : CalendarRangeStatic;
    return <View {...restProps} />;
};
