import React from 'react';
import { render } from '@testing-library/react';

import { Col } from '../col/index';
import { Row } from './index';

describe('Grid.Row', () => {
    describe('Snapshots tests', () => {
        it('should match snapshot', () => {
            const { container } = render(
                <Row>
                    <Col>content</Col>
                </Row>,
            );

            expect(container).toMatchSnapshot();
        });
    });

    describe('Classes tests', () => {
        it('should set custom class', () => {
            const className = 'custom-class';

            const { container } = render(<Row className={className} />);

            expect(container.firstElementChild).toHaveClass(className);
        });

        it('should set gutter class', () => {
            const { container } = render(
                <Row gutter={{ mobile: 0, tablet: 8, desktop: { s: 16, l: 24 } }} />,
            );

            expect(container.firstElementChild).toHaveClass('gutter-mobile-0');
            expect(container.firstElementChild).toHaveClass('gutter-tablet-8');
            expect(container.firstElementChild).toHaveClass('gutter-desktop-s-16');
            expect(container.firstElementChild).toHaveClass('gutter-desktop-l-24');
        });

        it('should set align class', () => {
            const { container } = render(<Row align='top' />);

            expect(container.firstElementChild).toHaveClass('top');
        });

        it('should set justify class', () => {
            const { container } = render(<Row justify='center' />);

            expect(container.firstElementChild).toHaveClass('center');
        });
    });

    it('should set `data-test-id` attribute to row', () => {
        const dataTestId = 'test-id';
        const { getByTestId } = render(<Row dataTestId={dataTestId} />);

        expect(getByTestId(dataTestId).tagName).toBe('DIV');
    });

    it('should set tag correcly', () => {
        const dataTestId = 'test-id';
        const { getByTestId } = render(<Row tag='section' dataTestId={dataTestId} />);

        expect(getByTestId(dataTestId).tagName).toBe('SECTION');
    });
});
