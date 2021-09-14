import React, { useState, forwardRef } from 'react';
import { fireEvent, render, waitFor, waitForElementToBeRemoved } from '@testing-library/react';

import { BottomSheet, BottomSheetProps, CLOSE_OFFSET } from '.';

const BottomSheetWrapper = forwardRef<HTMLDivElement, Partial<BottomSheetProps>>((props, ref) => {
    const [open, setOpen] = useState(props.open === undefined ? true : props.open);

    const handleClose = () => {
        setOpen(false);

        if (props.onClose) {
            props.onClose();
        }
    };

    return (
        <BottomSheet
            open={open}
            onClose={handleClose}
            ref={ref}
            title='Bottom sheet title'
            {...props}
        >
            {props.children || <div>Bottom sheet content</div>}
        </BottomSheet>
    );
});

const dataTestId = 'test-id';

let getBoundingClientRect: () => DOMRect;

const mockGetBoundingClientRect = (height: number) => {
    if (!getBoundingClientRect) {
        getBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
    }

    HTMLElement.prototype.getBoundingClientRect = () => ({
        height,
        width: 0,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        x: 0,
        y: 0,
        toJSON: () => '',
    });
};

const clearGetBoundingClientRect = () => {
    HTMLElement.prototype.getBoundingClientRect = getBoundingClientRect;
};

