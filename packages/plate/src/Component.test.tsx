import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { CheckmarkCircleMIcon } from '@alfalab/icons-glyph/CheckmarkCircleMIcon';

import { Plate } from './index';
import { Button } from '../../button/src';

describe('Plate', () => {
    describe('Snapshots tests', () => {
        it('should match snapshot', () => {
            const { container } = render(
                <Plate view='positive' title='title' leftAddons={<CheckmarkCircleMIcon />}>
                    text
                </Plate>,
            );

            expect(container).toMatchSnapshot();
        });
    });

    it('should forward ref', () => {
        const ref = jest.fn();
        const dataTestId = 'test-id';
        const { getByTestId } = render(<Plate ref={ref} dataTestId={dataTestId} />);

        expect(ref.mock.calls).toEqual([[getByTestId(dataTestId)]]);
    });

    it('should set `data-test-id` attribute', () => {
        const dataTestId = 'test-id';
        const { getByTestId } = render(<Plate dataTestId={dataTestId} />);

        expect(getByTestId(dataTestId).tagName).toBe('DIV');
    });

    it('should render buttons size=xs, first view=outlined, others view=link', () => {
        const { queryByTestId } = render(
            <Plate
                buttons={[
                    <Button dataTestId='button-1'>1</Button>,
                    <Button dataTestId='button-2'>2</Button>,
                    <Button dataTestId='button-3'>3</Button>,
                ]}
            />,
        );

        expect(queryByTestId('button-1')).toBeInTheDocument();
        expect(queryByTestId('button-2')).toBeInTheDocument();
        expect(queryByTestId('button-3')).toBeInTheDocument();

        expect(queryByTestId('button-1')).toHaveClass('xs');
        expect(queryByTestId('button-2')).toHaveClass('xs');
        expect(queryByTestId('button-3')).toHaveClass('xs');

        expect(queryByTestId('button-1')).toHaveClass('outlined');
        expect(queryByTestId('button-2')).toHaveClass('link');
        expect(queryByTestId('button-3')).toHaveClass('link');
    });

    describe('Classes tests', () => {
        it('should set `className` class', () => {
            const className = 'test-class';
            const { container } = render(<Plate className={className} />);

            expect(container.firstElementChild).toHaveClass(className);
        });

        it('should set `positive` class if `view` prop is `positive`', () => {
            const view = 'positive';
            const { container } = render(<Plate view={view} />);

            expect(container.firstElementChild).toHaveClass(view);
        });
    });

    describe('Callbacks tests', () => {
        it('should call `onClick` prop', async () => {
            const cb = jest.fn();
            const dataTestId = 'test-id';
            const { getByTestId } = render(<Plate onClick={cb} dataTestId={dataTestId} />);

            const el = getByTestId(dataTestId);

            fireEvent.click(el);

            expect(cb).toBeCalledTimes(1);
        });

        it('should call `onClose` prop', async () => {
            const cb = jest.fn();
            const dataTestId = 'test-id';
            const { getByTestId } = render(
                <Plate hasCloser={true} onClose={cb} dataTestId={dataTestId} />,
            );

            const el = getByTestId(dataTestId);
            const closeEl = el.querySelector('.closer') as Element;

            fireEvent.click(closeEl);

            expect(cb).toBeCalledTimes(1);
        });

        it('should hide, if clicked on closer and prop `open` dont`t passed', () => {
            const dataTestId = 'test-id';
            const { getByTestId } = render(<Plate hasCloser={true} dataTestId={dataTestId} />);

            const el = getByTestId(dataTestId);
            const closeEl = el.querySelector('.closer') as Element;

            fireEvent.click(closeEl);

            expect(el).toHaveClass('isHidden');
        });

        it('should don`t hide, if clicked on closer and prop `open` is passed (controlled)', () => {
            const dataTestId = 'test-id';
            const { getByTestId } = render(
                <Plate hasCloser={true} dataTestId={dataTestId} open={true} />,
            );

            const el = getByTestId(dataTestId);
            const closeEl = el.querySelector('.closer') as Element;

            fireEvent.click(closeEl);

            expect(el).not.toHaveClass('isHidden');
        });
    });

    it('should unmount without errors', () => {
        const { unmount } = render(<Plate />);

        expect(unmount).not.toThrowError();
    });
});
