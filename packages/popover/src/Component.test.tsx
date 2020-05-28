import React, { ReactNode } from 'react';
import { render, act, RenderResult } from '@testing-library/react';

import { Popover, PopoverProps } from './index';

const renderPopover = async (
    props: PopoverProps & { children: ReactNode },
): Promise<RenderResult> => {
    let result: RenderResult;

    await act(async () => {
        result = await render(<Popover {...props}>{props.children}</Popover>);
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    return result;
};

describe('Display tests', () => {
    it('should display correctly', async () => {
        const component = await renderPopover({
            children: <div>I am popover</div>,
            open: true,
            anchorElement: document.body,
        });

        expect(component).toMatchSnapshot();
    });
});

describe('Attributes tests', () => {
    it('should set data-test-id attribute', async () => {
        const testId = 'tooltip';
        const className = 'custom';

        await renderPopover({
            children: <div>I am popover</div>,
            open: true,
            anchorElement: document.body,
            dataTestId: testId,
            popperClassName: className,
        });

        const popperContentWrap = document.querySelector(`.${className}`);

        const testIdAttr = popperContentWrap?.getAttribute('data-test-id');

        expect(testIdAttr).toBe(testId);
    });
});

describe('Styles tests', () => {
    it('should set custom css class to content component', async () => {
        const testId = 'tooltip';
        const className = 'custom';

        const { getByTestId } = await renderPopover({
            children: <div>I am popover</div>,
            open: true,
            anchorElement: document.body,
            dataTestId: testId,
            popperClassName: className,
        });

        expect(getByTestId(testId)).toHaveClass(className);
    });

    it('should set custom css class to arrow component', async () => {
        const arrowClassName = 'custom-arrow-class';
        const testId = 'tooltip';

        await renderPopover({
            children: <div>I am popover</div>,
            open: true,
            anchorElement: document.body,
            dataTestId: testId,
            arrowClassName,
            withArrow: true,
        });

        expect(document.body.querySelector(`.${arrowClassName}`)).toHaveClass('arrow');
    });
});

describe('Render tests', () => {
    it('should render without Transition of withTransition is false', async () => {
        const component = await renderPopover({
            children: <div>I am popover</div>,
            open: true,
            anchorElement: document.body,
            withTransition: false,
        });

        expect(component).toMatchSnapshot();
    });

    it('should unmount without errors', async () => {
        const { unmount } = await renderPopover({
            children: <div>I am popover</div>,
            open: true,
            anchorElement: document.body,
        });

        expect(unmount).not.toThrowError();
    });
});
