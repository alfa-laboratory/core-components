import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Textarea } from './index';

describe('Textarea', () => {
    describe('Snapshots tests', () => {
        it('should match snapshot', () => {
            const { container } = render(<Textarea value='value' />);

            expect(container).toMatchSnapshot();
        });
    });

    it('should forward ref to textarea', () => {
        const textareaRef = jest.fn();
        const dataTestId = 'test-id';
        const { getByTestId } = render(<Textarea ref={textareaRef} dataTestId={dataTestId} />);

        expect(textareaRef.mock.calls).toEqual([[getByTestId(dataTestId)]]);
    });

    it('should set `data-test-id` atribute to textarea', () => {
        const dataTestId = 'test-id';
        const { getByTestId } = render(<Textarea block={true} dataTestId={dataTestId} />);

        expect(getByTestId(dataTestId).tagName).toBe('TEXTAREA');
    });

    describe('Classes tests', () => {
        it('should set `className` class to root', () => {
            const className = 'test-class';
            const { container } = render(<Textarea className={className} />);

            expect(container.firstElementChild).toHaveClass(className);
        });

        it('should set `textareaClassName` class to textarea', () => {
            const dataTestId = 'test-id';
            const className = 'test-class';
            const { getByTestId } = render(
                <Textarea textareaClassName={className} dataTestId={dataTestId} />,
            );

            expect(getByTestId(dataTestId)).toHaveClass(className);
        });

        it('should set `filled` class', () => {
            const { container } = render(<Textarea value='some value' readOnly={true} />);

            expect(container.firstElementChild).toHaveClass('filled');
        });

        it('should set `hasLabel` class', () => {
            const dataTestId = 'test-id';
            const { getByTestId } = render(<Textarea label='label' dataTestId={dataTestId} />);

            expect(getByTestId(dataTestId)).toHaveClass('hasLabel');
        });

        it('should set `resizeVertical` class', () => {
            const dataTestId = 'test-id';
            const { getByTestId } = render(<Textarea resize='vertical' dataTestId={dataTestId} />);

            expect(getByTestId(dataTestId)).toHaveClass('resizeVertical');
        });

        it('should set `disabled` atribute', () => {
            const dataTestId = 'test-id';
            const { getByTestId } = render(<Textarea disabled={true} dataTestId={dataTestId} />);

            expect(getByTestId(dataTestId)).toHaveAttribute('disabled');
        });

        it('should render with `off` autocomplete attribute', () => {
            const dataTestId = 'test-id';
            const { getByTestId } = render(
                <Textarea autocomplete={false} dataTestId={dataTestId} />,
            );

            expect(getByTestId(dataTestId).getAttribute('autoComplete')).toEqual('off');
        });

        it('should render with `on` autocomplete attribute', () => {
            const dataTestId = 'test-id';
            const { getByTestId } = render(
                <Textarea autocomplete={true} dataTestId={dataTestId} />,
            );

            expect(getByTestId(dataTestId).getAttribute('autoComplete')).toEqual('on');
        });

        it('should set `maxHeight` style with autosize on', () => {
            const dataTestId = 'test-id';
            const { getByTestId } = render(
                <Textarea autosize={true} maxHeight={100} dataTestId={dataTestId} />,
            );

            expect(getByTestId(dataTestId)).toHaveStyle('max-height: 100px');
        });

        it('should set `maxHeight` style with autosize off', () => {
            const dataTestId = 'test-id';
            const { getByTestId } = render(
                <Textarea autosize={false} maxHeight={100} dataTestId={dataTestId} />,
            );

            expect(getByTestId(dataTestId)).toHaveStyle('max-height: 100px');
        });
    });

    describe('Callbacks tests', () => {
        it('should call `onChange` prop', () => {
            const cb = jest.fn();
            const dataTestId = 'test-id';
            const value = '123';
            const { getByTestId } = render(<Textarea onChange={cb} dataTestId={dataTestId} />);

            const textarea = getByTestId(dataTestId) as HTMLTextAreaElement;

            fireEvent.change(textarea, { target: { value } });

            expect(cb).toBeCalledTimes(1);
            expect(textarea.value).toBe(value);
        });

        it('should call `onFocus` prop', () => {
            const cb = jest.fn();
            const dataTestId = 'test-id';
            const { getByTestId } = render(<Textarea onFocus={cb} dataTestId={dataTestId} />);

            fireEvent.focus(getByTestId(dataTestId));

            expect(cb).toBeCalledTimes(1);
        });

        it('should call `onBlur` prop', () => {
            const cb = jest.fn();
            const dataTestId = 'test-id';
            const { getByTestId } = render(<Textarea onBlur={cb} dataTestId={dataTestId} />);

            fireEvent.blur(getByTestId(dataTestId));

            expect(cb).toBeCalledTimes(1);
        });

        it('should not call `onChange` prop if disabled', async () => {
            const cb = jest.fn();
            const dataTestId = 'test-id';
            const { getByTestId } = render(
                <Textarea onChange={cb} dataTestId={dataTestId} disabled={true} />,
            );

            const textarea = getByTestId(dataTestId) as HTMLTextAreaElement;

            await userEvent.type(textarea, '123');

            expect(cb).not.toBeCalled();
        });
    });

    it('should unmount without errors', () => {
        const { unmount } = render(<Textarea value='value' onChange={jest.fn()} />);

        expect(unmount).not.toThrowError();
    });
});
