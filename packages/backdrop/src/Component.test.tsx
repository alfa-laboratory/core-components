import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { Backdrop } from './Component';

describe('Backdrop', () => {
    const waitForTransition = async () => new Promise(res => setTimeout(res, 1000));

    it('should set `data-test-id` attribute', () => {
        const dataTestId = 'test-id';
        const { queryByTestId } = render(<Backdrop open={true} dataTestId={dataTestId} />);

        expect(queryByTestId(dataTestId)).toBeInTheDocument();
    });

    it('should match snapshot', async () => {
        const { queryByTestId, rerender } = render(
            <Backdrop open={true} dataTestId='Backdrop'>
                <span>children</span>
            </Backdrop>,
        );

        // appear
        expect(queryByTestId('Backdrop')).toMatchSnapshot();

        // appear done
        await waitForTransition();

        expect(queryByTestId('Backdrop')).toMatchSnapshot();

        // close
        rerender(
            <Backdrop open={false} dataTestId='Backdrop'>
                <span>children</span>
            </Backdrop>,
        );

        // exit
        expect(queryByTestId('Backdrop')).toMatchSnapshot();

        // exit done, unmount
        await waitForTransition();

        expect(queryByTestId('Backdrop')).toMatchSnapshot();
    });

    it('should use custom classes', async () => {
        const classNames = {
            appear: 'my-appear',
            appearActive: 'my-active-appear',
            appearDone: 'my-done-appear',
            enter: 'my-enter',
            enterActive: 'my-active-enter',
            enterDone: 'my-done-enter',
            exit: 'my-exit',
            exitActive: 'my-active-exit',
            exitDone: 'my-done-exit',
        };

        const { queryByTestId, rerender } = render(
            <Backdrop
                open={true}
                unmountOnExit={false}
                transitionClassNames={classNames}
                dataTestId='Backdrop'
            />,
        );

        // appear
        expect(queryByTestId('Backdrop')).toHaveClass(classNames.appear, classNames.appearActive);

        // appear done
        await waitForTransition();

        expect(queryByTestId('Backdrop')).toHaveClass(classNames.appearDone, classNames.enterDone);

        // close
        rerender(
            <Backdrop
                open={false}
                unmountOnExit={false}
                transitionClassNames={classNames}
                dataTestId='Backdrop'
            />,
        );

        // exit
        expect(queryByTestId('Backdrop')).toHaveClass(classNames.exit, classNames.exitActive);

        // exit done
        await waitForTransition();

        expect(queryByTestId('Backdrop')).toHaveClass(classNames.exitDone);

        // reopen
        rerender(
            <Backdrop
                open={true}
                unmountOnExit={false}
                transitionClassNames={classNames}
                dataTestId='Backdrop'
            />,
        );

        // enter
        expect(queryByTestId('Backdrop')).toHaveClass(classNames.enter, classNames.enterActive);

        // enter done
        await waitForTransition();

        expect(queryByTestId('Backdrop')).toHaveClass(classNames.enterDone);
    });

    it('should call `onClick` prop', () => {
        const cb = jest.fn();
        const dataTestId = 'test-id';
        const { getByTestId } = render(
            <Backdrop open={true} onClick={cb} dataTestId={dataTestId} />,
        );

        fireEvent.click(getByTestId(dataTestId));

        expect(cb).toBeCalledTimes(1);
    });

    it('should unmount without errors', () => {
        const { unmount } = render(<Backdrop open={true} />);

        expect(unmount).not.toThrowError();
    });
});
