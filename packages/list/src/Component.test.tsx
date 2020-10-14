import React from 'react';
import { render } from '@testing-library/react';

import { List } from './index';

describe('Snapshots tests', () => {
    it('should match snapshot', () => {
        expect(render(<List>List</List>)).toMatchSnapshot();
    });
    it('should match snapshot', () => {
        expect(render(<List tag='ol'>List</List>)).toMatchSnapshot();
    });
});

describe('Classes tests', () => {
    it('should set custom class', () => {
        const className = 'custom-class';

        const { container } = render(<List className={className}>List</List>);

        expect(container.firstElementChild).toHaveClass(className);
    });
});

describe('Attributes tests', () => {
    it('should set data-test-id attribute', () => {
        const dataTestId = 'link-test-id';

        const { container } = render(<List dataTestId={dataTestId}>List</List>);

        const testIdAttr = container.firstElementChild?.getAttribute('data-test-id');

        expect(testIdAttr).toBe(dataTestId);
    });
});

describe('Props tests', () => {
    it('should set marker', () => {
        const marker = '•';

        const { container } = render(<List marker={marker}>Item</List>);

        expect(container.querySelector('.item')?.firstElementChild).toHaveTextContent(marker);
    });
});
