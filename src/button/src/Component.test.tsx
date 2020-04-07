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
    it('should match snapshot', () => {
        expect(render(<Button />)).toMatchSnapshot();
    });

    it('should set `data-test-id` atribute', () => {
        const dataTestId = 'test-id';
        const { getByTestId } = render(<Button dataTestId={dataTestId} />);

        expect(getByTestId(dataTestId)).toBeTruthy();
    });

    describe('classNames', () => {
        it('should set `className` class', () => {
            const className = 'test-class';
            const { container } = render(<Button className={className} />);

            expect(container.firstElementChild?.classList).toContain(className);
        });

        it('should set `size` class', () => {
            const size = 'm';
            const { container } = render(<Button size={size} />);

            expect(container.firstElementChild?.classList).toContain(size);
        });

        it('should set `block` class', () => {
            const { container } = render(<Button block={true} />);

            expect(container.firstElementChild?.classList).toContain('block');
        });

        it('should set `view` class', () => {
            const view = 'primary';
            const { container } = render(<Button view={view} />);

            expect(container.firstElementChild?.classList).toContain(view);
        });

        it('should set `iconOnly` class', () => {
            const { container } = render(<Button />);

            expect(container.firstElementChild?.classList).toContain('iconOnly');
        });
    });

    describe('render', () => {
        it('should render left addons', () => {
            const addonsText = 'Left addons';
            const { container, getByText } = render(
                <Button leftAddons={<div>{addonsText}</div>} />,
            );

            expect(container).toContainElement(getByText(addonsText));
        });

        it('should render right addons', () => {
            const addonsText = 'Right addons';
            const { container, getByText } = render(
                <Button rightAddons={<div>{addonsText}</div>} />,
            );

            expect(container).toContainElement(getByText(addonsText));
        });

        it('should render button by default', () => {
            const { container } = render(<Button />);

            expect(container.firstElementChild?.tagName).toEqual('BUTTON');
        });

        it('should render anchor if href pass', () => {
            const { container } = render(<Button href='https://some-url' />);

            expect(container.firstElementChild?.tagName).toEqual('A');
        });
    });
});
