import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { FilterTag } from './index';

describe('Snapshots tests', () => {
    it('should match snapshot', () => {
        expect(render(<FilterTag>Press me</FilterTag>)).toMatchSnapshot();
    });

    it('should match snapshot variant=alt', () => {
        expect(render(<FilterTag variant='alt'>Press me</FilterTag>)).toMatchSnapshot();
    });

    it('should match without children snapshot', () => {
        expect(render(<FilterTag />)).toMatchSnapshot();
    });

    it('should match snapshot with alt variant ', () => {
        expect(render(<FilterTag variant='alt'>Press me</FilterTag>)).toMatchSnapshot();
    });
});

describe('Classes tests', () => {
    it('should set custom class', () => {
        const className = 'custom-class';

        const { container } = render(<FilterTag className={className} />);

        expect(container.firstElementChild).toHaveClass(className);
    });

    it('should set size `s` as default size', () => {
        const { container } = render(<FilterTag />);

        expect(container.firstElementChild).toHaveClass('s');
    });

    it('should set size', () => {
        const { container } = render(<FilterTag size='xs' />);

        expect(container.firstElementChild).toHaveClass('xs');
    });

    it('should set `checked` class if prop `checked` is present', () => {
        const { container } = render(<FilterTag checked={true} />);

        expect(container.firstElementChild).toHaveClass('checked');
    });

    it('should set `open` class if prop `open` is present', () => {
        const { container } = render(<FilterTag open={true} />);

        expect(container.firstElementChild).toHaveClass('open');
    });

    it('should set `alt` class if prop `variant=alt`', () => {
        const { container } = render(<FilterTag variant='alt' />);

        expect(container.firstElementChild).toHaveClass('alt');
    });

    it('should set `disabled` class if prop `disabled` is present`', () => {
        const { container } = render(<FilterTag disabled={true} />);

        expect(container.firstElementChild).toHaveClass('disabled');
    });
});

describe('Attributes tests', () => {
    it('should set disabled attribute', () => {
        const { getByRole } = render(<FilterTag disabled={true} />);
        const buttonEl = getByRole('button');
        expect(buttonEl).toBeDisabled();
    });

    it('should set data-test-id attribute', () => {
        const dataTestId = 'tag-test-id';

        const { container } = render(<FilterTag disabled={true} dataTestId={dataTestId} />);

        const testIdAttr = container.firstElementChild?.getAttribute('data-test-id');

        expect(container.firstElementChild?.getAttribute('data-test-id')).toBe(testIdAttr);
    });
});

describe('Render tests', () => {
    test('should unmount without errors', () => {
        const { unmount } = render(<FilterTag>FilterTag</FilterTag>);

        expect(unmount).not.toThrowError();
    });

    test('should contain children', () => {
        const text = 'filter Tag text';

        const { container, getByText } = render(<FilterTag>{text}</FilterTag>);

        expect(container.firstElementChild).toContainElement(getByText(text));
    });
});

describe('Interaction tests', () => {
    test('should call `onClick` prop, if filterTag not disabled', () => {
        const cb = jest.fn();
        const text = 'Press me!';
        const { getByText } = render(<FilterTag onClick={cb}>{text}</FilterTag>);

        const button = getByText(text);

        if (button) {
            fireEvent.click(button);
        }

        expect(cb).toBeCalledTimes(1);
    });

    test('should call `onClear` prop, if filterTag checked and not disabled', () => {
        const cb = jest.fn();
        const text = 'Press me!';
        const { getAllByRole } = render(
            <FilterTag checked={true} onClear={cb}>
                {text}
            </FilterTag>,
        );

        const buttons = getAllByRole('button');

        if (buttons[1]) {
            fireEvent.click(buttons[1]);
        }

        expect(cb).toBeCalledTimes(1);
    });

    test('should not call `onClick` prop, if tag is disabled', () => {
        const cb = jest.fn();
        const text = 'Press me!';

        const { getByText } = render(
            <FilterTag onClick={cb} disabled={true}>
                Press me!
            </FilterTag>,
        );
        const button = getByText(text);
        if (button) {
            fireEvent.click(button);
        }
        expect(cb).toBeCalledTimes(0);
    });

    test('should not call `onClick` prop, if tag is disabled and checked', () => {
        const cb = jest.fn();
        const text = 'Press me!';
        const { getByText } = render(
            <FilterTag onClick={cb} disabled={true} checked={true}>
                {text}
            </FilterTag>,
        );
        const button = getByText(text);
        if (button) {
            fireEvent.click(button);
        }

        expect(cb).toBeCalledTimes(0);
    });
});
