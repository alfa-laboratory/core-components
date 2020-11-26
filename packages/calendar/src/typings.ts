export type SpecialDays = Record<number, boolean>;

export type Day = {
    date: Date;

    disabled?: boolean;

    event?: boolean;

    selected?: boolean;
};

export type Month = {
    date: Date;

    disabled?: boolean;
};

export type DateShift =
    | 'prev'
    | 'prevWeek'
    | 'prevMonth'
    | 'startOfWeek'
    | 'next'
    | 'nextWeek'
    | 'nextMonth'
    | 'endOfWeek';

export type View = 'years' | 'months' | 'days';
