/* eslint-disable */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { TrapFocus } from './index';

describe('TrapFocus', () => {
    const sharedProps = {
        getDoc: () => document,
        isEnabled: () => true,
    };

    let initialFocus: HTMLButtonElement;
    beforeEach(() => {
        initialFocus = document.createElement('button');
        initialFocus.tabIndex = 0;
        document.body.appendChild(initialFocus);
        initialFocus.focus();
    });

    afterEach(() => {
        document.body.removeChild(initialFocus as Node);
    });

    it('should return focus to the children', () => {
        const { getByTestId } = render(
            <TrapFocus open={true} {...sharedProps}>
                <div tabIndex={-1} data-test-id='modal'>
                    <input autoFocus={true} data-test-id='auto-focus' />
                </div>
            </TrapFocus>,
        );

        expect(getByTestId('auto-focus')).toHaveFocus();

        initialFocus.focus();
        expect(getByTestId('modal')).toHaveFocus();
    });

    it('should not return focus to the children when disableEnforceFocus is true', () => {
        const { getByTestId } = render(
            <TrapFocus open disableEnforceFocus {...sharedProps}>
                <div tabIndex={-1}>
                    <input autoFocus data-test-id='auto-focus' />
                </div>
            </TrapFocus>,
        );

        expect(getByTestId('auto-focus')).toHaveFocus();

        initialFocus.focus();

        expect(initialFocus).toHaveFocus();
    });

    it('should warn if the modal content is not focusable', () => {
        console.error = jest.fn();
        const UnfocusableDialog = React.forwardRef<HTMLDivElement>((_, ref) => <div ref={ref} />);

        render(
            <TrapFocus open {...sharedProps}>
                <UnfocusableDialog />
            </TrapFocus>,
        );

        expect(console.error).toBeCalledTimes(1);
        expect(console.error).toBeCalledWith(
            expect.stringContaining(
                'core-components: The modal content node does not accept focus',
            ),
        );
    });

    it('should not attempt to focus nonexistent children', () => {
        const EmptyDialog = () => null;

        render(
            <TrapFocus open {...sharedProps}>
                <EmptyDialog />
            </TrapFocus>,
        );
    });

    it('should loop the tab key', () => {
        const wrapper = render(
            <TrapFocus open {...sharedProps}>
                <div tabIndex={-1} data-test-id='modal'>
                    <div>Title</div>
                    <button type='button'>x</button>
                    <button type='button'>cancel</button>
                    <button type='button'>ok</button>
                </div>
            </TrapFocus>,
        );

        fireEvent.keyDown(wrapper.getByTestId('modal'), {
            keyCode: 13, // Enter
        });
        fireEvent.keyDown(wrapper.getByTestId('modal'), {
            keyCode: 9, // Tab
        });

        expect(wrapper.getByTestId('sentinelStart')).toHaveFocus();

        initialFocus.focus();
        fireEvent.keyDown(wrapper.getByTestId('modal'), {
            keyCode: 9, // Tab
            shiftKey: true,
        });

        expect(wrapper.getByTestId('sentinelEnd')).toHaveFocus();
    });

    describe('', () => {
        const withRemovableElement = ({ hideButton } = { hideButton: false }) => (
            <TrapFocus open={true} {...sharedProps}>
                <div tabIndex={-1} role='dialog'>
                    {!hideButton && <button type='button'>I am going to disappear</button>}
                </div>
            </TrapFocus>
        );

        beforeAll(() => {
            jest.useFakeTimers();
        });

        afterAll(() => {
            jest.clearAllTimers();
        });

        it('should contains the focus if the active element is removed', () => {
            const { getByRole, rerender } = render(withRemovableElement());
            const dialog = getByRole('dialog');
            const toggleButton = getByRole('button', { name: 'I am going to disappear' });
            expect(dialog).toHaveFocus();

            toggleButton.focus();
            expect(toggleButton).toHaveFocus();

            rerender(withRemovableElement({ hideButton: true }));
            expect(dialog).not.toHaveFocus();
            jest.advanceTimersByTime(100); // wait for the interval check to kick in.
            expect(dialog).toHaveFocus();
        });
    });
});
