import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Button } from '@alfalab/core-components-button';

import { Notification } from './index';

jest.useFakeTimers();

describe('Notification', () => {
    describe('Snapshots tests', () => {
        const onClose = jest.fn();

        it('should match snapshot', () => {
            const { baseElement } = render(
                <Notification badge='positive' title='title' onClose={onClose}>
                    text
                </Notification>,
            );

            expect(baseElement).toMatchSnapshot();
        });
    });

    it('should set `data-test-id` attribute', () => {
        const dataTestId = 'test-id';
        const { getByTestId } = render(<Notification dataTestId={dataTestId} />);

        expect(getByTestId(dataTestId).tagName).toBe('DIV');
    });

    it('should forward ref', () => {
        const ref = jest.fn();
        const dataTestId = 'test-id';
        const { getByTestId } = render(<Notification ref={ref} dataTestId={dataTestId} />);

        expect(ref.mock.calls).toEqual([[getByTestId(dataTestId)]]);
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

        it('should set `visible` class', () => {
            const dataTestId = 'test-id';
            const { getByTestId } = render(<Notification visible={true} dataTestId={dataTestId} />);

            const el = getByTestId(dataTestId);

            expect(el).toHaveClass('isVisible');
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
            const closeEl = el.querySelector('[aria-label="закрыть"]') as Element;

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

        it('should not call `onClickOutside` if clicked inside', async () => {
            const cb = jest.fn();
            const dataTestId = 'test-id';
            const { getByTestId } = render(
                <Notification onClickOutside={cb} visible={true} dataTestId={dataTestId} />,
            );

            const el = getByTestId(dataTestId);

            fireEvent.click(el);
            fireEvent.click(el.firstElementChild as HTMLElement);

            expect(cb).toBeCalledTimes(0);
        });

        it('should not call `onClickOutside` if clicked inside another', async () => {
            const cb = jest.fn();
            const dataTestId = 'test-id';
            const { getByTestId } = render(
                <div>
                    <Notification visible={true} dataTestId={dataTestId} />
                    <Notification onClickOutside={cb} visible={true} />
                </div>,
            );

            const el = getByTestId(dataTestId);

            fireEvent.click(el);
            fireEvent.click(el.firstElementChild as HTMLElement);

            expect(cb).toBeCalledTimes(0);
        });
    });

    it('should unmount without errors', () => {
        const { unmount } = render(<Notification />);

        expect(unmount).not.toThrowError();
    });
});
