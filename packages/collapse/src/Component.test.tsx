import React from 'react';
import { render } from '@testing-library/react';

import { Collapse } from './index';

const paragraph = (
    <p style={{ margin: '0 0 16px 0' }}>
        Альфа-Банк, основанный в 1990 году, является универсальным банком, осуществляющим все
        основные виды банковских операций, представленных на рынке финансовых услуг, включая
        обслуживание частных и корпоративных клиентов, инвестиционный банковский бизнес, торговое
        финансирование и т.д.
    </p>
);

// TODO: more tests
describe('Collapse', () => {
    describe('Display tests', () => {
        it('should display with children like boolean or string or others react children type correctly', () => {
            const { container } = render(<Collapse>{paragraph}</Collapse>);

            expect(container).toMatchSnapshot();
        });

        it('should display radio group with one child correctly', () => {
            const { container } = render(
                <Collapse collapsedLabel='Показать'>{paragraph}</Collapse>,
            );

            expect(container).toMatchSnapshot();
        });
    });
});
