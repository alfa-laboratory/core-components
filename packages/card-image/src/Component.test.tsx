import React from 'react';
import { render } from '@testing-library/react';

import { CardImage, DEFAULT_BASE_URL, DEFAULT_WIDTH, ASPECT_RATIO } from './index';

const layers = 'BACKGROUND,CARD_NUMBER,CARD_HOLDER';
const cardId = 'ER';
describe('CardImage', () => {
    describe('Display tests', () => {
        it('should display correctly', () => {
            expect(render(<CardImage />)).toMatchSnapshot();
        });
        it('should display with cardId correctly', () => {
            expect(render(<CardImage cardId='ER' />)).toMatchSnapshot();
        });
        it('should display with cardId and layers', () => {
            const { container } = render(<CardImage cardId={cardId} layers={layers} />);
            const img = container.querySelector('img');
            expect(img?.src).toContain(cardId);
            expect(img?.src).toContain(`layers=${layers}`);
            expect(container).toMatchSnapshot();
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

        test('should have default baseUrl', () => {
            const { container } = render(<CardImage cardId={cardId} layers={layers} />);
            const img = container.querySelector('img');
            expect(img?.src).toContain(DEFAULT_BASE_URL);
        });

        test('should have baseUrl', () => {
            const baseUrl = 'some-url';
            const { container } = render(
                <CardImage cardId={cardId} layers={layers} baseUrl={baseUrl} />,
            );
            const img = container.querySelector('img');
            expect(img?.src).toContain(baseUrl);
        });

        test('should provide custom baseUrl', () => {
            const baseUrl = 'some-url';
            const { container } = render(
                <CardImage cardId={cardId} layers={layers} baseUrl={baseUrl} />,
            );
            const img = container.querySelector('img');
            expect(img?.src).toContain(baseUrl);
        });

        test('should have default width', () => {
            const { container } = render(<CardImage cardId={cardId} layers={layers} />);
            const img = container.querySelector('img');
            expect(img?.width).toBe(DEFAULT_WIDTH);
        });

        test('should correctly set height', () => {
            const width = 500;
            const height = width * ASPECT_RATIO;
            const { container } = render(
                <CardImage cardId={cardId} layers={layers} width={width} />,
            );
            const img = container.querySelector('img');
            expect(img?.height).toBe(height);
        });
    });
});
