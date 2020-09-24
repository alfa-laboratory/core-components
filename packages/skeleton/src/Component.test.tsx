import React from 'react';
import { render } from '@testing-library/react';

import { Skeleton } from '.';

describe('Skeleton', () => {
    describe('Snapshots tests', () => {
        it('should display', () => {
            expect(render(<Skeleton visible={true} />)).toMatchSnapshot();
        });

        it('should not display', () => {
            expect(render(<Skeleton />)).toMatchSnapshot();
        });

        it('should use a children', () => {
            const text = 'text';
            expect(render(<Skeleton>{text}</Skeleton>)).toMatchSnapshot();
        });
    });

    describe('Attributes tests', () => {
        it('should set `data-test-id` atribute', () => {
            const dataTestId = 'test-id';
            const { container } = render(<Skeleton visible={true} dataTestId={dataTestId} />);

            const testIdAttr = container.firstElementChild?.getAttribute('data-test-id');

            expect(testIdAttr).toBe(dataTestId);
        });
    });

    describe('Classes tests', () => {
        it('should set `className` class', () => {
            const className = 'test-class';
            const { container } = render(<Skeleton visible={true} className={className} />);

            expect(container.firstElementChild).toHaveClass(className);
        });
        it('should set `animate` class', () => {
            const className = 'animate';
            const { container } = render(<Skeleton visible={true} animate={true} />);

            expect(container.firstElementChild).toHaveClass(className);
        });
    });
});
