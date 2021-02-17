import { createClassNames } from './index';

describe('Grid utils', () => {
    it('createClassNames util should create correct classes', () => {
        const styles = {
            'order-1': 'order-1_prefix',
            'width-auto': 'width-auto_prefix',
            'gutter-mobile-1': 'gutter-mobile-1_prefix',
            'offset-mobile-1': 'offset-mobile-1_prefix',
            'offset-tablet-s-1': 'offset-tablet-s-1_prefix',
            'offset-tablet-m-1': 'offset-tablet-m-1_prefix',
        };

        expect(createClassNames({}, styles)).toEqual([]);
        expect(
            createClassNames(
                {
                    order: 1,
                    width: 'auto',
                    gutter: {
                        mobile: 1,
                    },
                    offset: {
                        mobile: 1,
                        tablet: {
                            s: 1,
                            m: 1,
                        },
                    },
                },
                styles,
            ),
        ).toEqual([
            'order-1_prefix',
            'width-auto_prefix',
            'gutter-mobile-1_prefix',
            'offset-mobile-1_prefix',
            'offset-tablet-s-1_prefix',
            'offset-tablet-m-1_prefix',
        ]);
    });
});
