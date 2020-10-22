import React from 'react';
import { render } from '@testing-library/react';

import { Badge } from './index';

describe('Badge', () => {
    describe('Snapshots tests', () => {
        it('should match snapshot', () => {
            const { container } = render(<Badge view='count' content={100} />);

            expect(container).toMatchSnapshot();
        });
    });

    it('should forward ref', () => {
        const ref = jest.fn();
        const dataTestId = 'test-id';
        const { getByTestId } = render(<Badge view='count' ref={ref} dataTestId={dataTestId} />);

        expect(ref.mock.calls).toEqual([[getByTestId(dataTestId)]]);
    });

    it('should set `data-test-id` attribute', () => {
        const dataTestId = 'test-id';
        const { getByTestId } = render(<Badge view='count' dataTestId={dataTestId} />);

        expect(getByTestId(dataTestId).tagName).toBe('DIV');
    });

    describe('Classes tests', () => {
        it('should set `size` class', () => {
            const size = 's';
            const { container } = render(<Badge view='count' size={size} />);

            expect(container.firstElementChild).toHaveClass(size);
        });

        it('should set `view` class', () => {
            const view = 'count';
            const { container } = render(<Badge view={view} />);

            expect(container.firstElementChild).toHaveClass(view);
        });

        it('should set `positive` class if `iconColor` prop is `positive`', () => {
            const iconColor = 'positive';
            const { container } = render(<Badge view='icon' iconColor={iconColor} />);

            expect(container.firstElementChild).toHaveClass(iconColor);
        });

        it('should set `isHidden` class if `content` prop lower than 0', () => {
            const { container } = render(<Badge view='count' content={0} />);

            expect(container.firstElementChild).toHaveClass('isHidden');
        });

        it('should set `dot` class without `content` prop', () => {
            const { container } = render(<Badge view='count' />);

            expect(container.firstElementChild).toHaveClass('dot');
        });
    });

    it('should contain `99+` if content is bigger than 99', () => {
        const { container } = render(<Badge view='count' content={100} />);

        expect(container).toHaveTextContent('99+');
    });

    it('should unmount without errors', () => {
        const { unmount } = render(<Badge view='count' />);

        expect(unmount).not.toThrowError();
    });
});
