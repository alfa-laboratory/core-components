import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { CheckboxGroup, CheckboxGroupProps } from './index';
import { Checkbox } from '../../checkbox/src';
import { Tag } from '../../tag/src';

const Group = ({ ...restProps }: Partial<CheckboxGroupProps>) => (
    <CheckboxGroup label='Заголовок группы' {...restProps}>
        <Checkbox label='Первый вариант' name='one' className='my-checkbox' />

        <Checkbox label='Второй вариант' name='two' />

        <Checkbox label='Третий вариант' name='three' />
    </CheckboxGroup>
);

const TagGroup = ({ ...restProps }: Partial<CheckboxGroupProps>) => (
    <CheckboxGroup label='Заголовок группы' type='tag' {...restProps}>
        <Tag name='one' className='my-tag'>
            Первый вариант
        </Tag>

        <Tag name='two'>Второй вариант</Tag>

        <Tag name='three'>Третий вариант</Tag>
    </CheckboxGroup>
);

describe('Checkbox', () => {
    describe('Display tests', () => {
        it('should display with children like boolean or string or others react children type correctly', () => {
            expect(
                render(
                    <CheckboxGroup label='Заголовок группы'>
                        {0 && (
                            <Checkbox label='Первый вариант' name='one' className='my-checkbox' />
                        )}
                        {false && (
                            <Checkbox label='Первый вариант' name='one' className='my-checkbox' />
                        )}
                        {null && (
                            <Checkbox label='Первый вариант' name='one' className='my-checkbox' />
                        )}
                        {'' && (
                            <Checkbox label='Первый вариант' name='one' className='my-checkbox' />
                        )}
                    </CheckboxGroup>,
                ),
            ).toMatchSnapshot();
        });

        it('should display checkbox group with one child correctly', () => {
            expect(
                render(
                    <CheckboxGroup label='Заголовок группы'>
                        <Checkbox label='Первый вариант' name='one' className='my-checkbox' />
                    </CheckboxGroup>,
                ),
            ).toMatchSnapshot();
        });

        it('should display checkbox group correctly', () => {
            expect(render(<Group />)).toMatchSnapshot();
        });

        it('should display tag group correctly', () => {
            expect(render(<TagGroup />)).toMatchSnapshot();
        });

        it('should display checkbox group with error correctly', () => {
            expect(render(<Group error='Error' />)).toMatchSnapshot();
        });
    });

    describe('Styles tests', () => {
        it('should set custom class', () => {
            const className = 'custom-class';
            const { container } = render(<Group className={className} />);

            expect(container.firstElementChild).toHaveClass(className);
        });

        it('should set `vertical` class', () => {
            const { container } = render(<Group direction='vertical' />);

            expect(container.firstElementChild).toHaveClass('vertical');
        });

        it('should set `error` class', () => {
            const { container } = render(<Group error='Error message' />);

            expect(container.firstElementChild).toHaveClass('error');
        });
    });

    describe('Attributes tests', () => {
        it('should set `data-test-id` atribute', () => {
            const dataTestId = 'test-id';
            const { container } = render(<Group dataTestId={dataTestId} />);

            const testIdAttr = container.firstElementChild?.getAttribute('data-test-id');

            expect(testIdAttr).toBe(dataTestId);
        });
    });

    describe('Render tests', () => {
        it('should unmount without errors', () => {
            const { unmount } = render(<Group />);

            expect(unmount).not.toThrowError();
        });

        it('should contain label', () => {
            const labelText = 'I am label';

            const { getByText } = render(<Group label={labelText} />);

            expect(getByText(labelText)).toBeInTheDocument();
        });

        it('should contain error message', () => {
            const errorText = 'I am error';

            const { getByText } = render(<Group error={errorText} />);

            expect(getByText(errorText)).toBeInTheDocument();
        });

        it('should disable all checkboxes if `disabled` prop is present', () => {
            const { container } = render(<Group disabled={true} />);

            const inputs = container.querySelectorAll('input');

            let allDisabled = true;

            inputs.forEach(input => {
                if (!input.disabled) {
                    allDisabled = false;
                }
            });

            expect(allDisabled).toBe(true);
        });
    });
});

describe('Interaction tests', () => {
    test('should call `onChange` callback if click on checkbox', () => {
        const cb = jest.fn();

        const { container } = render(<Group onChange={cb} />);

        const checkbox = container.querySelector('.my-checkbox');

        if (checkbox) {
            fireEvent.click(checkbox);
        }

        expect(cb).toBeCalledTimes(1);
    });

    test('should call `onChange` callback if click on tag', () => {
        const cb = jest.fn();

        const { container } = render(<TagGroup onChange={cb} />);

        const tag = container.querySelector('.my-tag');

        if (tag) {
            fireEvent.click(tag);
        }

        expect(cb).toBeCalledTimes(1);
    });
});
