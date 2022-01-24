import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Confirmation, ConfirmationProps } from './index';

/**
 * TODO: сделать тесты на все callbacks
 * TODO: сделать тесты на все таймеры
 */
describe('Confirmation', () => {
    const baseProps: ConfirmationProps = {
        screen: 'INITIAL',
        state: 'INITIAL',
        onChangeScreen: jest.fn(),
        onChangeState: jest.fn(),
        onInputFinished: jest.fn(),
        onSmsRetryClick: jest.fn(),
    };

    describe('Snapshot tests', () => {
        it('should match snapshot', () => {
            const { container } = render(<Confirmation {...baseProps} />);

            expect(container).toMatchSnapshot();
        });

        it('should match snapshot with CODE_CHECKING state', () => {
            const { container } = render(<Confirmation {...baseProps} state='CODE_CHECKING' />);

            expect(container).toMatchSnapshot();
        });

        it('should match snapshot with CODE_SENDING state', () => {
            const { container } = render(<Confirmation {...baseProps} state='CODE_SENDING' />);

            expect(container).toMatchSnapshot();
        });

        it('should match snapshot with CODE_ERROR state', () => {
            const { container } = render(<Confirmation {...baseProps} state='CODE_ERROR' />);

            expect(container).toMatchSnapshot();
        });

        it('should match snapshot with FATAL_ERROR screen', () => {
            const { container } = render(<Confirmation {...baseProps} screen='FATAL_ERROR' />);

            expect(container).toMatchSnapshot();
        });

        it('should match snapshot with HINT screen', () => {
            const { container } = render(<Confirmation {...baseProps} screen='TEMP_BLOCK' />);

            expect(container).toMatchSnapshot();
        });

        it('should match snapshot with HINT screen', () => {
            const { container } = render(<Confirmation {...baseProps} screen='HINT' />);

            expect(container).toMatchSnapshot();
        });
    });

    describe('Props tests', () => {
        it('should render passed texts on INITIAL screen', async () => {
            const texts = {
                title: 'Title',
                linkToHint: 'Link',
                codeError: 'Code error',
                codeChecking: 'Code checking',
                codeSending: 'Code sending',
                hintButton: 'Hint button',
            };

            const props = { ...baseProps, texts };

            const { getByText, rerender } = render(<Confirmation {...props} />);

            expect(getByText(texts.title)).toBeInTheDocument();
            expect(getByText(texts.linkToHint)).toBeInTheDocument();

            rerender(<Confirmation {...props} state='CODE_CHECKING' />);

            expect(getByText(texts.codeChecking)).toBeInTheDocument();

            rerender(<Confirmation {...props} state='CODE_SENDING' />);

            expect(getByText(texts.codeSending)).toBeInTheDocument();

            rerender(<Confirmation {...props} state='CODE_ERROR' />);

            expect(getByText(texts.codeError)).toBeInTheDocument();
        });

        it('should render passed texts on HINT screen', () => {
            const texts = {
                hintButton: 'Hint button',
            };

            const props = { ...baseProps, texts };

            const { getByText } = render(<Confirmation {...props} screen='HINT' />);

            expect(getByText(texts.hintButton)).toBeInTheDocument();
        });

        it('should render passed texts on FATAL_ERROR screen', () => {
            const texts = {
                fatalErrorTitle: 'Fatal error title',
                fatalErrorDescription: 'Fatal error description',
                fatalErrorButton: 'Fatal error button',
            };

            const props = { ...baseProps, texts };

            const { getByText } = render(<Confirmation {...props} screen='FATAL_ERROR' />);

            expect(getByText(texts.fatalErrorTitle)).toBeInTheDocument();
            expect(getByText(texts.fatalErrorDescription)).toBeInTheDocument();
            expect(getByText(texts.fatalErrorButton)).toBeInTheDocument();
        });

        it('should render passed texts on TEMP_BLOCK screen', () => {
            const texts = {
                tempBlockTitle: 'Temp block title',
                tempBlockDescription: 'Temp block description',
            };

            const props = { ...baseProps, texts };

            const { getByText } = render(<Confirmation {...props} screen='TEMP_BLOCK' />);

            expect(getByText(texts.tempBlockTitle)).toBeInTheDocument();
            expect(getByText(texts.tempBlockDescription)).toBeInTheDocument();
        });

        it('should set `data-test-id` attribute', () => {
            const testId = 'test-id';
            const { getByTestId } = render(<Confirmation {...baseProps} dataTestId={testId} />);

            expect(getByTestId(testId)).toBeInTheDocument();
        });

        it('should set custom class', () => {
            const className = 'custom-class';
            const { container } = render(<Confirmation {...baseProps} className={className} />);

            expect(container.firstElementChild).toHaveClass(className);
        });

        it('should render passed inputs amount', () => {
            const requiredCharAmount = 2;

            const { container } = render(
                <Confirmation {...baseProps} requiredCharAmount={requiredCharAmount} />,
            );

            const inputs = container.querySelectorAll('input');

            expect(inputs.length).toBe(requiredCharAmount);
        });

        it('should render passed phone', () => {
            const phone = '+7 (999) 999 99-99';

            const { getByText } = render(<Confirmation {...baseProps} phone={phone} />);

            expect(getByText(`Код отправлен на ${phone}`)).toBeInTheDocument();
        });
    });

    it('Should render custom screens', () => {
        const initialScreenTitlle = 'Initial screen title';
        const hintScreenTitlle = 'Hint screen title';
        const fatalErrorScreenTitlle = 'Fatal error screen title';
        const tempBlockScreenTitlle = 'Temp block screen title';

        const props = {
            ...baseProps,
            getScreensMap: (screensMap: any) => ({
                ...screensMap,
                INITIAL: () => <span>{initialScreenTitlle}</span>,
                HINT: () => <span>{hintScreenTitlle}</span>,
                FATAL_ERROR: () => <span>{fatalErrorScreenTitlle}</span>,
                TEMP_BLOCK: () => <span>{tempBlockScreenTitlle}</span>,
            }),
        };

        const { getByText, rerender } = render(<Confirmation {...props} />);

        expect(getByText(initialScreenTitlle)).toBeInTheDocument();

        rerender(<Confirmation {...props} screen='HINT' />);

        expect(getByText(hintScreenTitlle)).toBeInTheDocument();

        rerender(<Confirmation {...props} screen='FATAL_ERROR' />);

        expect(getByText(fatalErrorScreenTitlle)).toBeInTheDocument();

        rerender(<Confirmation {...props} screen='TEMP_BLOCK' />);

        expect(getByText(tempBlockScreenTitlle)).toBeInTheDocument();
    });

    describe('Input tests', () => {
        const getActiveElement = () => document.activeElement as Element;

        it('should focus input on first render', () => {
            const { container } = render(<Confirmation {...baseProps} />);

            expect(getActiveElement()).toBe(container.querySelector('input'));
        });

        it('should call onInputFinished when input is finished', () => {
            const onInputFinished = jest.fn();

            const { container } = render(
                <Confirmation
                    {...baseProps}
                    onInputFinished={onInputFinished}
                    requiredCharAmount={2}
                />,
            );

            const inputs = container.querySelectorAll('input');

            fireEvent.change(inputs[0], { target: { value: '1' } });
            fireEvent.change(inputs[1], { target: { value: '2' } });

            expect(onInputFinished).toBeCalledTimes(1);
        });

        it('should call onFatalErrorOkButtonClick when click on button', () => {
            const onFatalErrorOkButtonClick = jest.fn();

            const { container } = render(
                <Confirmation
                    {...baseProps}
                    onFatalErrorOkButtonClick={onFatalErrorOkButtonClick}
                    screen='FATAL_ERROR'
                />,
            );

            const button = container.querySelector('button') as HTMLButtonElement;

            fireEvent.click(button);

            expect(onFatalErrorOkButtonClick).toBeCalledTimes(1);
        });
    });
});
