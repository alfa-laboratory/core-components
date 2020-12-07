import React from 'react';
import { render } from '@testing-library/react';

import { Portal } from './index';

describe('Portal', () => {
    describe('ref', () => {
        it('should have access to the mountNode when disabledPortal={false}', () => {
            const refSpy = jest.fn();
            const { unmount } = render(
                <Portal ref={refSpy}>
                    <h1>Foo</h1>
                </Portal>,
            );
            expect(refSpy.mock.calls).toEqual([[document.body]]);
            unmount();
            expect(refSpy.mock.calls).toEqual([[document.body], [null]]);
        });

        it('should have access to the mountNode when disabledPortal={true}', () => {
            const refSpy = jest.fn();
            const { unmount } = render(
                <Portal disablePortal={true} ref={refSpy}>
                    <h1 className='woofPortal'>Foo</h1>
                </Portal>,
            );
            const mountNode = document.querySelector('.woofPortal');
            expect(refSpy.mock.calls).toEqual([[mountNode]]);
            unmount();
            expect(refSpy.mock.calls).toEqual([[mountNode], [null]]);
        });

        it('should have access to the mountNode when switching disabledPortal', () => {
            const refSpy = jest.fn();
            const { rerender, unmount } = render(
                <Portal disablePortal={true} ref={refSpy}>
                    <h1 className='woofPortal'>Foo</h1>
                </Portal>,
            );
            const mountNode = document.querySelector('.woofPortal');
            expect(refSpy.mock.calls).toEqual([[mountNode]]);

            rerender(
                <Portal disablePortal={false} ref={refSpy}>
                    <h1 className='woofPortal'>Foo</h1>
                </Portal>,
            );
            expect(refSpy.mock.calls).toEqual([[mountNode], [null], [document.body]]);
            unmount();
            expect(refSpy.mock.calls).toEqual([[mountNode], [null], [document.body], [null]]);
        });
    });

    describe('General', () => {
        it('should render in a different node', () => {
            render(
                <div id='test1'>
                    <h1 className='woofPortal1'>Foo</h1>
                    <Portal>
                        <h1 className='woofPortal2'>Foo</h1>
                    </Portal>
                </div>,
            );
            const rootElement = document.querySelector('#test1');
            expect(rootElement?.contains(document.querySelector('.woofPortal1'))).toEqual(true);
            expect(rootElement?.contains(document.querySelector('.woofPortal2'))).toEqual(false);
        });

        it('should render overlay into container (document)', () => {
            render(
                <Portal>
                    <div className='test2' />
                    <div className='test2' />
                </Portal>,
            );
            expect(document.querySelectorAll('.test2').length).toEqual(2);
        });

        it('should render overlay into container (DOMNode)', () => {
            const container = document.createElement('div');
            render(
                <Portal container={container}>
                    <div id='test2' />
                </Portal>,
            );
            expect(container.querySelectorAll('#test2').length).toEqual(1);
        });
    });
});
