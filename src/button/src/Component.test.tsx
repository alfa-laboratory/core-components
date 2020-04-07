/**
 * Vendor
 */

import React from 'react';
import { render } from '@testing-library/react';

/**
 * Component
 */

import { Button } from './index';

describe('Button', () => {
    describe('Snapshots tests', () => {
        it('should match snapshot', () => {
            expect(render(<Button />)).toMatchSnapshot();
        });

        it('should render left addons', () => {
            expect(render(<Button leftAddons={<div>Left addons</div>} />)).toMatchSnapshot();
        });

        it('should render right addons', () => {
            expect(render(<Button rightAddons={<div>Right addons</div>} />)).toMatchSnapshot();
        });

        it('should render button by default', () => {
            expect(render(<Button />)).toMatchSnapshot();
        });

        it('should render anchor if href pass', () => {
            expect(render(<Button href='https://some-url' />)).toMatchSnapshot();
        });
    });

    describe('Attributes tests', () => {
        it('should set `data-test-id` atribute', () => {
            const dataTestId = 'test-id';
            const { getByTestId } = render(<Button dataTestId={dataTestId} />);

            expect(getByTestId(dataTestId).tagName).toBe('BUTTON');
        });
    });

    describe('Classes tests', () => {
        it('should set `className` class', () => {
            const className = 'test-class';
            const { container } = render(<Button className={className} />);

            expect(container.firstElementChild).toHaveClass(className);
        });

        it('should set `size` class', () => {
            const size = 'm';
            const { container } = render(<Button size={size} />);

            expect(container.firstElementChild).toHaveClass(size);
        });

        it('should set `block` class', () => {
            const { container } = render(<Button block={true} />);

            expect(container.firstElementChild).toHaveClass('block');
        });

        it('should set `view` class', () => {
            const view = 'primary';
            const { container } = render(<Button view={view} />);

            expect(container.firstElementChild).toHaveClass(view);
        });

        it('should set `iconOnly` class', () => {
            const { container } = render(<Button />);

            expect(container.firstElementChild).toHaveClass('iconOnly');
        });
    });

    it('should unmount without errors', () => {
        const { unmount } = render(
            <Button leftAddons={<span>Left</span>} rightAddons={<span>Right</span>}>
                Text
            </Button>,
        );

        expect(unmount).not.toThrowError();
    });
});
