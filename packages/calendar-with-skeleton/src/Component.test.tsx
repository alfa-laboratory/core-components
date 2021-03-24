import React from 'react';
import { render } from '@testing-library/react';

import { CalendarWithSkeleton } from './Component';

jest.useFakeTimers();

describe('Calendar', () => {
    describe('Render tests', () => {
        test('should render skeleton when calendarVisible=`false`', () => {
            const { container } = render(<CalendarWithSkeleton calendarVisible={false} />);

            jest.advanceTimersByTime(300);

            expect(container).toMatchSnapshot();
        });

        test('should render calendar when calendarVisible=`true`', () => {
            const { container } = render(<CalendarWithSkeleton calendarVisible={true} />);

            expect(container).toMatchSnapshot();
        });

        test('should unmount without errors', () => {
            const { unmount } = render(<CalendarWithSkeleton />);

            expect(unmount).not.toThrowError();
        });
    });
});
