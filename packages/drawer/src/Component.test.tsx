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
            <Drawer
                headerContent={<span>header</span>}
                footer={<span>footer</span>}
                open={true}
                dataTestId='drawer'
            >
                content
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

    it('should set headerClassName', () => {
        render(
            <Drawer
                headerContent={<span>header</span>}
                headerClassName='test-class'
                open={true}
                dataTestId='drawer'
            >
                content
            </Drawer>,
        );

        expect(document.querySelector('.test-class')).toBeInTheDocument();
    });

    it('should set headerClassName', () => {
        render(
            <Drawer
                footer={<span>footer</span>}
                footerClassName='test-class'
                open={true}
                dataTestId='drawer'
            >
                content
            </Drawer>,
        );

        expect(document.querySelector('.test-class')).toBeInTheDocument();
    });

    it('should render closer if hasCloser=true', () => {
        const { queryByLabelText } = render(
            <Drawer hasCloser={true} open={true} dataTestId='drawer' />,
        );

        expect(queryByLabelText('закрыть')).toBeInTheDocument();
    });
});
