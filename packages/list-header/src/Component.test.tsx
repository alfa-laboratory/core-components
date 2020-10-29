import React from 'react';
import { render } from '@testing-library/react';

import { ListHeader } from './index';

describe('Snapshots tests', () => {
    it('should match snapshot with filled background', () => {
        expect(render(<ListHeader title='Title' description='Description' />)).toMatchSnapshot();
    });

    it('should match snapshot without filled background', () => {
        expect(render(<ListHeader title='Title' filled={false} />)).toMatchSnapshot();
    });
});

describe('Attributes tests', () => {
    it('should set `data-test-id` attribute', () => {
        const dataTestId = 'list-header-test-id';
        const { container } = render(<ListHeader title='Title' dataTestId={dataTestId} />);
        const testIdAttr = container.firstElementChild?.getAttribute('data-test-id');

        expect(testIdAttr).toBe(dataTestId);
    });
});

describe('Classes tests', () => {
    it('should set custom class', () => {
        const className = 'custom-class';
        const dataTestId = 'list-header-test-id';
        const { getByTestId } = render(
            <ListHeader title='Title' className={className} dataTestId={dataTestId} />,
        );

        expect(getByTestId(dataTestId)).toHaveClass(className);
    });

    it('should have class `filled`', () => {
        const dataTestId = 'list-header-test-id';
        const { getByTestId } = render(<ListHeader title='Title' dataTestId={dataTestId} />);

        expect(getByTestId(dataTestId)).toHaveClass('filled');
    });
});
