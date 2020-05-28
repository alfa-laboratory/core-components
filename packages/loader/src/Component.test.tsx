import React from 'react';
import { render } from '@testing-library/react';

import { Loader } from './index';

describe('Snapshots tests', () => {
    it('should match snapshot', () => {
        expect(render(<Loader />)).toMatchSnapshot();
    });
});

describe('Classes tests', () => {
    it('should set custom class', () => {
        const className = 'custom-class';

        const { container } = render(<Loader className={className} />);

        expect(container.firstElementChild).toHaveClass(className);
    });
});

describe('Attributes tests', () => {
    it('should set data-test-id attribute', () => {
        const dataTestId = 'loader-test-id';

        const { container } = render(<Loader dataTestId={dataTestId} />);

        const testIdAttr = container.firstElementChild?.getAttribute('data-test-id');

        expect(testIdAttr).toBe(dataTestId);
    });
});
