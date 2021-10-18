import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { Scrollbar } from './index';
import { ScrollbarProps } from './Component';

const renderScrollbar = (props?: ScrollbarProps) => (
    <Scrollbar {...props}>
        <div
            style={{
                height: '200px',
            }}
        />
    </Scrollbar>
);

describe('Scrollbar', () => {
    describe('Display tests', () => {
        it('should display correctly', () => {
            const dataTestId = 'test-id';

            const { container } = render(renderScrollbar({ dataTestId }));

            expect(container).toMatchSnapshot();
        });
    });

    it('should call onScroll', async () => {
        const onScroll = jest.fn();

        const dataTestId = 'test-id';

        const { getByTestId } = render(renderScrollbar({ onScroll, dataTestId }));

        fireEvent.scroll(getByTestId(dataTestId));

        expect(onScroll).toBeCalledTimes(1);
    });
});
