import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Attach } from './index';

describe('Attach', () => {
    describe('Snapshots tests', () => {
        it('should match snapshot', () => {
            const { container } = render(<Attach />);

            expect(container).toMatchSnapshot();
        });
    });

    it('should forward ref to input', () => {
        const ref = jest.fn();
        const dataTestId = 'test-id';
        const { getByTestId } = render(<Attach ref={ref} dataTestId={dataTestId} />);

        expect(ref.mock.calls).toEqual([[getByTestId(dataTestId)]]);
    });

    it('should set `data-test-id` attribute to input', () => {
        const dataTestId = 'test-id';
        const { getByTestId } = render(<Attach dataTestId={dataTestId} />);

        expect(getByTestId(dataTestId).tagName).toBe('INPUT');
    });

    describe('Classes tests', () => {
        it('should set `className` class', () => {
            const className = 'test-class';
            const { container } = render(<Attach className={className} />);

            expect(container.firstElementChild).toHaveClass(className);
        });

        it('should set `disabled` atribute', () => {
            const dataTestId = 'test-id';
            const { container, getByTestId } = render(
                <Attach disabled={true} dataTestId={dataTestId} />,
            );

            expect(container.firstElementChild).toHaveClass('disabled');
            expect(getByTestId(dataTestId)).toHaveAttribute('disabled');
        });
    });

    describe('Callbacks tests', () => {
        it('should call `onChange` prop', async () => {
            const cb = jest.fn();
            const dataTestId = 'test-id';
            const { getByTestId } = render(<Attach onChange={cb} dataTestId={dataTestId} />);

            const input = getByTestId(dataTestId) as HTMLInputElement;

            fireEvent.change(input, {
                target: {
                    files: [
                        {
                            name: 'test.txt',
                            type: 'application/text',
                        },
                    ],
                },
            });

            expect(cb).toBeCalledTimes(1);
            expect(input.files && input.files.length).toEqual(1);
        });

        it('should not call `onChange` prop if disabled', async () => {
            const cb = jest.fn();
            const dataTestId = 'test-id';
            const { getByTestId } = render(
                <Attach onChange={cb} dataTestId={dataTestId} disabled={true} />,
            );

            const input = getByTestId(dataTestId) as HTMLInputElement;

            await userEvent.upload(input, {
                name: 'test.txt',
                type: 'application/text',
            } as File);

            expect(cb).not.toBeCalled();
            expect(input.files && input.files.length).toEqual(0);
        });
    });

    describe('Files tests', () => {
        it('should render selected file name if one file selected', () => {
            const dataTestId = 'test-id';
            const { container, getByTestId } = render(<Attach dataTestId={dataTestId} />);

            const input = getByTestId(dataTestId) as HTMLInputElement;

            fireEvent.change(input, {
                target: {
                    files: [
                        {
                            name: 'test.txt',
                            type: 'application/text',
                        },
                    ],
                },
            });

            expect(container.textContent).toContain('test.txt');
        });

        it('should render selected files count if several files selected', () => {
            const dataTestId = 'test-id';
            const { container, getByTestId } = render(
                <Attach multiple={true} dataTestId={dataTestId} />,
            );

            const input = getByTestId(dataTestId) as HTMLInputElement;

            fireEvent.change(input, {
                target: {
                    files: [
                        {
                            name: 'test1.txt',
                            type: 'application/text',
                        },
                        {
                            name: 'test2.txt',
                            type: 'application/text',
                        },
                        {
                            name: 'test3.txt',
                            type: 'application/text',
                        },
                    ],
                },
            });

            expect(container.textContent).toContain('3 файла');
        });

        it('should render "no file" and clear input value after clear button was clicked', () => {
            const dataTestId = 'test-id';
            const { container, getByTestId } = render(<Attach dataTestId={dataTestId} />);

            const input = getByTestId(dataTestId) as HTMLInputElement;

            fireEvent.change(input, {
                target: {
                    files: [
                        {
                            name: 'test.txt',
                            type: 'application/text',
                        },
                    ],
                },
            });

            expect(container.textContent).toContain('test.txt');

            const clearButton = container.querySelector('.clear');

            if (clearButton) {
                fireEvent.click(clearButton);
            }

            expect(container.textContent).toContain('Нет файла');
            expect(input.value).toBeFalsy();
        });

        it('should truncate the filename if the maxFilenameLength prop is passed', () => {
            const dataTestId = 'test-id';
            const { container, getByTestId } = render(
                <Attach maxFilenameLength={30} dataTestId={dataTestId} />,
            );

            const input = getByTestId(dataTestId) as HTMLInputElement;

            fireEvent.change(input, {
                target: {
                    files: [
                        {
                            name: 'so_long_filename_it_definitely_has_more_than_30_symbols.txt',
                            type: 'application/text',
                        },
                    ],
                },
            });

            expect(container.textContent).toContain('so_long_filena…30_symbols.txt');

            const clearButton = container.querySelector('.clear');

            if (clearButton) {
                fireEvent.click(clearButton);
            }

            fireEvent.change(input, {
                target: {
                    files: [
                        {
                            name: 'it_has_just_26_symbols.txt',
                            type: 'application/text',
                        },
                    ],
                },
            });

            expect(container.textContent).toContain('it_has_just_26_symbols.txt');
        });
    });

    it('should unmount without errors', () => {
        const { unmount } = render(<Attach />);

        expect(unmount).not.toThrowError();
    });
});
