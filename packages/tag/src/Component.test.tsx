import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { Tag } from './index';

describe('Snapshots tests', () => {
    it('should match snapshot', () => {
        expect(render(<Tag>Press me</Tag>)).toMatchSnapshot();
    });

    it('should match snapshot variant=alt', () => {
        expect(render(<Tag variant='alt'>Press me</Tag>)).toMatchSnapshot();
    });

    it('should match without children snapshot', () => {
        expect(render(<Tag />)).toMatchSnapshot();
    });

    it('should match snapshot with right addons', () => {
        expect(render(<Tag rightAddons={<span>10 000 $</span>}>Press me</Tag>)).toMatchSnapshot();
    });

    it('should match snapshot with left addons', () => {
        expect(render(<Tag leftAddons={<span>10 000 $</span>}>Press me</Tag>)).toMatchSnapshot();
    });
});

describe('Classes tests', () => {
    it('should set custom class', () => {
        const className = 'custom-class';

        const { container } = render(<Tag className={className} />);

        expect(container.firstElementChild).toHaveClass(className);
    });

    it('should set size `s` as default size', () => {
        const { container } = render(<Tag />);

        expect(container.firstElementChild).toHaveClass('s');
    });

    it('should set size', () => {
        const { container } = render(<Tag size='l' />);

        expect(container.firstElementChild).toHaveClass('l');
    });

    it('should set `checked` class if prop `checked` is present', () => {
        const { container } = render(<Tag checked={true} />);

        expect(container.firstElementChild).toHaveClass('checked');
    });

    it('should set `alt` class if prop `variant=alt`', () => {
        const { container } = render(<Tag variant='alt' />);

        expect(container.firstElementChild).toHaveClass('alt');
    });
});

describe('Attributes tests', () => {
    it('should set disabled attribute', () => {
        const { container } = render(<Tag disabled={true} />);

        expect(container.firstElementChild).toBeDisabled();
    });

    it('should set data-test-id attribute', () => {
        const dataTestId = 'tag-test-id';

        const { container } = render(<Tag disabled={true} dataTestId={dataTestId} />);

        const testIdAttr = container.firstElementChild?.getAttribute('data-test-id');

        expect(container.firstElementChild?.getAttribute('data-test-id')).toBe(testIdAttr);
    });
});

describe('Render tests', () => {
    test('should unmount without errors', () => {
        const { unmount } = render(<Tag rightAddons={<div>addons</div>}>Tag</Tag>);

        expect(unmount).not.toThrowError();
    });

    test('should contain right addons', () => {
        const rightAddonText = 'Right addon text';

        const { container, getByText } = render(
            <Tag rightAddons={<span>{rightAddonText}</span>}>Tag</Tag>,
        );

        expect(container.firstElementChild).toContainElement(getByText(rightAddonText));
    });

    test('should contain left addons', () => {
        const leftAddonText = 'Left addon text';

        const { container, getByText } = render(
            <Tag leftAddons={<span>{leftAddonText}</span>}>Tag</Tag>,
        );

        expect(container.firstElementChild).toContainElement(getByText(leftAddonText));
    });
});

describe('Interaction tests', () => {
    test('should call `onClick` prop, if tag not disabled', () => {
        const cb = jest.fn();

        const { container } = render(<Tag onClick={cb}>Press me!</Tag>);

        if (container.firstElementChild) {
            fireEvent.click(container.firstElementChild);
        }

        expect(cb).toBeCalledTimes(1);
    });

    test('should not call `onClick` prop, if tag is disabled', () => {
        const cb = jest.fn();

        const { container } = render(
            <Tag onClick={cb} disabled={true}>
                Press me!
            </Tag>,
        );

        if (container.firstElementChild) {
            fireEvent.click(container.firstElementChild);
        }

        expect(cb).toBeCalledTimes(0);
    });

    test('should not call `onClick` prop, if tag is disabled and checked', () => {
        const cb = jest.fn();

        const { container } = render(
            <Tag onClick={cb} disabled={true} checked={true}>
                Press me!
            </Tag>,
        );

        if (container.firstElementChild) {
            fireEvent.click(container.firstElementChild);
        }

        expect(cb).toBeCalledTimes(0);
    });
});
