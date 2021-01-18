import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { Toast } from './index';

jest.useFakeTimers();

describe('Notification', () => {
    describe('Snapshots tests', () => {
        it('should match snapshot', () => {
            const { baseElement } = render(
                <Toast icon='positive' title='title'>
                    text
                </Toast>,
            );

            expect(baseElement).toMatchSnapshot();
        });

        it('should match snapshot with leftAddons', () => {
            const { baseElement } = render(<Toast leftAddons={<div>leftAddons</div>} />);

            expect(baseElement).toMatchSnapshot();
        });

        it('should match snapshot without icon', () => {
            const { baseElement } = render(<Toast title='title'>text</Toast>);

            expect(baseElement).toMatchSnapshot();
        });
    });

    it('should set `data-test-id` attribute', () => {
        const dataTestId = 'test-id';
        const { getByTestId } = render(<Toast dataTestId={dataTestId} />);

        expect(getByTestId(dataTestId).tagName).toBe('DIV');
    });

    it('should forward ref', () => {
        const ref = jest.fn();
        const dataTestId = 'test-id';
        const { getByTestId } = render(<Toast ref={ref} dataTestId={dataTestId} />);

        expect(ref.mock.calls).toEqual([[getByTestId(dataTestId)]]);
    });

    describe('Classes tests', () => {
        it('should set `className` class', () => {
            const className = 'test-class';
            const dataTestId = 'test-id';
            const { getByTestId } = render(<Toast className={className} dataTestId={dataTestId} />);

            const el = getByTestId(dataTestId);

            expect(el).toHaveClass(className);
        });

        it('should set `hasCloser` class', () => {
            const dataTestId = 'test-id';
            const { getByTestId } = render(<Toast hasCloser={true} dataTestId={dataTestId} />);

            const el = getByTestId(dataTestId);

            expect(el).toHaveClass('hasCloser');
        });

        it('should set `positive` class if `icon` prop is `positive`', () => {
            const icon = 'positive';
            const { baseElement } = render(<Toast icon={icon} />);

            expect(baseElement.querySelector('.icon')).toHaveClass(icon);
        });

        it('should set `negative` class if `icon` prop is `negative`', () => {
            const icon = 'negative';
            const { baseElement } = render(<Toast icon={icon} />);

            expect(baseElement.querySelector('.icon')).toHaveClass(icon);
        });

        it('should set `warning` class if `icon` prop is `warning`', () => {
            const icon = 'warning';
            const { baseElement } = render(<Toast icon={icon} />);

            expect(baseElement.querySelector('.icon')).toHaveClass(icon);
        });
    });

    describe('Callbacks tests', () => {
        it('should call `onClose` prop', async () => {
            const cb = jest.fn();
            const dataTestId = 'test-id';
            const { getByTestId } = render(
                <Toast hasCloser={true} onClose={cb} dataTestId={dataTestId} />,
            );

            const el = getByTestId(dataTestId);
            const closeEl = el.querySelector('[aria-label="закрыть"]') as Element;

            fireEvent.click(closeEl);

            expect(cb).toBeCalledTimes(1);
        });
    });

    it('should unmount without errors', () => {
        const { unmount } = render(<Toast />);

        expect(unmount).not.toThrowError();
    });
});
