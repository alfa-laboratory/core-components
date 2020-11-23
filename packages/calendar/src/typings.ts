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
    | 'prev_week'
    | 'prev_month'
    | 'start_of_week'
    | 'next'
    | 'next_week'
    | 'next_month'
    | 'end_of_week';
