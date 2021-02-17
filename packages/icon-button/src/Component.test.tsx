import React, { MouseEvent } from 'react';
import { render, fireEvent } from '@testing-library/react';

import { StarMIcon } from '@alfalab/icons-glyph';

import { IconButton } from './index';

describe('IconButton', () => {
    describe('Snapshots tests', () => {
        it('should match snapshot', () => {
            expect(render(<IconButton icon={StarMIcon} />)).toMatchSnapshot();
        });
    });

    describe('Attributes tests', () => {
        it('should set `data-test-id` attribute', () => {
            const dataTestId = 'test-id';
            const { getByTestId } = render(<IconButton icon={StarMIcon} dataTestId={dataTestId} />);

            expect(getByTestId(dataTestId).tagName).toBe('BUTTON');
        });
    });

    describe('Classes tests', () => {
        it('should set `className` class', () => {
            const className = 'test-class';
            const { container } = render(<IconButton icon={StarMIcon} className={className} />);

            expect(container.firstElementChild).toHaveClass(className);
        });

        (['xxs', 'xs', 's'] as const).forEach(size => {
            it('should set `size` class on icon wrapper', () => {
                const { container } = render(<IconButton icon={StarMIcon} size={size} />);

                expect(container.querySelector('.iconWrapper')).toHaveClass(size);
            });
        });

        it('should set `view` class', () => {
            const view = 'primary';
            const { container } = render(<IconButton icon={StarMIcon} view={view} />);

            expect(container.firstElementChild).toHaveClass(view);
        });
    });

    describe('Callbacks tests', () => {
        it('should call `onClick` prop', () => {
            const cb = jest.fn();
            const dataTestId = 'test-id';
            const { getByTestId } = render(
                <IconButton icon={StarMIcon} onClick={cb} dataTestId={dataTestId} />,
            );

            fireEvent.click(getByTestId(dataTestId));

            expect(cb).toBeCalledTimes(1);
        });

        it('should not call `onClick` prop if disabled', () => {
            const cb = jest.fn();
            const dataTestId = 'test-id';
            const { getByTestId } = render(
                <IconButton
                    icon={StarMIcon}
                    onClick={cb}
                    dataTestId={dataTestId}
                    disabled={true}
                />,
            );

            fireEvent.click(getByTestId(dataTestId));

            expect(cb).not.toBeCalled();
        });

        /**
         * Тест нужен для проверки типа eventTarget (HTMLIconButtonElement/HTMLAnchorElement).
         * Если тест скомпилился - то все ок.
         */
        it('target should contain button element', () => {
            const dataTestId = 'test-id';
            const { getByTestId } = render(
                <IconButton icon={StarMIcon} onClick={cb} dataTestId={dataTestId} />,
            );

            const buttonNode = getByTestId(dataTestId);

            function cb(event: MouseEvent<HTMLButtonElement>) {
                expect(event.target).toBe(buttonNode);
            }

            fireEvent.click(buttonNode, { target: buttonNode });
        });
    });

    it('should unmount without errors', () => {
        const { unmount } = render(<IconButton icon={StarMIcon}>Text</IconButton>);

        expect(unmount).not.toThrowError();
    });
});
