import React from 'react';
import { render } from '@testing-library/react';

import { CustomButton } from './index';

const dataTestId = 'test-id';

describe('CustomButton', () => {
    describe('Snapshots tests', () => {
        it('should match snapshot', () => {
            expect(render(<CustomButton />)).toMatchSnapshot();
        });

        it('should render custom background color', () => {
            expect(render(<CustomButton backgroundColor='#00ff00' />)).toMatchSnapshot();
        });

        it('should render black color content', () => {
            expect(render(<CustomButton contentColor='black' />)).toMatchSnapshot();
        });

        it('should render CustomButton view=primary by default', () => {
            expect(render(<CustomButton />)).toMatchSnapshot();
        });
        it('should render loader if loading pass', () => {
            expect(render(<CustomButton loading={true} />)).toMatchSnapshot();
        });
    });

    describe('Attributes tests', () => {
        it('should set `data-test-id` attribute', () => {
            const { getByTestId } = render(<CustomButton dataTestId={dataTestId} />);
            expect(getByTestId(dataTestId).tagName).toBe('BUTTON');
        });

        it('should have `style` attribute', () => {
            const { container } = render(<CustomButton />);
            expect(container.firstElementChild).toHaveAttribute('style');
        });

        it('should have `style background`', () => {
            const bgcolor = '#888';
            const { getByTestId } = render(
                <CustomButton dataTestId={dataTestId} backgroundColor={bgcolor} />,
            );
            expect(getByTestId(dataTestId)).toHaveStyle({ background: bgcolor });
        });

        it('should set type attribute', () => {
            const type = 'submit';
            const { container } = render(<CustomButton type={type} />);
            expect(container.firstElementChild).toHaveAttribute('type', type);
        });
    });

    describe('Classes tests', () => {
        it('should set `className` class', () => {
            const className = 'test-class';
            const { container } = render(<CustomButton className={className} />);

            expect(container.firstElementChild).toHaveClass(className);
        });

        it('should have `customButton` class as default', () => {
            const { container } = render(<CustomButton />);
            expect(container.firstElementChild).toHaveClass('customButton');
        });

        it('should have `white` class as default', () => {
            const { container } = render(<CustomButton />);
            expect(container.firstElementChild).toHaveClass('customButton');
        });

        it('should have `black` class', () => {
            const { container } = render(<CustomButton contentColor='black' />);
            expect(container.firstElementChild).toHaveClass('black');
        });
    });

    it('should unmount without errors', () => {
        const { unmount } = render(
            <CustomButton leftAddons={<span>Left</span>} rightAddons={<span>Right</span>}>
                Text
            </CustomButton>,
        );

        expect(unmount).not.toThrowError();
    });
});
