import React from 'react';
import { render } from '@testing-library/react';

import { CalendarWithSkeleton } from './Component';

jest.useFakeTimers();

describe('Calendar', () => {
    const defaultValue = new Date('November 30, 2020 00:00:00').getTime();

    describe('Render tests', () => {
        test('should render skeleton when calendarVisible=`false`', () => {
            const { container } = render(
                <CalendarWithSkeleton value={defaultValue} calendarVisible={false} />,
            );

            jest.advanceTimersByTime(300);

            expect(container).toMatchSnapshot();
        });

        test('should render calendar when calendarVisible=`true`', () => {
            const { container } = render(
                <CalendarWithSkeleton value={defaultValue} calendarVisible={true} />,
            );

            expect(container).toMatchSnapshot();
        });

        test('should unmount without errors', () => {
            const { unmount } = render(<CalendarWithSkeleton value={defaultValue} />);

            expect(unmount).not.toThrowError();
        });
    });
});
