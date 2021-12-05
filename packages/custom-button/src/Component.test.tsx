import React, { MouseEvent } from 'react';
import { render, fireEvent } from '@testing-library/react';

import { CustomButton } from './index';

const dataTestId = 'test-id';

describe('CustomButton', () => {
    describe('Snapshots tests', () => {
        it('should match snapshot', () => {
            expect(render(<CustomButton />)).toMatchSnapshot();
        });

        it('should render custom background color', () => {
            expect(render(<CustomButton backgroundColor='#00ff00' />)).toMatchSnapshot();
        });

        it('should render black color content', () => {
            expect(render(<CustomButton contentColor='black' />)).toMatchSnapshot();
        });

        it('should render left addons', () => {
            expect(render(<CustomButton leftAddons={<div>Left addons</div>} />)).toMatchSnapshot();
        });

        it('should render right addons', () => {
            expect(
                render(<CustomButton rightAddons={<div>Right addons</div>} />),
            ).toMatchSnapshot();
        });

        it('should render CustomButton by default', () => {
            expect(render(<CustomButton />)).toMatchSnapshot();
        });

        it('should render anchor if href pass', () => {
            expect(render(<CustomButton href='https://some-url' />)).toMatchSnapshot();
        });

        it('should render loader if loading pass', () => {
            expect(render(<CustomButton loading={true} />)).toMatchSnapshot();
        });

        it('should render loader if loading & href pass', () => {
            expect(
                render(<CustomButton loading={true} href='https://some-url' />),
            ).toMatchSnapshot();
        });
    });

    describe('Attributes tests', () => {
        it('should set `data-test-id` attribute', () => {
            const { getByTestId } = render(<CustomButton dataTestId={dataTestId} />);

            expect(getByTestId(dataTestId).tagName).toBe('BUTTON');
        });

        it('should set rel="noreferrer noopener" if "href" and target="_blank" are passed', () => {
            const { container } = render(<CustomButton href='#' target='_blank' />);

            const relAttr = container.firstElementChild?.getAttribute('rel');

            expect(relAttr).toBe('noreferrer noopener');
        });

        it('should have `style` attribute', () => {
            const { container } = render(<CustomButton />);

            expect(container.firstElementChild).toHaveAttribute('style');
        });

        it('should set type="button" by default', () => {
            const { container } = render(<CustomButton />);
            expect(container.firstElementChild).toHaveAttribute('type', 'button');
        });

        it('should set type attribute', () => {
            const type = 'submit';
            const { container } = render(<CustomButton type={type} />);
            expect(container.firstElementChild).toHaveAttribute('type', type);
        });
    });

    describe('Classes tests', () => {
        it('should set `className` class', () => {
            const className = 'test-class';
            const { container } = render(<CustomButton className={className} />);

            expect(container.firstElementChild).toHaveClass(className);
        });

        it('should have `customButton` class as default', () => {
            const { container } = render(<CustomButton />);
            expect(container.firstElementChild).toHaveClass('customButton');
        });

        it('should have `white` class as default', () => {
            const { container } = render(<CustomButton />);
            expect(container.firstElementChild).toHaveClass('customButton');
        });

        it('should have `black` class', () => {
            const { container } = render(<CustomButton contentColor='black' />);
            expect(container.firstElementChild).toHaveClass('black');
        });

        it('should set `size` class', () => {
            const size = 'm';
            const { container } = render(<CustomButton size={size} />);

            expect(container.firstElementChild).toHaveClass(size);
        });

        it('should set `block` class', () => {
            const { container } = render(<CustomButton block={true} />);

            expect(container.firstElementChild).toHaveClass('block');
        });

        it('should set `iconOnly` class', () => {
            const { container } = render(<CustomButton />);

            expect(container.firstElementChild).toHaveClass('iconOnly');
        });

        it('should set `nowrap` class', () => {
            const { container } = render(<CustomButton nowrap={true} />);

            expect(container.firstElementChild).toHaveClass('nowrap');
        });
    });

    describe('Callbacks tests', () => {
        it('should call `onClick` prop', () => {
            const cb = jest.fn();

            const { getByTestId } = render(<CustomButton onClick={cb} dataTestId={dataTestId} />);

            fireEvent.click(getByTestId(dataTestId));

            expect(cb).toBeCalledTimes(1);
        });

        it('should not call `onClick` prop if disabled', () => {
            const cb = jest.fn();

            const { getByTestId } = render(
                <CustomButton onClick={cb} dataTestId={dataTestId} disabled={true} />,
            );

            fireEvent.click(getByTestId(dataTestId));

            expect(cb).not.toBeCalled();
        });

        /**
         * Тест нужен для проверки типа eventTarget (HTMLCustomButtonElement/HTMLAnchorElement).
         * Если тест скомпилился - то все ок.
         */
        it('target should contain CustomButton element', () => {
            const { getByTestId } = render(<CustomButton onClick={cb} dataTestId={dataTestId} />);

            const CustomButtonNode = getByTestId(dataTestId);

            function cb(event: MouseEvent<HTMLButtonElement>) {
                expect(event.target).toBe(CustomButtonNode);
            }

            fireEvent.click(CustomButtonNode, { target: CustomButtonNode });
        });

        /**
         * Тест нужен для проверки типа eventTarget (HTMLCustomButtonElement/HTMLAnchorElement).
         * Если тест скомпилился - то все ок.
         */
        it('target should contain anchor element', () => {
            const { getByTestId } = render(
                <CustomButton onClick={cb} dataTestId={dataTestId} href='#' />,
            );

            const anchorNode = getByTestId(dataTestId);

            function cb(event: MouseEvent<HTMLAnchorElement>) {
                expect(event.target).toBe(anchorNode);
            }

            fireEvent.click(anchorNode, { target: anchorNode });
        });
    });

    describe('Custom component', () => {
        it('should use custom component', () => {
            const cb = jest.fn();
            cb.mockReturnValue(null);

            render(<CustomButton Component={cb} dataTestId={dataTestId} />);

            expect(cb).toBeCalled();

            const props = cb.mock.calls[0][0];
            expect(props['data-test-id']).toBe(dataTestId);
        });

        it('should pass `to` instead `href` to custom component', () => {
            const cb = jest.fn();
            cb.mockReturnValue(null);

            render(<CustomButton Component={cb} href='test' />);

            expect(cb).toBeCalled();

            const props = cb.mock.calls[0][0];

            expect(props.href).toBeFalsy();
            expect(props.to).toBe('test');
        });
    });

    it('should unmount without errors', () => {
        const { unmount } = render(
            <CustomButton leftAddons={<span>Left</span>} rightAddons={<span>Right</span>}>
                Text
            </CustomButton>,
        );

        expect(unmount).not.toThrowError();
    });
});
