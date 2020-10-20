import React from 'react';
import { render } from '@testing-library/react';

import { CardImage } from './index';

describe.only('CardImage', () => {
    describe.only('Display tests', () => {
        it('should display correctly', () => {
            expect(render(<CardImage />)).toMatchSnapshot();
        });
        it('should display with cardId correctly', () => {
            expect(render(<CardImage cardId='ER' />)).toMatchSnapshot();
        });
        it('should display with cardId and layers', () => {
            expect(
                render(<CardImage cardId='ER' layers='BACKGROUND,CARD_NUMBER,CARD_HOLDER' />),
            ).toMatchSnapshot();
        });
    });

    describe('Styles tests', () => {
        it('should set custom class', () => {
            const className = 'custom-class';
            const { container } = render(<CardImage className={className} />);

            expect(container.firstElementChild).toHaveClass(className);
        });

        it('should set `rounded` class', () => {
            const { container } = render(<CardImage rounded={true} />);

            expect(container.firstElementChild).toHaveClass('rounded');
        });
    });

    describe('Render tests', () => {
        test('should unmount without errors', () => {
            const { unmount } = render(<CardImage />);

            expect(unmount).not.toThrowError();
        });
    });
});
