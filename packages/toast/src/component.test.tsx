import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as popoverModule from '@alfalab/core-components-popover';
import { Toast } from './index';

describe('Toast', () => {
    jest.useFakeTimers();

    const baseProps = {
        open: true,
        onClose: jest.fn(),
    };

    const getPortalContainer = () => {
        if (document.querySelector('#portalContainer')) {
            return document.querySelector('#portalContainer') as HTMLElement;
        }

        const portalContainer = document.createElement('div');
        portalContainer.setAttribute('id', 'portalContainer');
        document.body.appendChild(portalContainer);
        return portalContainer;
    };

    describe('Snapshots tests', () => {
        it('should match snapshot when open', () => {
            const { baseElement } = render(<Toast {...baseProps}>text</Toast>);

            expect(baseElement).toMatchSnapshot();
        });

        it('should match snapshot when closed', () => {
            const { baseElement } = render(
                <Toast {...baseProps} open={false}>
                    text
                </Toast>,
            );

            expect(baseElement).toMatchSnapshot();
        });

        it('should math snapshot when prop `anchorElement` is passed', () => {
            const anchorElement = document.createElement('div');
            document.body.appendChild(anchorElement);

            const { baseElement } = render(
                <Toast {...baseProps} anchorElement={anchorElement}>
                    text
                </Toast>,
            );

            expect(baseElement).toMatchSnapshot();
        });
    });

    it('should set `className` class', () => {
        const className = 'test-class';

        render(
            <Toast {...baseProps} className={className} getPortalContainer={getPortalContainer} />,
        );

        expect(getPortalContainer().firstElementChild).toHaveClass(className);
    });

    it('should pass props to Popover', () => {
        const popoverComponentSpy = jest.spyOn(popoverModule, 'Popover');

        const anchorElement = document.createElement('div');
        document.body.appendChild(anchorElement);

        const popoverProps: Partial<popoverModule.PopoverProps> = {
            position: 'top',
            offset: [5, 5],
            open: true,
            getPortalContainer,
            anchorElement,
            /*
             * todo: почему-то preventFlip и transition не прокидываются, хотя указаны в типах пропсов. Нужно либо прокинуть либо убрать из типов
             * preventFlip: false,
             * transition: { timeout: 200 }
             */
        };

        render(<Toast {...baseProps} anchorElement={anchorElement} {...popoverProps} />);

        const popoverLastCall =
            popoverComponentSpy.mock.calls[popoverComponentSpy.mock.calls.length - 1];

        expect(popoverLastCall[0]).toMatchObject(popoverProps);
    });

    it('should set bottomOffset', () => {
        render(<Toast {...baseProps} bottomOffset={10} getPortalContainer={getPortalContainer} />);

        const toastPlate = getPortalContainer().firstElementChild as HTMLElement;

        expect(toastPlate).toHaveStyle('bottom: 10px');
    });

    it('should forward ref to ToastPlate wrapper', () => {
        const ref = jest.fn();

        render(<Toast {...baseProps} ref={ref} />);

        expect(ref.mock.calls[0][0].tagName).toBe('DIV');
    });

    describe('Callback tests', () => {
        it('should call onClose when click outside', () => {
            const onClose = jest.fn();
            render(<Toast onClose={onClose} open={true} getPortalContainer={getPortalContainer} />);

            userEvent.click(getPortalContainer().firstElementChild as HTMLElement);
            expect(onClose).not.toBeCalled();

            userEvent.click(document.body);
            expect(onClose).toBeCalled();
        });

        it('should call onClose after delay', () => {
            const onClose = jest.fn();
            render(<Toast onClose={onClose} open={true} autoCloseDelay={3000} />);

            jest.advanceTimersByTime(2500);
            expect(onClose).not.toBeCalled();

            jest.advanceTimersByTime(3500);
            expect(onClose).toBeCalled();
        });

        it('should not call onClose if mouse is over ToastPlate', () => {
            const onClose = jest.fn();
            render(
                <Toast
                    onClose={onClose}
                    open={true}
                    autoCloseDelay={3000}
                    getPortalContainer={getPortalContainer}
                />,
            );

            const toastPlate = getPortalContainer().firstElementChild as HTMLElement;

            jest.advanceTimersByTime(2500);
            userEvent.hover(toastPlate);
            jest.advanceTimersByTime(5000);

            expect(onClose).not.toBeCalled();
        });

        it('should call onClose after mouse left ToastPlate', () => {
            const onClose = jest.fn();
            render(
                <Toast
                    onClose={onClose}
                    open={true}
                    autoCloseDelay={3000}
                    getPortalContainer={getPortalContainer}
                />,
            );

            const toastPlate = getPortalContainer().firstElementChild as HTMLElement;

            jest.advanceTimersByTime(2500);
            userEvent.hover(toastPlate);
            userEvent.unhover(toastPlate);
            jest.advanceTimersByTime(5000);

            expect(onClose).toBeCalled();
        });

        it('should not call onClose if touch ToastPlate', () => {
            const onClose = jest.fn();
            render(
                <Toast
                    onClose={onClose}
                    open={true}
                    autoCloseDelay={3000}
                    getPortalContainer={getPortalContainer}
                />,
            );

            const toastPlate = getPortalContainer().firstElementChild as HTMLElement;

            jest.advanceTimersByTime(2500);
            fireEvent.touchStart(toastPlate);
            jest.advanceTimersByTime(5000);

            expect(onClose).not.toBeCalled();
        });
    });

    it('should unmount without errors', () => {
        const { unmount } = render(<Toast {...baseProps} />);

        expect(unmount).not.toThrowError();
    });
});
