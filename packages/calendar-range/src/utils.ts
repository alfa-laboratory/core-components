import { dateInLimits } from '@alfalab/core-components-calendar';
import { parseDateString } from '@alfalab/core-components-calendar-input';

export type ValueState = {
    date: number | null;
    value: string;
};

export const initialValueState = { date: null, value: '' };

export const getCorrectValueState = (
    stateValue: ValueState,
    propValue?: string,
    minDate?: number,
    maxDate?: number,
) => {
    const state: ValueState =
        propValue === undefined
            ? stateValue
            : { value: propValue, date: parseDateString(propValue).getTime() };

    if (!dateInLimits(state.date, minDate, maxDate)) {
        state.date = null;
    }

    return state;
};

export const isDayButton = (node: HTMLElement | null) =>
    node && node.tagName === 'BUTTON' && node.dataset.date;

export type PickPeriod = 'in-future' | 'in-past';

export const isEmptyDate = (date: ValueState): boolean => !date.value || !date.date;
