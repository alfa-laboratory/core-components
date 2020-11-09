import React from 'react';
import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { KeyboardFocusable } from './index';

describe('KeyboardFocusable', () => {
    const renderComponent = () =>
        render(
            <React.Fragment>
                <KeyboardFocusable>
                    {(ref, focused) => (
                        <button type='button' ref={ref}>
                            {focused ? 'focused' : ''}
                        </button>
                    )}
                </KeyboardFocusable>
                <button type='button'>second button</button>
            </React.Fragment>,
        );

    it('should display children', async () => {
        const { container } = render(<KeyboardFocusable>{() => <span />}</KeyboardFocusable>);

        expect(container.firstElementChild).toBeInTheDocument();
    });

    it('should pass `focused=false` by default', async () => {
        const { queryByText } = renderComponent();

        expect(queryByText('focused')).not.toBeInTheDocument();
    });

    it('should pass `focused=true` when child gets focus', async () => {
        const { queryByText } = renderComponent();

        await act(async () => {
            userEvent.tab();
        });

        expect(queryByText('focused')).toBeInTheDocument();
    });

    it('should pass `focused=false` when child loses focus', async () => {
        const { queryByText } = renderComponent();

        await act(async () => {
            userEvent.tab();
        });

        expect(queryByText('focused')).toBeInTheDocument();

        await act(async () => {
            userEvent.tab();
        });

        expect(queryByText('focused')).not.toBeInTheDocument();
    });

    it('should pass `focused=false` for non-interactive child', async () => {
        const { queryByText } = render(
            <KeyboardFocusable>
                {(ref, focused) => <div ref={ref}>{focused ? 'focused' : ''}</div>}
            </KeyboardFocusable>,
        );

        await act(async () => {
            userEvent.tab();
        });

        expect(queryByText('focused')).not.toBeInTheDocument();
    });

    it('should pass `focused=false` when child gets focus by mouse', async () => {
        const { queryByText, queryAllByRole } = renderComponent();

        const focusableButton = queryAllByRole('button')[0];

        userEvent.click(focusableButton);

        expect(queryByText('focused')).not.toBeInTheDocument();
    });
});
