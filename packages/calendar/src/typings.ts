export type SpecialDays = Record<number, boolean>;

export type Day = {
    date: Date;

    disabled?: boolean;

    event?: boolean;

    off?: boolean;

    today?: boolean;
};

export type Month = {
    date: Date;

    disabled?: boolean;
};
