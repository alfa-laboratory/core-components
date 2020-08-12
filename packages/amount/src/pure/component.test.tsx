import React from 'react';
import { render } from '@testing-library/react';
import { PureAmount } from '.';

describe('PureAmount', () => {
    it('should match snapshot', () => {
        const testId = 'test-id';

        const { getByTestId } = render(
            <PureAmount value={100} currency='RUR' minority={100} dataTestId={testId} />,
        );
        const amount = getByTestId(testId);
        expect(amount).toMatchSnapshot();
    });
});
