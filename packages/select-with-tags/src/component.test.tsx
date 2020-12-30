import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';

import { SelectWithTags } from './index';

const options = [
    { key: '1', content: 'H', value: 'H' },
    { key: '2', content: 'Li', value: 'Li' },
    { key: '3', content: 'Na', value: 'Na' },
    { key: '4', content: 'Curium', value: 'Curium' },
    { key: '5', content: 'Berkelium', value: 'Berkelium' },
    { key: '6', content: 'Californium', value: 'Californium' },
    { key: '7', content: 'Einsteinium', value: 'Einsteinium' },
    { key: '8', content: 'Fermium', value: 'Fermium' },
    { key: '9', content: 'Mendelevium', value: 'Mendelevium' },
    { key: '10', content: 'Nobelium', value: 'Nobelium' },
    { key: '11', content: 'Lawrencium', value: 'Lawrencium' },
    { key: '12', content: 'Rutherfordium', value: 'Rutherfordium' },
    { key: '13', content: 'Dubnium', value: 'Dubnium' },
    { key: '14', content: 'Seaborgium', value: 'Seaborgium' },
    { key: '15', content: 'Bohrium', value: 'Bohrium' },
];

describe('SelectWithTags', () => {
    describe('Display tests', () => {
        it('should match snapshot', () => {
            const { container } = render(
                <SelectWithTags options={options} value='' onInput={jest.fn()} />,
            );

            expect(container).toMatchSnapshot();
        });

        it('should match snapshot with selected tags', () => {
            const { container } = render(
                <SelectWithTags
                    options={options}
                    value=''
                    selected={['1', '2', '3']}
                    onInput={jest.fn()}
                />,
            );

            expect(container).toMatchSnapshot();
        });
    });

    describe('Attributes tests', () => {
        it('should forward ref', () => {
            const ref = jest.fn();

            render(<SelectWithTags options={options} value='' onInput={jest.fn()} ref={ref} />);

            expect(ref).toBeCalled();
        });

        it('should pass value', () => {
            const value = '123';

            const { container } = render(
                <SelectWithTags options={options} value={value} onInput={jest.fn()} />,
            );

            const input = container.querySelector('input') as HTMLInputElement;

            expect(input.value).toBe(value);
        });

        it('should render input if autocomplete=`true`', () => {
            const { container } = render(
                <SelectWithTags
                    options={options}
                    value=''
                    onInput={jest.fn()}
                    autocomplete={true}
                />,
            );

            const input = container.querySelector('input') as HTMLInputElement;

            expect(input).toBeInTheDocument();
        });

        it('should render input by default', () => {
            const { container } = render(
                <SelectWithTags options={options} value='' onInput={jest.fn()} />,
            );

            const input = container.querySelector('input') as HTMLInputElement;

            expect(input).toBeInTheDocument();
        });

        it('should not render input if autocomplete=`false`', () => {
            const { container } = render(
                <SelectWithTags
                    options={options}
                    value=''
                    onInput={jest.fn()}
                    autocomplete={false}
                />,
            );

            const input = container.querySelector('input') as HTMLInputElement;

            expect(input).not.toBeInTheDocument();
        });
    });

    describe('Callback tests', () => {
        it('should call `onInput` fn', async () => {
            const cb = jest.fn();
            const { container } = render(
                <SelectWithTags options={options} value='' onInput={cb} />,
            );

            const input = container.querySelector('input') as HTMLInputElement;

            const event = { target: { value: 'Nob' } };

            fireEvent.change(input, event);

            expect(cb).toBeCalled();
        });

        it('should call `match` fn', () => {
            const match = jest.fn();
            const { container } = render(
                <SelectWithTags options={options} value='' onInput={jest.fn()} match={match} />,
            );

            const input = container.querySelector('input') as HTMLInputElement;

            const event = { target: { value: 'Nob' } };

            fireEvent.change(input, event);

            expect(match).toBeCalled();
        });
    });

    describe('Open/close tests', () => {
        it('should open menu on focus input, close on blur', async () => {
            const { container } = render(
                <SelectWithTags options={options} value='' onInput={jest.fn()} />,
            );

            const input = container.querySelector('input') as HTMLInputElement;

            await waitFor(() => {
                fireEvent.focus(input);

                expect(document.querySelector('[role="option"]')).toBeInTheDocument();
            });

            await waitFor(() => {
                fireEvent.blur(input);

                expect(document.querySelector('[role="option"]')).not.toBeInTheDocument();
            });
        });

        it('should open menu on click to input, do not close on click on input', async () => {
            const { container } = render(
                <SelectWithTags options={options} value='' onInput={jest.fn()} />,
            );

            const input = container.querySelector('input') as HTMLInputElement;

            await waitFor(() => {
                fireEvent.click(input);

                expect(document.querySelector('[role="option"]')).toBeInTheDocument();
            });

            await waitFor(() => {
                fireEvent.click(input);

                expect(document.querySelector('[role="option"]')).toBeInTheDocument();
            });
        });
    });

    describe('Tags tests', () => {
        it('should render tag if click on option, delete tag if click on cross', async () => {
            const getOptions = () => document.querySelectorAll('[role="option"]');

            const { container } = render(
                <SelectWithTags options={options} value='' onInput={jest.fn()} />,
            );

            const input = container.querySelector('input') as HTMLInputElement;

            await waitFor(() => {
                fireEvent.click(input);

                expect(document.querySelector('[role="option"]')).toBeInTheDocument();
            });

            fireEvent.click(getOptions()[0]);

            await waitFor(() => {
                expect(container.querySelectorAll('button').length).toBe(1);
            });

            /**
             * При клике на option в компоненте вызывается input.focus() и меню открывается.
             * В тестах это почему-то не работает, приходится вызывать руками.
             */
            await waitFor(() => {
                fireEvent.focus(input);

                expect(document.querySelector('[role="option"]')).toBeInTheDocument();
            });

            fireEvent.click(getOptions()[1]);

            await waitFor(() => {
                expect(container.querySelectorAll('button').length).toBe(2);
            });

            await waitFor(() => {
                const tags = container.querySelectorAll('button');

                const tag = tags[0];

                if (tag) {
                    const tagCross = tags[0].querySelector('svg');

                    fireEvent.click(tagCross as SVGSVGElement);
                }

                expect(tags.length).toBe(1);
            });

            await waitFor(() => {
                const tags = container.querySelectorAll('button');

                fireEvent.keyDown(input, { key: 'Backspace' });

                expect(tags.length).toBe(0);
            });
        });
    });

    describe('Render tests', () => {
        it('should unmount without errors', () => {
            const { unmount } = render(
                <SelectWithTags options={options} value='' onInput={jest.fn()} />,
            );

            expect(unmount).not.toThrowError();
        });
    });
});
