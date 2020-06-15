import React from 'react';
import {
    render,
    fireEvent,
    act,
    RenderResult,
    waitForElement,
    waitForElementToBeRemoved,
} from '@testing-library/react';

import { Tooltip, TooltipProps } from './index';

jest.mock('react-transition-group', () => {
    return { Transition: jest.fn(props => (props.in ? props.children(props) : null)) };
});

const renderTooltip = async (props: TooltipProps): Promise<RenderResult> => {
    let result;

    await act(async () => {
        result = await render(<Tooltip {...props}>{props.children}</Tooltip>);
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    return result;
};

describe('Display tests', () => {
    it('should display correctly', async () => {
        const component = await renderTooltip({
            children: <div>Hover me</div>,
            content: <div>I am tooltip</div>,
        });

        expect(component).toMatchSnapshot();
    });

    it('should display correctly if tooltip open', async () => {
        const component = await renderTooltip({
            children: <div>Hover me</div>,
            content: <div>I am tooltip</div>,
            open: true,
        });

        expect(component).toMatchSnapshot();
    });
});

describe('Attributes tests', () => {
    it('should set data-test-id attribute', async () => {
        const testId = 'tooltip';
        const className = 'custom';

        await renderTooltip({
            children: <div>Hover me</div>,
            content: <div>I am tooltip</div>,
            open: true,
            contentClassName: className,
            dataTestId: testId,
        });

        const tooltipContentWrap = document.querySelector(`.${className}`);

        const testIdAttr = tooltipContentWrap?.getAttribute('data-test-id');

        expect(testIdAttr).toBe(testId);
    });
});

describe('Styles tests', () => {
    it('should set custom css class to content component', async () => {
        const className = 'custom';
        const testId = 'tooltip';

        const { getByTestId } = await renderTooltip({
            children: <div>Hover me</div>,
            content: <div>I am tooltip</div>,
            open: true,
            contentClassName: className,
            dataTestId: testId,
        });

        expect(getByTestId(testId)).toHaveClass(className);
    });

    it('should set custom css class to arrow component', async () => {
        const arrowClassName = 'custom-arrow-class';

        await renderTooltip({
            children: <div>Hover me</div>,
            content: <div>I am tooltip</div>,
            open: true,
            arrowClassName,
        });

        expect(document.body.querySelector(`.${arrowClassName}`)).toHaveClass('arrow');
    });
});

describe('Render tests', () => {
    it('should unmount without errors', async () => {
        const { unmount } = await renderTooltip({
            children: <div>Hover me</div>,
            content: <div>I am tooltip</div>,
            open: true,
        });

        expect(unmount).not.toThrowError();
    });
});

describe('Click event tests', () => {
    it('should open/close if click on children', async () => {
        const childrenText = 'Click me';
        const contentText = 'I am tooltip';
        const onClose = jest.fn();
        const onOpen = jest.fn();

        const { getByText } = await renderTooltip({
            children: <div>{childrenText}</div>,
            content: <div>{contentText}</div>,
            trigger: 'click',
            onClose,
            onOpen,
        });

        const children = getByText(childrenText);

        fireEvent.click(children);

        const content = await waitForElement(() => getByText(contentText));

        expect(content).toBeInTheDocument();

        fireEvent.click(children);

        expect(content).not.toBeInTheDocument();

        expect(onOpen).toBeCalledTimes(1);
        expect(onClose).toBeCalledTimes(1);
    });

    it('should close if click outside', async () => {
        const childrenText = 'Click me';
        const contentText = 'I am tooltip';

        const { getByText } = await renderTooltip({
            children: <div>{childrenText}</div>,
            content: <div>{contentText}</div>,
            trigger: 'click',
        });

        const children = getByText(childrenText);

        fireEvent.click(children);

        const content = await waitForElement(() => getByText(contentText));

        expect(content).toBeInTheDocument();

        fireEvent.click(document.body);

        expect(content).not.toBeInTheDocument();
    });

    it('should stay open if prop `open` is `true`', async () => {
        const childrenText = 'Click me';
        const contentText = 'I am tooltip';

        const { getByText } = await renderTooltip({
            children: <div>{childrenText}</div>,
            content: <div>{contentText}</div>,
            trigger: 'click',
            open: true,
        });

        const content = getByText(contentText);
        const children = getByText(childrenText);

        expect(content).toBeInTheDocument();

        fireEvent.click(document.body);

        expect(content).toBeInTheDocument();

        fireEvent.click(children);

        expect(content).toBeInTheDocument();
    });

    it('should stay close if prop `open` is `false`', async () => {
        const childrenText = 'Click me';
        const contentText = 'I am tooltip';

        const { getByText } = await renderTooltip({
            children: <div>{childrenText}</div>,
            content: <div id='content'>{contentText}</div>,
            trigger: 'click',
            open: false,
        });

        const content = document.querySelector('#content');
        const children = getByText(childrenText);

        expect(content).toBeNull();

        fireEvent.click(children);

        expect(content).toBeNull();
    });
});

describe('Hover event tests', () => {
    it('should open/close if hover on children', async () => {
        const childrenText = 'Click me';
        const contentText = 'I am tooltip';
        const onClose = jest.fn();
        const onOpen = jest.fn();

        const { getByText } = await renderTooltip({
            children: <div>{childrenText}</div>,
            content: <div id='content'>{contentText}</div>,
            onClose,
            onOpen,
        });

        const children = getByText(childrenText);

        fireEvent.mouseOver(children);

        const content = await waitForElement(() => getByText(contentText));

        expect(content).toBeInTheDocument();

        fireEvent.mouseOut(children);

        await waitForElementToBeRemoved(() => getByText(contentText));

        expect(content).not.toBeInTheDocument();

        expect(onOpen).toBeCalledTimes(1);
        expect(onClose).toBeCalledTimes(1);
    });

    it('should stay open if prop `open` is `true`', async () => {
        jest.useFakeTimers();

        const childrenText = 'Click me';
        const contentText = 'I am tooltip';
        const onClose = jest.fn();
        const onOpen = jest.fn();

        const { getByText } = await renderTooltip({
            children: <div>{childrenText}</div>,
            content: <div>{contentText}</div>,
            onClose,
            onOpen,
            open: true,
        });

        const children = getByText(childrenText);

        fireEvent.mouseOver(children);
        fireEvent.mouseOut(children);

        const content = getByText(contentText);

        expect(content).toBeInTheDocument();
    });

    it('should stay close if prop `open` is `false`', async () => {
        jest.useFakeTimers();

        const childrenText = 'Click me';
        const contentText = 'I am tooltip';
        const onClose = jest.fn();
        const onOpen = jest.fn();

        const { getByText } = await renderTooltip({
            children: <div>{childrenText}</div>,
            content: <div id='content'>{contentText}</div>,
            onClose,
            onOpen,
            open: false,
        });

        const children = getByText(childrenText);

        fireEvent.mouseOver(children);
        fireEvent.mouseOut(children);

        const content = document.querySelector('#content');

        expect(content).toBeNull();
    });
});

describe('Child render tests', () => {
    it('should pass child classname', async () => {
        const childClassName = 'child-classname';
        const testId = 'test-id';

        const { getByTestId } = await renderTooltip({
            children: (
                <div className={childClassName} data-test-id={testId}>
                    Hover me
                </div>
            ),
            content: <div>I am tooltip</div>,
            open: true,
        });

        expect(getByTestId(testId)).toHaveClass(childClassName);
    });
});
