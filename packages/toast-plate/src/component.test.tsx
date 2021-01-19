import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { ToastPlate } from './index';

jest.useFakeTimers();

describe('Notification', () => {
    describe('Snapshots tests', () => {
        it('should match snapshot', () => {
            const { baseElement } = render(
                <ToastPlate badge='positive' title='title'>
                    text
                </ToastPlate>,
            );

            expect(baseElement).toMatchSnapshot();
        });

        it('should match snapshot with leftAddons', () => {
            const { baseElement } = render(<ToastPlate leftAddons={<div>leftAddons</div>} />);

            expect(baseElement).toMatchSnapshot();
        });

        it('should match snapshot without icon', () => {
            const { baseElement } = render(<ToastPlate title='title'>text</ToastPlate>);

            expect(baseElement).toMatchSnapshot();
        });
    });

    it('should set `data-test-id` attribute', () => {
        const dataTestId = 'test-id';
        const { getByTestId } = render(<ToastPlate dataTestId={dataTestId} />);

        expect(getByTestId(dataTestId).tagName).toBe('DIV');
    });

    it('should forward ref', () => {
        const ref = jest.fn();
        const dataTestId = 'test-id';
        const { getByTestId } = render(<ToastPlate ref={ref} dataTestId={dataTestId} />);

        expect(ref.mock.calls).toEqual([[getByTestId(dataTestId)]]);
    });

    describe('Classes tests', () => {
        it('should set `className` class', () => {
            const className = 'test-class';
            const dataTestId = 'test-id';
            const { getByTestId } = render(<ToastPlate className={className} dataTestId={dataTestId} />);

            const el = getByTestId(dataTestId);

            expect(el).toHaveClass(className);
        });

        it('should set `hasCloser` class', () => {
            const dataTestId = 'test-id';
            const { getByTestId } = render(<ToastPlate hasCloser={true} dataTestId={dataTestId} />);

            const el = getByTestId(dataTestId);

            expect(el).toHaveClass('hasCloser');
        });
    });

    describe('Callbacks tests', () => {
        it('should call `onClose` prop', async () => {
            const cb = jest.fn();
            const dataTestId = 'test-id';
            const { getByTestId } = render(
                <ToastPlate hasCloser={true} onClose={cb} dataTestId={dataTestId} />,
            );

            const el = getByTestId(dataTestId);
            const closeEl = el.querySelector('[aria-label="закрыть"]') as Element;

            fireEvent.click(closeEl);

            expect(cb).toBeCalledTimes(1);
        });
    });

    it('should unmount without errors', () => {
        const { unmount } = render(<ToastPlate />);

        expect(unmount).not.toThrowError();
    });
});
