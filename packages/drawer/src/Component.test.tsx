import React from 'react';
import { render, cleanup } from '@testing-library/react';

import { Drawer } from './Component';

describe('Drawer', () => {
    let savedBodyStyle: CSSStyleDeclaration;

    beforeAll(() => {
        savedBodyStyle = document.body.style;
    });

    beforeEach(() => {
        // eslint-disable-next-line
        // @ts-ignore
        document.body.setAttribute('style', savedBodyStyle);
    });

    afterAll(() => {
        cleanup();
    });

    it('should match snapshot', () => {
        const { queryByTestId } = render(
            <Drawer open={true} dataTestId='drawer'>
                <span>header</span>
                <span>content</span>
                <span>footer</span>
            </Drawer>,
        );

        expect(queryByTestId('drawer')).toMatchSnapshot();
    });

    it('should not render anything when open=false', () => {
        const { queryByTestId } = render(
            <Drawer open={false} dataTestId='drawer'>
                content
            </Drawer>,
        );

        expect(queryByTestId('drawer')).not.toBeInTheDocument();
    });
});
