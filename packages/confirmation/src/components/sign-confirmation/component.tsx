import React, { FC, RefObject, ReactNode, useCallback, useEffect } from 'react';
import cn from 'classnames';

import { Link } from '@alfalab/core-components-link';
import { Loader } from '@alfalab/core-components-loader';
import { CodeInput, CustomInputRef } from '@alfalab/core-components-code-input';

import { Countdown } from '../countdown';
import { ContentAlign } from '../../component';

import styles from './index.module.css';

export type SignConfirmationProps = {
    codeChecking: boolean;
    codeSending: boolean;
    smsHintVisible: boolean;
    requiredCharAmount: number;
    countdownDuration: number;
    additionalContent: React.ReactNode;
    hasPhoneMask: boolean;
    phone?: string;
    errorText: string;
    error: boolean;
    title: string | React.ReactNode;
    codeCheckingText: string;
    codeSendingText: string;
    hasSmsCountdown: boolean;
    inputRef: RefObject<CustomInputRef>;
    alignContent: ContentAlign;
    noAttemptsLeftMessage?: string;
    buttonRetryText: string;
    countdownContent?: ReactNode;
    onInputFinished: ({ code }: { code: string }) => void;
    onInputChange?: ({ code }: { code: string }) => void;
    onSmsRetryClick: (event: React.MouseEvent) => void;
    onCountdownFinished: () => void;
    onSmsHintLinkClick: (event: React.MouseEvent) => void;
};

export const SignConfirmation: FC<SignConfirmationProps> = ({
    codeChecking,
    codeSending,
    smsHintVisible,
    requiredCharAmount,
    countdownDuration,
    additionalContent,
    hasPhoneMask,
    phone,
    error,
    errorText,
    title,
    hasSmsCountdown,
    inputRef,
    codeCheckingText,
    codeSendingText,
    alignContent,
    noAttemptsLeftMessage,
    buttonRetryText,
    countdownContent,
    onInputFinished,
    onInputChange,
    onSmsRetryClick,
    onCountdownFinished,
    onSmsHintLinkClick,
}) => {
    const processing = codeChecking || codeSending;

    const displayedError = processing ? '' : errorText;

    const handleInputFinished = useCallback(
        (code: string) => {
            onInputFinished({ code });

            if (inputRef.current) {
                inputRef.current.blur(requiredCharAmount - 1);
            }
        },
        [onInputFinished, inputRef, requiredCharAmount],
    );

    const handleInputChange = useCallback(
        (code: string) => {
            if (code.length === requiredCharAmount) {
                handleInputFinished(code);
            }

            if (onInputChange) {
                onInputChange({ code });
            }
        },
        [handleInputFinished, onInputChange, requiredCharAmount],
    );

    useEffect(() => {
        if (inputRef.current && error) {
            inputRef.current.focus(requiredCharAmount - 1);
        }
    }, [error, inputRef, requiredCharAmount]);

    useEffect(() => {
        if (inputRef.current && !codeSending) {
            inputRef.current.focus();
        }
    }, [inputRef, codeSending]);

    return (
        <div className={cn(styles.component, styles[alignContent])}>
            {typeof title === 'string' ? <span className={styles.header}>{title}</span> : title}

            <div className={styles.inputContainer}>
                <CodeInput
                    disabled={processing}
                    error={error}
                    ref={inputRef}
                    fields={requiredCharAmount}
                    className={styles.codeInput}
                    onChange={handleInputChange}
                />

                {displayedError && (
                    <div className={styles.error} role='alert'>
                        {displayedError}
                    </div>
                )}
            </div>

            {processing && (
                <div className={styles.loaderWrap}>
                    <Loader />

                    <span className={styles.loaderText}>
                        {codeChecking ? codeCheckingText : codeSendingText}
                    </span>
                </div>
            )}

            {hasSmsCountdown && (
                <div className={cn('countdown', styles.countdown, { [styles.hidden]: processing })}>
                    <Countdown
                        duration={countdownDuration}
                        phone={phone}
                        hasPhoneMask={hasPhoneMask}
                        alignContent={alignContent}
                        noAttemptsLeftMessage={noAttemptsLeftMessage}
                        hasError={Boolean(displayedError)}
                        buttonRetryText={buttonRetryText}
                        content={countdownContent}
                        onRepeatSms={onSmsRetryClick}
                        onCountdownFinished={onCountdownFinished}
                    />
                </div>
            )}

            {smsHintVisible && (
                <div className={styles.smsComeLinkWrap}>
                    <Link
                        onClick={onSmsHintLinkClick}
                        className={styles.smsComeLink}
                        view='secondary'
                        pseudo={true}
                    >
                        Не приходит сообщение?
                    </Link>
                </div>
            )}

            <div>{additionalContent}</div>
        </div>
    );
};
