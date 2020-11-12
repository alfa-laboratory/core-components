import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Button } from '@alfalab/core-components-button';

import { Notification } from './index';

jest.useFakeTimers();

describe('Notification', () => {
    describe('Snapshots tests', () => {
        it('should match snapshot', () => {
            const { container } = render(
                <Notification icon='positive' title='title'>
                    text
                </Notification>,
            );

            expect(container).toMatchSnapshot();
        });

        it('should match snapshot with leftAddons', () => {
            const { container } = render(<Notification leftAddons={<div>leftAddons</div>} />);

            expect(container).toMatchSnapshot();
        });
    });

    it('should forward ref', () => {
        const ref = jest.fn();
        const dataTestId = 'test-id';
        const { getByTestId } = render(<Notification ref={ref} dataTestId={dataTestId} />);

        expect(ref.mock.calls).toEqual([[getByTestId(dataTestId)]]);
    });

    it('should set `data-test-id` attribute', () => {
        const dataTestId = 'test-id';
        const { getByTestId } = render(<Notification dataTestId={dataTestId} />);

        expect(getByTestId(dataTestId).tagName).toBe('DIV');
    });

    describe('Classes tests', () => {
        it('should set `className` class', () => {
            const className = 'test-class';
            const dataTestId = 'test-id';
            const { getByTestId } = render(
                <Notification className={className} dataTestId={dataTestId} />,
            );

            const el = getByTestId(dataTestId);

            expect(el).toHaveClass(className);
        });

        it('should set `hasCloser` class', () => {
            const dataTestId = 'test-id';
            const { getByTestId } = render(
                <Notification hasCloser={true} dataTestId={dataTestId} />,
            );

            const el = getByTestId(dataTestId);

            expect(el).toHaveClass('hasCloser');
        });

        it('should set `visible` class', () => {
            const dataTestId = 'test-id';
            const { getByTestId } = render(<Notification visible={true} dataTestId={dataTestId} />);

            const el = getByTestId(dataTestId);

            expect(el).toHaveClass('isVisible');
        });

        it('should set `positive` class if `icon` prop is `positive`', () => {
            const icon = 'positive';
            const { container } = render(<Notification icon={icon} />);

            expect(container.querySelector('.icon')).toHaveClass(icon);
        });
    });

    describe('Callbacks tests', () => {
        it('should call `onClose` prop', async () => {
            const cb = jest.fn();
            const dataTestId = 'test-id';
            const { getByTestId } = render(
                <Notification hasCloser={true} onClose={cb} dataTestId={dataTestId} />,
            );

            const el = getByTestId(dataTestId);
            const closeEl = el.querySelector('.closer') as Element;

            fireEvent.click(closeEl);

            expect(cb).toBeCalledTimes(1);
        });

        it('should call `onCloseTimeout` prop', async () => {
            const cb = jest.fn();
            const dataTestId = 'test-id';
            const { getByTestId } = render(
                <Notification
                    autoCloseDelay={100}
                    onCloseTimeout={cb}
                    visible={true}
                    dataTestId={dataTestId}
                />,
            );

            const el = getByTestId(dataTestId);

            fireEvent.mouseEnter(el);
            fireEvent.mouseLeave(el);

            jest.advanceTimersByTime(100);

            expect(cb).toBeCalledTimes(1);
        });

        it('should call `onMouseEnter` prop', async () => {
            const cb = jest.fn();
            const dataTestId = 'test-id';
            const { getByTestId } = render(
                <Notification onMouseEnter={cb} dataTestId={dataTestId} />,
            );

            const el = getByTestId(dataTestId);

            fireEvent.mouseEnter(el);

            expect(cb).toBeCalledTimes(1);
        });

        it('should call `onMouseLeave` prop', async () => {
            const cb = jest.fn();
            const dataTestId = 'test-id';
            const { getByTestId } = render(
                <Notification onMouseLeave={cb} dataTestId={dataTestId} />,
            );

            const el = getByTestId(dataTestId);

            fireEvent.mouseLeave(el);

            expect(cb).toBeCalledTimes(1);
        });

        it('should call `onClickOutside` prop', async () => {
            const cb = jest.fn();
            const dataTestId = 'btn-test-id';
            const { getByTestId } = render(
                <div>
                    <Button dataTestId={dataTestId}>btn</Button>
                    <Notification onClickOutside={cb} visible={true} />
                </div>,
            );

            const el = getByTestId(dataTestId);

            fireEvent.click(el);

            expect(cb).toBeCalledTimes(1);
        });
    });

    it('should unmount without errors', () => {
        const { unmount } = render(<Notification />);

        expect(unmount).not.toThrowError();
    });
});
