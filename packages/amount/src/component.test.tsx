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

    it('should render rightAddons', () => {
        const { container } = render(
            <React.Fragment>
                <Amount value={100} rightAddons={<span />} minority={100} />
                <Amount.Pure value={100} rightAddons={<span />} minority={100} />
            </React.Fragment>,
        );
        expect(container).toMatchSnapshot();
    });

    it('should render plus sign when showPlus and value > 0', () => {
        const { container } = render(
            <React.Fragment>
                <Amount value={100} showPlus={true} minority={100} />
                <Amount.Pure value={100} showPlus={true} minority={100} />
            </React.Fragment>,
        );
        expect(container).toMatchSnapshot();
    });

    it('should not render plus sign when showPlus and value <= 0', () => {
        const { container } = render(
            <React.Fragment>
                <Amount value={0} showPlus={true} minority={100} />
                <Amount value={-100} showPlus={true} minority={100} />
                <Amount.Pure value={0} showPlus={true} minority={100} />
                <Amount.Pure value={-100} showPlus={true} minority={100} />
            </React.Fragment>,
        );
        expect(container).toMatchSnapshot();
    });
});
