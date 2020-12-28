import React from 'react';
import { render } from '@testing-library/react';

import { CardImage } from '@alfalab/core-components-card-image';
import { Space } from './index';

// TODO: more tests
describe('Space', () => {
    describe('Display tests', () => {
        it('should display with children like boolean or string or others react children type correctly', () => {
            expect(
                render(
                    <Space>
                        {0 && <CardImage cardId='EG' />}
                        {false && <CardImage cardId='GQ' />}
                        {null && <CardImage cardId='SU' />}
                        {'' && <CardImage cardId='EG' />}
                    </Space>,
                ),
            ).toMatchSnapshot();
        });

        it('should display radio group with one child correctly', () => {
            expect(
                render(
                    <Space>
                        <CardImage cardId='EG' />
                    </Space>,
                ),
            ).toMatchSnapshot();
        });
    });
});
