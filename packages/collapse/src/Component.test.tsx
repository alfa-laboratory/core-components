import React, { ReactElement } from 'react';
import { render, fireEvent, screen } from '@testing-library/react';

import { Collapse, CollapseProps } from './index';

const paragraph = (
    <p style={{ margin: '0 0 16px 0' }}>
        Альфа-Банк, основанный в 1990 году, является универсальным банком, осуществляющим все
        основные виды банковских операций, представленных на рынке финансовых услуг, включая
        обслуживание частных и корпоративных клиентов, инвестиционный банковский бизнес, торговое
        финансирование и т.д.
    </p>
);

// TODO: more tests
describe('Collapse', () => {
    describe('Display tests', () => {
        it('should display with children like boolean or string or others react children type correctly', () => {
            const { container } = render(<Collapse>{paragraph}</Collapse>);

            expect(container).toMatchSnapshot();
        });

        it('should display radio group with one child correctly', () => {
            const { container } = render(
                <Collapse collapsedLabel='Показать'>{paragraph}</Collapse>,
            );

            expect(container).toMatchSnapshot();
        });

        it('should call onExpandedChange prop when clicked', () => {
            const handleExpandedChange = jest.fn();

            render(
                <Collapse
                    collapsedLabel='подробнее'
                    expanded={false}
                    onExpandedChange={handleExpandedChange}
                >
                    {paragraph}
                </Collapse>,
            );

            fireEvent.click(screen.getByText(/подробнее/i));
            expect(handleExpandedChange).toHaveBeenCalledTimes(1);
        });

        beforeAll(() => {
            jest.useFakeTimers();
        });

        afterAll(() => {
            jest.clearAllTimers();
        });

        it('should call onAnimationStart and onAnimationStart props', () => {
            const onAnimationStart = jest.fn();
            const onAnimationEnd = jest.fn();
            const enteringTransitionDuration = 300;

            const collapse = (props: Partial<CollapseProps>, children: ReactElement) => (
                <Collapse {...props}>{children}</Collapse>
            );

            const defaultProps = {
                collapsedLabel: 'подробнее',
                onAnimationStart,
                onAnimationEnd,
                expanded: false,
            };

            const { rerender } = render(collapse(defaultProps, paragraph));
            rerender(collapse({ ...defaultProps, expanded: true }, paragraph));

            expect(onAnimationStart).toHaveBeenCalledTimes(1);
            jest.advanceTimersByTime(enteringTransitionDuration);
            expect(onAnimationEnd).toHaveBeenCalledTimes(1);
        });
    });
});
