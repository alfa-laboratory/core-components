import React from 'react';
import { render } from '@testing-library/react';

import { Amount } from '.';

describe('Amount', () => {
    it('should match snapshots for base and Pure components', () => {
        const { container } = render(
            <React.Fragment>
                <Amount value={100} currency='RUR' minority={100} />
                <Amount.Pure value={100} currency='RUR' minority={100} />
            </React.Fragment>,
        );
        expect(container).toMatchSnapshot();
    });

    it('should render currencyIcons', () => {
        const { container } = render(
            <React.Fragment>
                <Amount value={100} currencyIcon={<span />} minority={100} />
                <Amount.Pure value={100} currencyIcon={<span />} minority={100} />
            </React.Fragment>,
        );
        expect(container).toMatchSnapshot();
    });
});
