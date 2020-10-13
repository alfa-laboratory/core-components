import React from 'react';
import { render } from '@testing-library/react';
import { Input } from '@alfalab/core-components-input';

import userEvent from '@testing-library/user-event';
import { withSuffix } from './index';

const SuffixInput = withSuffix(Input);

describe('withSuffix', () => {
    describe('Snapshots tests', () => {
        it('should match snapshot', () => {
            expect(render(<SuffixInput value='10' suffix=' лет' />).container).toMatchSnapshot();
        });
    });

    it('should forward ref to html input', () => {
        const inputRef = jest.fn();
        const dataTestId = 'test-id';
        render(<SuffixInput ref={inputRef} dataTestId={dataTestId} />);

        expect(inputRef.mock.calls[0][0].tagName).toBe('INPUT');
    });

    it('should render suffix when controlled', () => {
        const suffix = 'suffix';
        const { container } = render(<SuffixInput value='10' suffix={suffix} />);

        expect(container.querySelector('.suffixVisible')).toBeInTheDocument();
    });

    it('should render suffix when uncontrolled', async () => {
        const dataTestId = 'test-id';
        const suffix = 'suffix';
        const { container, getByTestId } = render(
            <SuffixInput suffix={suffix} dataTestId={dataTestId} />,
        );

        const input = getByTestId(dataTestId) as HTMLInputElement;

        expect(container.querySelector('.suffixVisible')).not.toBeInTheDocument();

        await userEvent.type(input, 'some value');

        expect(container.querySelector('.suffixVisible')).toBeInTheDocument();
    });

    it('should set `suffixContainerClassName` class to root', () => {
        const className = 'test-class';
        const { container } = render(<SuffixInput suffixContainerClassName={className} />);

        expect(container.getElementsByClassName(className).length).toBe(1);
    });

    it('should unmount without errors', () => {
        const { unmount } = render(<SuffixInput value='10' suffix=' лет' />);

        expect(unmount).not.toThrowError();
    });
});
