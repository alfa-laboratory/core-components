import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { usePrevious } from '@alfalab/hooks';
import { CodeInput, CustomInputRef, CodeInputProps } from '@alfalab/core-components-code-input';
import { Link } from '@alfalab/core-components-link';

import { ConfirmationContext } from '../../../context';

import styles from './index.module.css';
import { CountdownSection } from './countdown-section';

const CODE_SEND_HINT_VISIBLE_DURATION = 2000;

export const Initial = () => {
    const {
        state,
        alignContent,
        texts,
        requiredCharAmount,
        timeLeft,
        phone,
        onChangeState,
        onInputFinished,
        onChangeScreen,
        onSmsRetryClick,
    } = useContext(ConfirmationContext);

    const prevState = usePrevious(state);

    const inputRef = useRef<CustomInputRef>(null);

    const [codeSendHintVisible, setCodeSendHintVisible] = useState(false);

    const timerId = useRef(0);

    const handleInputComplete: CodeInputProps['onComplete'] = code => {
        onInputFinished(code);
    };

    const handleSmsHintLinkClick = () => {
        onChangeScreen('HINT');
    };

    const handleInputChange = () => {
        if (state === 'CODE_ERROR') {
            onChangeState('INITIAL');
        }
    };

    const handleSmsRetryClick = () => {
        if (inputRef.current) {
            inputRef.current.reset();
        }

        onSmsRetryClick();
    };

    const clearTimer = useCallback(() => {
        window.clearTimeout(timerId.current);
    }, []);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }

        return () => {
            clearTimer();
        };
    }, [clearTimer]);

    useEffect(() => {
        if (!inputRef.current) {
            return;
        }

        if (state === 'CODE_ERROR' && prevState !== 'CODE_ERROR') {
            inputRef.current.reset();
            inputRef.current.focus();
            inputRef.current.unselect();
        }

        if (prevState === 'CODE_SENDING' && state !== 'CODE_SENDING') {
            inputRef.current.focus();
        }
    }, [prevState, state]);

    useEffect(() => {
        if (prevState === 'CODE_SENDING' && state !== 'CODE_SENDING') {
            setCodeSendHintVisible(true);

            clearTimer();

            timerId.current = window.setTimeout(() => {
                setCodeSendHintVisible(false);
            }, CODE_SEND_HINT_VISIBLE_DURATION);
        }
    }, [prevState, state, clearTimer]);

    const processing = ['CODE_CHECKING', 'CODE_SENDING'].includes(state);

    const timePassed = timeLeft === 0;

    return (
        <div className={cn(styles[alignContent])}>
            <h3 className={styles.header}>{texts.title}</h3>

            {phone && <div className={styles.phone}>Код отправлен на {phone}</div>}

            <div
                className={cn(styles.inputContainer, {
                    [styles.compact]: timePassed,
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

            <CountdownSection
                processing={processing}
                timePassed={timePassed}
                codeSendHintVisible={codeSendHintVisible}
                handleSmsRetryClick={handleSmsRetryClick}
            />

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
