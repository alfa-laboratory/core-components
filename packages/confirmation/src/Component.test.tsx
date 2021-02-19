import React from 'react';
import { render, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Confirmation } from './index';

describe('Confirmation', () => {
    const baseProps = {
        code: '12345',
        onInputChange: jest.fn(),
        onInputFinished: jest.fn(),
        onSmsRetryClick: jest.fn(),
    };

    describe('Snapshot tests', () => {
        it('should match snapshot', () => {
            const { container } = render(<Confirmation {...baseProps} />);

            expect(container).toMatchSnapshot();
        });

        it('should match snapshot with fatal error', () => {
            const { container } = render(
                <Confirmation
                    {...baseProps}
                    errorIsFatal={true}
                    errorText='Выполните операцию с самого начала'
                />,
            );

            expect(container).toMatchSnapshot();
        });

        it('should match snapshot with nonFatal error', () => {
            const { container } = render(
                <Confirmation {...baseProps} errorIsFatal={false} errorText='Неверный код' />,
            );

            expect(container).toMatchSnapshot();
        });

        it('should match snapshot with masked phone', () => {
            const { container } = render(
                <Confirmation {...baseProps} phone='+7 999 888 55 66' hasPhoneMask={true} />,
            );

            expect(container).toMatchSnapshot();
        });

        it('should match snapshot with unmasked phone', () => {
            const { container } = render(
                <Confirmation {...baseProps} phone='+7 999 888 55 66' hasPhoneMask={false} />,
            );

            expect(container).toMatchSnapshot();
        });

        it('should math snapshot without smsCountdown', () => {
            const { container } = render(<Confirmation {...baseProps} hasSmsCountdown={false} />);

            expect(container).toMatchSnapshot();
        });
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

    it('should set custom signTitle', () => {
        const customSignTitle = 'Enter the code';
        const { getByText } = render(<Confirmation {...baseProps} signTitle={customSignTitle} />);

        expect(getByText(customSignTitle)).toBeInTheDocument();
    });

    it('should display additionalContent', () => {
        const additionalContent = <div id='additionalContent' />;

        const { container } = render(
            <Confirmation {...baseProps} additionalContent={additionalContent} />,
        );

        expect(container.querySelector('#additionalContent')).not.toBeNull();
    });

    it('should call onCountdownFinished when countdown is finished', async () => {
        const onCountdownFinished = jest.fn();

        render(
            <Confirmation
                {...baseProps}
                onCountdownFinished={onCountdownFinished}
                countdownDuration={600}
            />,
        );

        expect(onCountdownFinished).not.toBeCalled();

        await act(() => new Promise(resolve => setTimeout(resolve, 1000)));

        expect(onCountdownFinished).toBeCalledTimes(1);
    });

    describe('Fatal error tests', () => {
        const errorText = 'Выполните операцию с самого начала';
        const defaultButtonErrorText = 'Понятно';
        const customButtonErrorText = 'custom text';
        const customErrorTitle = 'custom error title';

        it('should set custom errorTitle for fatalError', () => {
            const { getByText } = render(
                <Confirmation
                    {...baseProps}
                    errorIsFatal={true}
                    errorText={errorText}
                    errorTitle={customErrorTitle}
                />,
            );

            expect(getByText(customErrorTitle)).toBeInTheDocument();
        });

        it('should set custom buttonErrorText for fatalError', () => {
            const { getByText } = render(
                <Confirmation
                    {...baseProps}
                    errorIsFatal={true}
                    errorText={errorText}
                    buttonErrorText={customButtonErrorText}
                />,
            );

            expect(getByText(customButtonErrorText)).toBeInTheDocument();
        });

        it('should call onActionWithFatalError when click on buttonError', () => {
            const onActionWithFatalError = jest.fn();
            const onSmsRetryClick = jest.fn();

            const { getByText } = render(
                <Confirmation
                    {...baseProps}
                    errorIsFatal={true}
                    errorText={errorText}
                    onSmsRetryClick={onSmsRetryClick}
                    onActionWithFatalError={onActionWithFatalError}
                />,
            );

            const buttonError = getByText(defaultButtonErrorText);
            buttonError.click();

            expect(onSmsRetryClick).not.toBeCalled();
            expect(onActionWithFatalError).toBeCalled();
        });

        it('should call onSmsRetryClick when click on buttonError if onActionWithFatalError is not passed', () => {
            const onSmsRetryClick = jest.fn();

            const { getByText } = render(
                <Confirmation
                    {...baseProps}
                    errorIsFatal={true}
                    errorText={errorText}
                    onSmsRetryClick={onSmsRetryClick}
                />,
            );

            const buttonError = getByText(defaultButtonErrorText);
            buttonError.click();

            expect(onSmsRetryClick).toBeCalled();
        });
    });

    describe('Sms retry tests', () => {
        const buttonRetryInHintText = 'Попробовать заново';
        const buttonRetryText = 'Запросить код повторно';
        const hintLinkText = 'Не приходит сообщение?';

        it('should display retry button', async () => {
            const { findByText } = render(<Confirmation {...baseProps} countdownDuration={0} />);
            const buttonRetry = await findByText(buttonRetryText);

            expect(buttonRetry).toBeInTheDocument();
        });

        it('should set custom buttonRetryText in hint', async () => {
            const customButtonRetryTextInHint = 'Send code again';

            const { findByText } = render(
                <Confirmation
                    {...baseProps}
                    countdownDuration={0}
                    buttonRetryText={customButtonRetryTextInHint}
                />,
            );

            const buttonRetry = await findByText(buttonRetryText);
            buttonRetry.click();

            const smsHintButton = await findByText(hintLinkText);
            smsHintButton.click();

            const buttonWithCustomText = await findByText(customButtonRetryTextInHint);

            expect(buttonWithCustomText).toBeInTheDocument();
        });

        it('should call onSmsRetryClick when click retry button', async () => {
            const onSmsRetryClick = jest.fn();

            const { findByText } = render(
                <Confirmation
                    {...baseProps}
                    countdownDuration={0}
                    onSmsRetryClick={onSmsRetryClick}
                />,
            );

            const buttonRetry = await findByText(buttonRetryText);
            buttonRetry.click();

            expect(onSmsRetryClick).toBeCalled();
        });

        it('should call onSmsRetryClick when click retry button in hint', async () => {
            const onSmsRetryClick = jest.fn();

            const { findByText } = render(
                <Confirmation
                    {...baseProps}
                    countdownDuration={0}
                    onSmsRetryClick={onSmsRetryClick}
                />,
            );

            const buttonRetry = await findByText(buttonRetryText);
            buttonRetry.click();

            const smsHintButton = await findByText(hintLinkText);
            smsHintButton.click();

            const buttonRetryInHint = await findByText(buttonRetryInHintText);
            buttonRetryInHint.click();

            expect(onSmsRetryClick).toBeCalled();
        });

        it('should call onSmsHintLinkClick when click hintLink', async () => {
            const onSmsHintLinkClick = jest.fn();

            const { findByText } = render(
                <Confirmation
                    {...baseProps}
                    countdownDuration={0}
                    onSmsHintLinkClick={onSmsHintLinkClick}
                />,
            );

            const buttonRetry = await findByText(buttonRetryText);
            buttonRetry.click();

            const smsHintButton = await findByText(hintLinkText);
            smsHintButton.click();

            expect(onSmsHintLinkClick).toBeCalled();
        });
    });

    describe('Code cheсking tests', () => {
        const defaultCodeCheckingText = 'Проверка кода';
        const customCodeCheckingText = 'Идет проверка кода';

        it('should display default codeCheсkingText if codeChecking is true', () => {
            const { getByText } = render(<Confirmation {...baseProps} codeChecking={true} />);

            expect(getByText(defaultCodeCheckingText)).toBeInTheDocument();
        });

        it('should display custom passed codeCheсkingText if codeChecking is true', () => {
            const { getByText } = render(
                <Confirmation
                    {...baseProps}
                    codeChecking={true}
                    codeCheckingText={customCodeCheckingText}
                />,
            );

            expect(getByText(customCodeCheckingText)).toBeInTheDocument();
        });
    });

    describe('Code sending tests', () => {
        const defaultCodeSendingText = 'Отправляем код';
        const customCodeSendingText = 'Идет отправка кода';

        it('should display default codeSendingText if codeSending is true', () => {
            const { getByText } = render(<Confirmation {...baseProps} codeSending={true} />);

            expect(getByText(defaultCodeSendingText)).toBeInTheDocument();
        });

        it('should display custom passed codeSendingText if codeSending is true', () => {
            const { getByText } = render(
                <Confirmation
                    {...baseProps}
                    codeSending={true}
                    codeSendingText={customCodeSendingText}
                />,
            );

            expect(getByText(customCodeSendingText)).toBeInTheDocument();
        });
    });

    describe('Input tests', () => {
        const getActiveElement = () => document.activeElement as Element;

        it('should focus input on first render', () => {
            const { container } = render(<Confirmation {...baseProps} code='' />);

            expect(getActiveElement()).toBe(container.querySelector('input'));
        });

        it('should call onInputChange when input is changed', () => {
            const onInputChange = jest.fn();

            render(<Confirmation {...baseProps} onInputChange={onInputChange} code='' />);

            userEvent.type(getActiveElement(), '1');

            expect(onInputChange).toBeCalledWith({ code: '1' });
        });

        it('should call onInputFinished when input is finished', () => {
            let code = '';
            const onInputFinished = jest.fn();
            const onInputChange = (value: { code: string }) => {
                code = value.code;
            };

            const getComponent = () => (
                <Confirmation
                    {...baseProps}
                    onInputFinished={onInputFinished}
                    onInputChange={onInputChange}
                    requiredCharAmount={2}
                    code={code}
                />
            );

            const { rerender } = render(getComponent());
            userEvent.type(getActiveElement(), '1');

            rerender(getComponent());
            userEvent.type(getActiveElement(), '2');

            expect(onInputFinished).toBeCalledTimes(1);
        });

        it('should not allow type code longer than requiredCharAmount', () => {
            let code = '';
            const onInputChange = jest.fn((value: { code: string }) => {
                code = value.code;
            });

            const getComponent = () => (
                <Confirmation
                    {...baseProps}
                    onInputChange={onInputChange}
                    requiredCharAmount={2}
                    code={code}
                />
            );

            const { rerender } = render(getComponent());
            userEvent.type(getActiveElement(), '1');

            rerender(getComponent());
            userEvent.type(getActiveElement(), '2');

            rerender(getComponent());
            userEvent.type(getActiveElement(), '3');

            expect(onInputChange).nthCalledWith(1, { code: '1' });
            expect(onInputChange).nthCalledWith(2, { code: '12' });
            expect(onInputChange).toBeCalledTimes(2);
        });
    });
});
