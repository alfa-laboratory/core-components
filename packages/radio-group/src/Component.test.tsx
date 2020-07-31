import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { RadioGroup, RadioGroupProps } from './index';
import { Radio } from '../../radio/src';
import { Tag } from '../../tag/src';

const Group = ({ ...restProps }: Partial<RadioGroupProps>) => (
    <RadioGroup label='Заголовок группы' {...restProps}>
        <Radio label='Первый вариант' value='one' className='my-radio' />

        <Radio label='Второй вариант' value='two' className='my-second-radio' />

        <Radio label='Третий вариант' value='three' />
    </RadioGroup>
);

const TagGroup = ({ ...restProps }: Partial<RadioGroupProps>) => (
    <RadioGroup label='Заголовок группы' type='tag' {...restProps}>
        <Tag name='one' className='my-tag'>
            Первый вариант
        </Tag>

        <Tag name='two'>Второй вариант</Tag>

        <Tag name='three'>Третий вариант</Tag>
    </RadioGroup>
);

describe('RadioGroup', () => {
    describe('Display tests', () => {
        it('should display with children like boolean or string or others react children type correctly', () => {
            expect(
                render(
                    <RadioGroup label='Заголовок группы'>
                        {0 && <Radio label='Первый вариант' value='one' />}
                        {false && <Radio label='Первый вариант' value='one' />}
                        {null && <Radio label='Первый вариант' value='one' />}
                        {'' && <Radio label='Первый вариант' value='one' />}
                    </RadioGroup>,
                ),
            ).toMatchSnapshot();
        });

        it('should display radio group with one child correctly', () => {
            expect(
                render(
                    <RadioGroup label='Заголовок группы'>
                        <Radio label='Первый вариант' value='one' className='radio-group' />
                    </RadioGroup>,
                ),
            ).toMatchSnapshot();
        });

        it('should display radio group correctly', () => {
            expect(render(<Group />)).toMatchSnapshot();
        });

        it('should display tag radio group correctly', () => {
            expect(render(<TagGroup />)).toMatchSnapshot();
        });

        it('should display radio group with error correctly', () => {
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

        it('should disable all inputs if `disabled` prop is present', () => {
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
    test('should call `onChange` callback if click on radio', () => {
        const cb = jest.fn();

        const { container } = render(<Group onChange={cb} />);

        const radio = container.querySelector('.my-radio');

        if (radio) {
            fireEvent.click(radio);
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

    test('should set "checked" classname for Radio with suitable value', () => {
        const { container } = render(<Group value='one' />);

        const radio = container.querySelector('.my-radio');

        expect(radio).toHaveClass('checked');
    });

    test('should pass "checked" classname to Radio after click', () => {
        const { container } = render(<Group />);

        const firstRadio = container.querySelector('.my-radio');
        const secondRadio = container.querySelector('.my-second-radio');
        expect(firstRadio).not.toHaveClass('checked');
        expect(secondRadio).not.toHaveClass('checked');
        if (firstRadio) {
            fireEvent.click(firstRadio);
        }
        expect(firstRadio).toHaveClass('checked');
        expect(secondRadio).not.toHaveClass('checked');
        if (secondRadio) {
            fireEvent.click(secondRadio);
        }
        expect(firstRadio).not.toHaveClass('checked');
        expect(secondRadio).toHaveClass('checked');
    });
});
