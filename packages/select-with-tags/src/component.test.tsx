import React from 'react';
import { render } from '@testing-library/react';

import { SelectWithTags } from './index';

const options = [
    { key: '1', content: 'H', value: 'H' },
    { key: '2', content: 'Li', value: 'Li' },
    { key: '3', content: 'Na', value: 'Na' },
    { key: '4', content: 'Curium', value: 'Curium' },
    { key: '5', content: 'Berkelium', value: 'Berkelium' },
    { key: '6', content: 'Californium', value: 'Californium' },
    { key: '7', content: 'Einsteinium', value: 'Einsteinium' },
    { key: '8', content: 'Fermium', value: 'Fermium' },
    { key: '9', content: 'Mendelevium', value: 'Mendelevium' },
    { key: '10', content: 'Nobelium', value: 'Nobelium' },
    { key: '11', content: 'Lawrencium', value: 'Lawrencium' },
    { key: '12', content: 'Rutherfordium', value: 'Rutherfordium' },
    { key: '13', content: 'Dubnium', value: 'Dubnium' },
    { key: '14', content: 'Seaborgium', value: 'Seaborgium' },
    { key: '15', content: 'Bohrium', value: 'Bohrium' },
];

describe('SelectWithTags', () => {
    describe('Snapshots tests', () => {
        it('should match snapshot', () => {
            const { container } = render(
                <SelectWithTags options={options} value='' onInput={jest.fn()} />,
            );

            expect(container).toMatchSnapshot();
        });
    });

    it('should forward ref', () => {
        const ref = jest.fn();

        render(<SelectWithTags options={options} value='' onInput={jest.fn()} ref={ref} />);

        expect(ref).toBeCalled();
    });

    it('should unmount without errors', () => {
        const { unmount } = render(
            <SelectWithTags options={options} value='' onInput={jest.fn()} />,
        );

        expect(unmount).not.toThrowError();
    });
});