describe('Bottom sheet', () => {
    beforeAll(() => {
        mockGetBoundingClientRect(100);
    });

    afterAll(() => {
        clearGetBoundingClientRect();
    });

    describe('Snapshots tests', () => {
        it('should match snapshot', () => {
            const { baseElement } = render(<BottomSheetWrapper />);

            expect(baseElement).toMatchSnapshot();
        });

        it('should match snapshot with action button', () => {
            const { baseElement } = render(<BottomSheetWrapper actionButton={<div />} />);

            expect(baseElement).toMatchSnapshot();
        });
    });

    describe('Props tests', () => {
        it('should set `data-test-id` attribute', () => {
            const { getByTestId } = render(<BottomSheetWrapper dataTestId={dataTestId} />);

            expect(getByTestId(dataTestId).tagName).toBe('DIV');
            expect(getByTestId(dataTestId).getAttribute('role')).toBe('dialog');
        });

        it('should forward ref', () => {
            const ref = jest.fn();

            const { getByTestId } = render(
                <BottomSheetWrapper dataTestId={dataTestId} ref={ref} />,
            );

            expect(ref.mock.calls).toEqual([[getByTestId(dataTestId)]]);
        });

        it('should render content', () => {
            const text = 'BottomSheet';

            const { getByText } = render(<BottomSheetWrapper>{text}</BottomSheetWrapper>);

            expect(getByText(text)).toBeInTheDocument();
        });

        it('should be open, if open is `true`', () => {
            const text = 'BottomSheet';

            const { queryByText } = render(<BottomSheetWrapper>{text}</BottomSheetWrapper>);

            expect(queryByText(text)).toBeInTheDocument();
        });

        it('should be closed, if open is `false`', () => {
            const text = 'BottomSheet';

            const { queryByText } = render(
                <BottomSheetWrapper open={false}>{text}</BottomSheetWrapper>,
            );

            expect(queryByText(text)).not.toBeInTheDocument();
        });

        it('should render title', () => {
            const title = 'Title';

            const { getByText } = render(<BottomSheetWrapper title={title} />);

            expect(getByText(title)).toBeInTheDocument();
        });

        it('should render action button', () => {
            const { getByTestId } = render(
                <BottomSheetWrapper actionButton={<div data-test-id={dataTestId} />} />,
            );

            expect(getByTestId(dataTestId)).toBeInTheDocument();
        });

        it('should set className', () => {
            const className = 'class-name';

            render(<BottomSheetWrapper className={className} />);

            expect(document.body.querySelector(`.${className}`)).toBeInTheDocument();
        });

        it('should set contentClassName', () => {
            const className = 'class-name';

            render(<BottomSheetWrapper contentClassName={className} />);

            expect(document.body.querySelector(`.${className}`)).toBeInTheDocument();
        });

        it('should set z-index', () => {
            const zIndex = 9999;

            const { getByTestId } = render(
                <BottomSheetWrapper dataTestId={dataTestId} zIndex={zIndex} />,
            );

            const component = getByTestId(dataTestId);

            expect(+getComputedStyle(component).zIndex).toBe(zIndex);
        });
    });

    describe('Interactions tests', () => {
        it('should close on dialog click', async () => {
            const { getByTestId, queryByTestId } = render(
                <BottomSheetWrapper dataTestId={dataTestId} />,
            );

            fireEvent.click(getByTestId(dataTestId));

            await waitForElementToBeRemoved(() => getByTestId(dataTestId));

            expect(queryByTestId(dataTestId)).not.toBeInTheDocument();
        });

        it('should not close on dialog content click', async () => {
            const { getByTestId, queryByTestId } = render(
                <BottomSheetWrapper dataTestId={dataTestId} />,
            );

            const content = getByTestId(dataTestId).firstElementChild as HTMLElement;

            if (content) {
                fireEvent.click(content);
            }

            await new Promise(res => setTimeout(res, 1000));

            expect(queryByTestId(dataTestId)).toBeInTheDocument();
        });

        it('should swiping on touchmove', async () => {
            const className = 'className';

            const onEntered = jest.fn();

            render(
                <BottomSheetWrapper
                    dataTestId={dataTestId}
                    className={className}
                    transitionProps={{
                        timeout: 0,
                        onEntered,
                    }}
                />,
            );

            await waitFor(() => expect(onEntered).toBeCalledTimes(1));

            const swipeableBottomSheet = document.querySelector(`.${className}`) as HTMLElement;

            const { top, left } = swipeableBottomSheet.getBoundingClientRect();

            const initial = { x: left + 10, y: top + 10 };

            let swipeDelta = 20;

            fireEvent.touchStart(swipeableBottomSheet, {
                touches: [{ clientX: initial.x, clientY: initial.y }],
            });
            fireEvent.touchMove(swipeableBottomSheet, {
                touches: [{ clientX: initial.x, clientY: initial.y + swipeDelta }],
            });

            expect(getComputedStyle(swipeableBottomSheet).transform).toBe(
                `translateY(${swipeDelta}px)`,
            );

            swipeDelta = 40;

            fireEvent.touchMove(swipeableBottomSheet, {
                touches: [{ clientX: initial.x, clientY: initial.y + swipeDelta }],
            });

            expect(getComputedStyle(swipeableBottomSheet).transform).toBe(
                `translateY(${swipeDelta}px)`,
            );
        });

        it('should return up, if swiped less then default closeOffset', async () => {
            const className = 'className';

            const onEntered = jest.fn();
            const onExited = jest.fn();

            render(
                <BottomSheetWrapper
                    dataTestId={dataTestId}
                    className={className}
                    transitionProps={{
                        timeout: 0,
                        onEntered,
                        onExited,
                    }}
                />,
            );

            await waitFor(() => expect(onEntered).toBeCalledTimes(1));

            const swipeableBottomSheet = document.querySelector(`.${className}`) as HTMLElement;

            const { top, left, height } = swipeableBottomSheet.getBoundingClientRect();

            const initial = { x: left + 10, y: top + 10 };

            const swipeDelta = height * CLOSE_OFFSET - 20;

            fireEvent.touchStart(swipeableBottomSheet, {
                touches: [{ clientX: initial.x, clientY: initial.y }],
            });

            fireEvent.touchMove(swipeableBottomSheet, {
                touches: [{ clientX: initial.x, clientY: initial.y + swipeDelta }],
            });

            fireEvent.touchEnd(swipeableBottomSheet);

            expect(onExited).not.toBeCalled();
            expect(getComputedStyle(swipeableBottomSheet).transform).toBe('');
        });

        it('should close, if swiped more then default closeOffset', async () => {
            const className = 'className';

            const onEntered = jest.fn();
            const onExited = jest.fn();

            const { queryByTestId } = render(
                <BottomSheetWrapper
                    dataTestId={dataTestId}
                    className={className}
                    transitionProps={{
                        timeout: 0,
                        onEntered,
                        onExited,
                    }}
                />,
            );

            await waitFor(() => expect(onEntered).toBeCalledTimes(1));

            const swipeableBottomSheet = document.querySelector(`.${className}`) as HTMLElement;

            const { top, left, height } = swipeableBottomSheet.getBoundingClientRect();

            const initial = { x: left + 10, y: top + 10 };

            const swipeDelta = height * CLOSE_OFFSET + 20;

            fireEvent.touchStart(swipeableBottomSheet, {
                touches: [{ clientX: initial.x, clientY: initial.y }],
            });

            fireEvent.touchMove(swipeableBottomSheet, {
                touches: [{ clientX: initial.x, clientY: initial.y + swipeDelta }],
            });

            fireEvent.touchEnd(swipeableBottomSheet);

            await waitFor(() => expect(onExited).toBeCalledTimes(1));

            const component = await queryByTestId(dataTestId);

            expect(component).not.toBeInTheDocument();
        });
    });
});
