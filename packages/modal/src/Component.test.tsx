import React from 'react';
import { render, cleanup, fireEvent, RenderResult } from '@testing-library/react';

import { Modal, ModalProps } from './Component';

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

describe('Modal', () => {
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

    describe('props', () => {
        it('should consume default props', () => {
            const { queryByTestId } = render(
                <Modal open={true} dataTestId='Modal'>
                    <p>Hello World</p>
                </Modal>,
            );

            expect(queryByTestId('Modal')?.textContent).toEqual('Hello World');
        });
    });

    describe('prop: open', () => {
        it('should not render the children by default', () => {
            const { queryByTestId } = render(
                <Modal open={false} dataTestId='Modal'>
                    <p data-test-id='content'>Hello World</p>
                </Modal>,
            );
            expect(queryByTestId('content')).toBeNull();
        });

        it('renders the children inside a div through a porstal when open', () => {
            const { queryByTestId } = render(
                <Modal open={true} dataTestId='Modal'>
                    <p>Hello World</p>
                </Modal>,
            );

            expect(queryByTestId('Modal')?.tagName).toBe('DIV');
        });
    });

    describe('backdrop', () => {
        const modal = (props?: Partial<ModalProps>) => (
            <Modal open={true} dataTestId='Modal' {...props}>
                <div id='container'>
                    <h1 id='heading'>Hello</h1>
                </div>
            </Modal>
        );

        it('should render a backdrop', () => {
            const wrapper = render(modal());

            const backdrop = wrapper.queryByTestId('backdrop');
            expect(backdrop).not.toBeNull();
        });

        it('should attach a handler to the backdrop that fires onClose', () => {
            const onClose = jest.fn();
            const wrapper = render(modal({ onClose }));
            const backdrop = wrapper.getByTestId('backdrop');
            fireEvent.click(backdrop);

            expect(onClose.mock.calls.length).toStrictEqual(1);
        });

        it('should let the user disable backdrop click triggering onClose', () => {
            const onClose = jest.fn();
            const { getByTestId } = render(modal({ onClose, disableBackdropClick: true }));
            const backdrop = getByTestId('backdrop');
            fireEvent.click(backdrop);

            expect(onClose.mock.calls.length).toStrictEqual(0);
        });

        it('should call through to the user specified onBackdropClick callback', () => {
            const onBackdropClick = jest.fn();
            const { getByTestId } = render(modal({ onBackdropClick }));
            const backdrop = getByTestId('backdrop');
            fireEvent.click(backdrop);

            expect(onBackdropClick.mock.calls.length).toStrictEqual(1);
        });

        it('should ignore the backdrop click if the event did not come from the backdrop', () => {
            const onBackdropClick = jest.fn();
            const { getByTestId } = render(
                modal({
                    onBackdropClick,
                    Backdrop: ({ onClick }) => (
                        // eslint-disable-next-line
                        <div data-test-id='backdrop' onClick={onClick}>
                            <span />
                        </div>
                    ),
                }),
            );
            const backdrop = getByTestId('backdrop');
            const span = backdrop.querySelector('span') as HTMLSpanElement;
            fireEvent.click(span);

            expect(onBackdropClick.mock.calls.length).toStrictEqual(0);
        });
    });

    describe('render', () => {
        let wrapper: RenderResult;

        const modal = (props?: Partial<ModalProps>) => (
            <Modal open={false} dataTestId='Modal' {...props}>
                <div id='container'>
                    <h1 id='heading'>Hello</h1>
                </div>
            </Modal>
        );

        beforeEach(() => {
            wrapper = render(modal());
        });

        it('should not render the content', () => {
            // 'should not have the element in the DOM'
            expect(document.getElementById('container')).toBeNull();
            // 'should not have the element in the DOM'
            expect(document.getElementById('heading')).toBeNull();
        });

        it('should render the content into the portal', () => {
            wrapper.rerender(modal({ open: true }));
            const portalLayer = document.querySelector('[data-test-id="Modal"]');
            const container = document.getElementById('container');
            const heading = document.getElementById('heading');

            if (!container || !heading) {
                throw new Error('missing element');
            }

            // should have the element in the DOM
            expect(container.tagName.toLowerCase()).toStrictEqual('div');
            expect(heading.tagName.toLowerCase()).toStrictEqual('h1');
            expect(portalLayer?.contains(container)).toStrictEqual(true);
            expect(portalLayer?.contains(heading)).toStrictEqual(true);
        });
    });

    describe('handleKeyDown()', () => {
        let wrapper: RenderResult;
        let onEscapeKeyDownSpy: jest.Mock;
        let onCloseSpy: jest.Mock;
        let modalWrapper: HTMLElement;

        const modal = (props?: Partial<ModalProps>) => (
            <Modal
                open={true}
                onEscapeKeyDown={onEscapeKeyDownSpy}
                onClose={onCloseSpy}
                dataTestId='Modal'
                {...props}
            >
                <div />
            </Modal>
        );

        beforeEach(() => {
            onEscapeKeyDownSpy = jest.fn();
            onCloseSpy = jest.fn();
            wrapper = render(modal());
            modalWrapper = wrapper.getByTestId('Modal');
        });

        it('when mounted, TopModal and event not esc should not call given functions', () => {
            fireEvent.keyDown(modalWrapper, { key: 'J' }); // Not escape
            expect(onEscapeKeyDownSpy.mock.calls.length).toStrictEqual(0);
            expect(onCloseSpy.mock.calls.length).toStrictEqual(0);
        });

        it('should call onEscapeKeyDown and onClose', () => {
            fireEvent.keyDown(modalWrapper, { key: 'Escape' });
            expect(onEscapeKeyDownSpy.mock.calls.length).toStrictEqual(1);
            expect(onCloseSpy.mock.calls.length).toStrictEqual(1);
        });

        it('when disableEscapeKeyDown should not call onClose and onEscapeKeyDown', () => {
            wrapper.rerender(modal({ disableEscapeKeyDown: true }));
            fireEvent.keyDown(modalWrapper, { key: 'Escape' });
            expect(onEscapeKeyDownSpy.mock.calls.length).toStrictEqual(0);
            expect(onCloseSpy.mock.calls.length).toStrictEqual(0);
        });
    });

    describe('prop: keepMounted', () => {
        it('should keep the children in the DOM', () => {
            const wrapper = render(
                <Modal keepMounted={true} open={false} dataTestId='Modal'>
                    <div>
                        <p data-test-id='children'>Hello World</p>
                    </div>
                </Modal>,
            );
            expect(wrapper.queryByTestId('children')).not.toBeNull();
        });

        it('does not include the children in the a11y tree', () => {
            const wrapper = render(
                <Modal keepMounted={true} open={false} dataTestId='Modal'>
                    <div>ModalContent</div>
                </Modal>,
            );
            const modalNode = wrapper.queryByRole('dialog');
            expect(modalNode).toHaveClass('hidden');

            wrapper.rerender(
                <Modal keepMounted={true} open={true} dataTestId='Modal'>
                    <div>ModalContent</div>
                </Modal>,
            );
            expect(modalNode).not.toHaveClass('hidden');
        });
    });

    describe('two modal at the same time', () => {
        it('should open and close', () => {
            const TestCase = (props?: Partial<ModalProps>) => {
                const defaultProps = { open: false, ...props };
                return (
                    <React.Fragment>
                        <Modal {...defaultProps}>
                            <div>Hello</div>
                        </Modal>
                        <Modal {...defaultProps}>
                            <div>World</div>
                        </Modal>
                    </React.Fragment>
                );
            };

            const { rerender } = render(<TestCase open={false} />);
            expect(document.body.style.overflow).toStrictEqual('');
            rerender(<TestCase open={true} />);
            expect(document.body.style.overflow).toStrictEqual('hidden');
            rerender(<TestCase open={false} />);
            expect(document.body.style.overflow).toStrictEqual('');
        });
    });

    it('should be able to change the container', () => {
        const modal = (props?: Partial<ModalProps>) => (
            <React.Fragment>
                <div id='container-1' />
                <div id='container-2' />
                <Modal open={false} dataTestId='Modal' {...props}>
                    <h1>Hello</h1>
                </Modal>
            </React.Fragment>
        );

        const { rerender, getByTestId } = render(modal());

        const container1 = document.getElementById('container-1');
        const container2 = document.getElementById('container-2');

        rerender(modal({ open: true, container: () => container1 as HTMLElement }));

        expect(container1).toContainElement(getByTestId('Modal'));

        rerender(modal({ open: true, container: () => container2 as HTMLElement }));

        expect(container2).toContainElement(getByTestId('Modal'));
    });
});
