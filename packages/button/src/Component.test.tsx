import React, { MouseEvent, useState, FC } from 'react';
import { render, fireEvent, waitFor, waitForElementToBeRemoved } from '@testing-library/react';

import { Button, ButtonProps, LOADER_MIN_DISPLAY_INTERVAL } from './index';

const dataTestId = 'test-id';

const ButtonWithLoader: FC<ButtonProps & { timeout: number }> = ({ timeout, ...restProps }) => {
    const [loading, setLoading] = useState(false);

    return (
        <Button
            {...restProps}
            loading={loading}
            onClick={() => {
                setLoading(true);

                setTimeout(() => {
                    setLoading(false);
                }, timeout);
            }}
        >
            Button
        </Button>
    );
};

describe('Button', () => {
    describe('Snapshots tests', () => {
        it('should match snapshot', () => {
            expect(render(<Button />)).toMatchSnapshot();
        });

        it('should render left addons', () => {
            expect(render(<Button leftAddons={<div>Left addons</div>} />)).toMatchSnapshot();
        });

        it('should render right addons', () => {
            expect(render(<Button rightAddons={<div>Right addons</div>} />)).toMatchSnapshot();
        });

        it('should render button by default', () => {
            expect(render(<Button />)).toMatchSnapshot();
        });

        it('should render anchor if href pass', () => {
            expect(render(<Button href='https://some-url' />)).toMatchSnapshot();
        });

        it('should render loader if loading pass', () => {
            expect(render(<Button loading={true} />)).toMatchSnapshot();
        });

        it('should render loader if loading & href pass', () => {
            expect(render(<Button loading={true} href='https://some-url' />)).toMatchSnapshot();
        });
    });

    describe('Attributes tests', () => {
        it('should set `data-test-id` attribute', () => {
            const { getByTestId } = render(<Button dataTestId={dataTestId} />);

            expect(getByTestId(dataTestId).tagName).toBe('BUTTON');
        });

        it('should set rel="noreferrer noopener" if "href" and target="_blank" are passed', () => {
            const { container } = render(<Button href='#' target='_blank' />);

            const relAttr = container.firstElementChild?.getAttribute('rel');

            expect(relAttr).toBe('noreferrer noopener');
        });

        it('should set type="button" by default', () => {
            const { container } = render(<Button />);
            expect(container.firstElementChild).toHaveAttribute('type', 'button');
        });

        it('should set type attribute', () => {
            const type = 'submit';
            const { container } = render(<Button type={type} />);
            expect(container.firstElementChild).toHaveAttribute('type', type);
        });
    });

    describe('Classes tests', () => {
        it('should set `className` class', () => {
            const className = 'test-class';
            const { container } = render(<Button className={className} />);

            expect(container.firstElementChild).toHaveClass(className);
        });

        it('should set `size` class', () => {
            const size = 'm';
            const { container } = render(<Button size={size} />);

            expect(container.firstElementChild).toHaveClass(size);
        });

        it('should set `block` class', () => {
            const { container } = render(<Button block={true} />);

            expect(container.firstElementChild).toHaveClass('block');
        });

        it('should set `view` class', () => {
            const view = 'primary';
            const { container } = render(<Button view={view} />);

            expect(container.firstElementChild).toHaveClass(view);
        });

        it('should set `iconOnly` class', () => {
            const { container } = render(<Button />);

            expect(container.firstElementChild).toHaveClass('iconOnly');
        });

        it('should set `nowrap` class', () => {
            const { container } = render(<Button nowrap={true} />);

            expect(container.firstElementChild).toHaveClass('nowrap');
        });
    });

    describe('Callbacks tests', () => {
        it('should call `onClick` prop', () => {
            const cb = jest.fn();

            const { getByTestId } = render(<Button onClick={cb} dataTestId={dataTestId} />);

            fireEvent.click(getByTestId(dataTestId));

            expect(cb).toBeCalledTimes(1);
        });

        it('should not call `onClick` prop if disabled', () => {
            const cb = jest.fn();

            const { getByTestId } = render(
                <Button onClick={cb} dataTestId={dataTestId} disabled={true} />,
            );

            fireEvent.click(getByTestId(dataTestId));

            expect(cb).not.toBeCalled();
        });

        /**
         * Тест нужен для проверки типа eventTarget (HTMLButtonElement/HTMLAnchorElement).
         * Если тест скомпилился - то все ок.
         */
        it('target should contain button element', () => {
            const { getByTestId } = render(<Button onClick={cb} dataTestId={dataTestId} />);

            const buttonNode = getByTestId(dataTestId);

            function cb(event: MouseEvent<HTMLButtonElement>) {
                expect(event.target).toBe(buttonNode);
            }

            fireEvent.click(buttonNode, { target: buttonNode });
        });

        /**
         * Тест нужен для проверки типа eventTarget (HTMLButtonElement/HTMLAnchorElement).
         * Если тест скомпилился - то все ок.
         */
        it('target should contain anchor element', () => {
            const { getByTestId } = render(
                <Button onClick={cb} dataTestId={dataTestId} href='#' />,
            );

            const anchorNode = getByTestId(dataTestId);

            function cb(event: MouseEvent<HTMLAnchorElement>) {
                expect(event.target).toBe(anchorNode);
            }

            fireEvent.click(anchorNode, { target: anchorNode });
        });
    });

    describe('Loader tests', () => {
        it('should keep loader during LOADER_MIN_DISPLAY_INTERVAL ms', async () => {
            const { getByTestId, container } = render(
                <ButtonWithLoader timeout={100} dataTestId={dataTestId} />,
            );

            const button = getByTestId(dataTestId);
            const getLoader = () => container.querySelector('svg');

            const start = Date.now();

            fireEvent.click(button);

            await waitFor(() => expect(getLoader()).toBeInTheDocument());

            await waitForElementToBeRemoved(getLoader());

            const duration = Date.now() - start;

            expect(duration).toBeGreaterThanOrEqual(LOADER_MIN_DISPLAY_INTERVAL);
        });

        it('should keep loader during TIMEOUT ms, if TIMEOUT > LOADER_MIN_DISPLAY_INTERVAL', async () => {
            const TIMEOUT = LOADER_MIN_DISPLAY_INTERVAL + 500;

            const { getByTestId, container } = render(
                <ButtonWithLoader timeout={TIMEOUT} dataTestId={dataTestId} />,
            );

            const button = getByTestId(dataTestId);
            const getLoader = () => container.querySelector('svg');

            const start = Date.now();

            fireEvent.click(button);

            await waitFor(() => expect(getLoader()).toBeInTheDocument());

            await waitForElementToBeRemoved(getLoader());

            const duration = Date.now() - start;

            expect(duration).toBeGreaterThanOrEqual(TIMEOUT);
        });
    });

    it('should unmount without errors', () => {
        const { unmount } = render(
            <Button leftAddons={<span>Left</span>} rightAddons={<span>Right</span>}>
                Text
            </Button>,
        );

        expect(unmount).not.toThrowError();
    });
});
