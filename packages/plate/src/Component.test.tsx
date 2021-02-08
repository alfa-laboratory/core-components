import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { CheckmarkCircleMIcon } from '@alfalab/icons-glyph/CheckmarkCircleMIcon';

import { Plate } from './index';

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

        it('should set `hasCloser` class', () => {
            const { container } = render(<Plate hasCloser={true} />);

            expect(container.firstElementChild).toHaveClass('hasCloser');
        });

        it('should set `foldable` class', () => {
            const { container } = render(
                <Plate foldable={true} title='title'>
                    text
                </Plate>,
            );

            expect(container.firstElementChild).toHaveClass('foldable');
        });

        it('should not set `foldable` class with empty `title`', () => {
            const { container } = render(<Plate foldable={true}>text</Plate>);

            expect(container.firstElementChild).not.toHaveClass('foldable');
        });

        it('should not set `foldable` class with empty `children`', () => {
            const { container } = render(<Plate foldable={true} title='title' />);

            expect(container.firstElementChild).not.toHaveClass('foldable');
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
    });

    it('should unmount without errors', () => {
        const { unmount } = render(<Plate />);

        expect(unmount).not.toThrowError();
    });
});
