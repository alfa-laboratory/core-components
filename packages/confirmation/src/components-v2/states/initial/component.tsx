import React, { useContext, useEffect, useRef } from 'react';
import cn from 'classnames';

import { usePrevious } from '@alfalab/hooks';
import { CodeInput, CustomInputRef, CodeInputProps } from '@alfalab/core-components-code-input';
import { Loader } from '@alfalab/core-components-loader';
import { Button } from '@alfalab/core-components-button';
import { Link } from '@alfalab/core-components-link';

import { ConfirmationContext } from '../../../context';
import { formatMsAsMinutes } from '../../../utils';

import styles from './index.module.css';

export const Initial = () => {
    const {
        state,
        alignContent,
        texts,
        requiredCharAmount,
        timeLeft,
        phoneNumber,
        noAttemptsLeft,
        onChangeState,
        onInputFinished,
        onChangeScreen,
        onSmsRetryClick,
    } = useContext(ConfirmationContext);

    const prevState = usePrevious(state);

    const inputRef = useRef<CustomInputRef>(null);

    const handleInputComplete: CodeInputProps['onComplete'] = code => {
        onInputFinished(code);
    };

    const handleSmsHintLinkClick = () => {
        onChangeScreen('HINT');
    };

    const handleSmsRetryClick = () => {
        if (inputRef.current) {
            inputRef.current.reset();
        }

        onSmsRetryClick();
    };

    const handleInputChange = () => {
        if (state === 'CODE_ERROR') {
            onChangeState('INITIAL');
        }
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    useEffect(() => {
        if (!inputRef.current) {
            return;
        }

        if (state === 'CODE_ERROR' && prevState !== 'CODE_ERROR') {
            inputRef.current.reset();
            inputRef.current.focus();
            inputRef.current.unselect();
            return;
        }

        if (prevState === 'CODE_SENDING' && state !== 'CODE_SENDING') {
            inputRef.current.focus();
        }
    }, [prevState, state]);

    const retrySmsButtonVisible =
        timeLeft === 0 && ['INITIAL', 'CODE_ERROR'].includes(state) && !noAttemptsLeft;

    const countdownVisible =
        ['INITIAL', 'CODE_ERROR'].includes(state) && !retrySmsButtonVisible && !noAttemptsLeft;

    const processing = ['CODE_CHECKING', 'CODE_SENDING'].includes(state);

    return (
        <div className={cn(styles[alignContent])}>
            <h3 className={styles.header}>{texts.title}</h3>

            {phoneNumber && <div className={styles.phone}>Код отправлен на {phoneNumber}</div>}

            <div
                className={cn(styles.inputContainer, {
                    [styles.smallMargin]: retrySmsButtonVisible,
                })}
            >
                <CodeInput
                    disabled={processing}
                    error={state === 'CODE_ERROR' && texts.codeError}
                    ref={inputRef}
                    fields={requiredCharAmount}
                    className={styles.codeInput}
                    onComplete={handleInputComplete}
                    onChange={handleInputChange}
                />
            </div>

            {processing && (
                <div className={styles.loaderWrap}>
                    <Loader />

                    <span className={styles.loaderText}>
                        {state === 'CODE_CHECKING' ? texts.codeChecking : texts.codeSending}
                    </span>
                </div>
            )}

            {retrySmsButtonVisible && (
                <Button
                    size='xxs'
                    view='secondary'
                    onClick={handleSmsRetryClick}
                    className={styles.getCodeButton}
                >
                    {texts.buttonRetry}
                </Button>
            )}

            {countdownVisible && (
                <div>
                    Запросить повторно можно через <span>{formatMsAsMinutes(timeLeft)}</span>
                </div>
            )}

            {noAttemptsLeft && !processing && <div>{texts.noAttemptsLeft}</div>}

            <div className={styles.smsComeLinkWrap}>
                <Link
                    onClick={handleSmsHintLinkClick}
                    className={styles.smsComeLink}
                    view='secondary'
                    pseudo={true}
                >
                    {texts.linkToHint}
                </Link>
            </div>
        </div>
    );
};
