import { useCalendarMaxMinDates } from './useCalendarMaxMinDates';

const inputProps = {
    maxDate: 1625388108613,
    minDate: 1624524108613,
    monthFrom: 1622494800000,
    monthTo: 1622494800000,
};

describe('useCalendarMaxMinDates', () => {
    describe('isPopover', () => {
        it('no selected to date', () => {
            const maxMinDates = useCalendarMaxMinDates({
                isPopover: true,
                selectedFrom: 1625000400000,
                ...inputProps,
            });

            expect(maxMinDates).toMatchSnapshot();
        });
        it('no selected dates', () => {
            const maxMinDates = useCalendarMaxMinDates({
                isPopover: true,
                ...inputProps,
            });

            expect(maxMinDates).toMatchSnapshot();
        });
    });
    it('no min date', () => {
        const maxMinDates = useCalendarMaxMinDates({
            isPopover: false,
            ...inputProps,
            minDate: undefined,
        });

        expect(maxMinDates).toMatchSnapshot();
    });
    it('no max date', () => {
        const maxMinDates = useCalendarMaxMinDates({
            isPopover: false,
            ...inputProps,
            maxDate: undefined,
        });

        expect(maxMinDates).toMatchSnapshot();
    });
});
