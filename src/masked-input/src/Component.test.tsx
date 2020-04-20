import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { MaskedInput } from './index';

// prettier-ignore
const cardMask = [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/];

describe('MaskedInput', () => {
    describe('Snapshots tests', () => {
        it('should match snapshot', () => {
            expect(render(<MaskedInput />)).toMatchSnapshot();
        });
    });

    it('should format value according to mask', () => {
        const dataTestId = 'test-id';
        const { getByTestId } = render(<MaskedInput mask={cardMask} dataTestId={dataTestId} />);

        const input = getByTestId(dataTestId) as HTMLInputElement;

        fireEvent.change(input, { target: { value: 'before1234123412341234after±!@#$%^&*()_+' } });

        expect(input.value).toBe('1234 1234 1234 1234');
    });

    it('should unmount without errors', () => {
        const { unmount } = render(<MaskedInput />);

        expect(unmount).not.toThrowError();
    });
});
