/**
 * Vendor
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';

/**
 * Component
 */

import { MaskedInput } from './index';

// prettier-ignore
const cardMask = [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/];

describe('MaskedInput', () => {
    describe('Snapshots tests', () => {
        it('should match snapshot', () => {
            expect(render(<MaskedInput />)).toMatchSnapshot();
        });
    });

    describe('Guide mode', () => {
        it('should render empty input if `guide` not enabled', () => {
            const dataTestId = 'test-id';
            const { getByTestId } = render(<MaskedInput mask={cardMask} dataTestId={dataTestId} />);

            const input = getByTestId(dataTestId) as HTMLInputElement;

            expect(input.value).toBeFalsy();
        });

        it('should render empty input if `guide` enabled', () => {
            const dataTestId = 'test-id';
            const { getByTestId } = render(
                <MaskedInput mask={cardMask} guide={true} dataTestId={dataTestId} />,
            );

            const input = getByTestId(dataTestId) as HTMLInputElement;

            expect(input.value).toBeFalsy();
        });

        it('should render filled input if `guide` and `showMask` enabled', () => {
            const dataTestId = 'test-id';
            const { getByTestId } = render(
                <MaskedInput
                    mask={cardMask}
                    guide={true}
                    showMask={true}
                    placeholderChar='_'
                    dataTestId={dataTestId}
                />,
            );

            const input = getByTestId(dataTestId) as HTMLInputElement;

            expect(input.value).toBe('____ ____ ____ ____');
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
