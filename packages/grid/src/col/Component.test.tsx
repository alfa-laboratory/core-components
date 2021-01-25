import React from 'react';
import { render } from '@testing-library/react';

import { Col } from './index';

describe('Grid.Col', () => {
    describe('Snapshots tests', () => {
        it('should match snapshot', () => {
            const { container } = render(<Col>content</Col>);

            expect(container).toMatchSnapshot();
        });
    });

    describe('Classes tests', () => {
        it('should set custom class', () => {
            const className = 'custom-class';

            const { container } = render(<Col className={className} />);

            expect(container.firstElementChild).toHaveClass(className);
        });

        it('should set align class', () => {
            const { container } = render(<Col align='top' />);

            expect(container.firstElementChild).toHaveClass('align-top');
        });

        it('should set order class', () => {
            const { container } = render(<Col order='first' />);

            expect(container.firstElementChild).toHaveClass('order-first');
        });

        it('should set offset class', () => {
            const { container } = render(<Col offset={{ mobile: 1, tablet: 2, desktop: 3 }} />);

            expect(container.firstElementChild).toHaveClass('offset-mobile-1');
            expect(container.firstElementChild).toHaveClass('offset-tablet-2');
            expect(container.firstElementChild).toHaveClass('offset-desktop-3');
        });

        it('should set width class', () => {
            const { container } = render(<Col width={{ mobile: { s: 12, m: 6 }, tablet: 4 }} />);

            expect(container.firstElementChild).toHaveClass('width-mobile-s-12');
            expect(container.firstElementChild).toHaveClass('width-mobile-m-6');
            expect(container.firstElementChild).toHaveClass('width-tablet-4');
        });
    });

    it('should set `data-test-id` attribute to col', () => {
        const dataTestId = 'test-id';
        const { getByTestId } = render(<Col dataTestId={dataTestId} />);

        expect(getByTestId(dataTestId).tagName).toBe('DIV');
    });

    it('should set tag correcly', () => {
        const dataTestId = 'test-id';
        const { getByTestId } = render(<Col tag='article' dataTestId={dataTestId} />);

        expect(getByTestId(dataTestId).tagName).toBe('ARTICLE');
    });
});
