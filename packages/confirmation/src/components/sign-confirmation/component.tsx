import React, { FC, KeyboardEvent, MutableRefObject, useCallback } from 'react';
import cn from 'classnames';

import { Link } from '@alfalab/core-components-link';
import { Loader } from '@alfalab/core-components-loader';

import { Countdown } from '../countdown';
import { CodeInput } from '../code-input';
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
    code: string;
    error: string;
    title: string;
    codeCheckingText: string;
    codeSendingText: string;
    hasSmsCountdown: boolean;
    inputRef: MutableRefObject<HTMLInputElement | null>;
    alignContent: ContentAlign;
    onInputFinished: (value: string) => void;
    onInputChange: (value: string) => void;
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
    code: inputValue,
    error = '',
    title,
    hasSmsCountdown,
    inputRef,
    codeCheckingText,
    codeSendingText,
    alignContent,
    onInputFinished,
    onInputChange,
    onSmsRetryClick,
    onCountdownFinished,
    onSmsHintLinkClick,
}) => {
    const processing = codeChecking || codeSending;

    const displayedError = processing ? '' : error;

    const handleInputKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                onInputFinished((event.target as HTMLInputElement).value);
            }
        },
        [onInputFinished],
    );

    const handleInputFinished = useCallback(
        (value: string) => {
            onInputFinished(value);

            if (inputRef.current) {
                inputRef.current.blur();
            }
        },
        [onInputFinished, inputRef],
    );

    const handleInputChange = useCallback(
        (code: string) => {
            if (code.length === requiredCharAmount) {
                handleInputFinished(code);
            }

            onInputChange(code);
        },
        [handleInputFinished, onInputChange, requiredCharAmount],
    );

    return (
        <div className={cn(styles.component, styles[alignContent])}>
            <span className={styles.header}>{title}</span>

            <div className={styles.inputContainer}>
                <CodeInput
                    processing={processing}
                    error={displayedError}
                    value={inputValue}
                    ref={inputRef}
                    slotsCount={requiredCharAmount}
                    className={styles.codeInput}
                    handleChange={handleInputChange}
                    handleInputKeyDown={handleInputKeyDown}
                />

                {displayedError && <div className={styles.error}>{displayedError}</div>}
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
                <div className={cn('countdown', { [styles.hidden]: processing })}>
                    <Countdown
                        duration={countdownDuration}
                        phone={phone}
                        hasPhoneMask={hasPhoneMask}
                        className={styles.countdown}
                        alignContent={alignContent}
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
                    >
                        Не приходит сообщение?
                    </Link>
                </div>
            )}

            <div>{additionalContent}</div>
        </div>
    );
};
