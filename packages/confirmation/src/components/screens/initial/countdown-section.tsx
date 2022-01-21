import React, { useContext, FC } from 'react';

import { Loader } from '@alfalab/core-components-loader';
import { Button } from '@alfalab/core-components-button';

import { ConfirmationContext } from '../../../context';
import { formatMsAsMinutes } from '../../../utils';

import styles from './index.module.css';

type CountdownSectionProps = {
    codeSendHintVisible: boolean;
    timePassed: boolean;
    processing: boolean;
    handleSmsRetryClick: () => void;
};

export const CountdownSection: FC<CountdownSectionProps> = ({
    codeSendHintVisible,
    timePassed,
    processing,
    handleSmsRetryClick,
}) => {
    const { state, texts, timeLeft, blockSmsRetry } = useContext(ConfirmationContext);

    if (codeSendHintVisible) {
        return <div className={styles.loaderText}>{texts.codeSended}</div>;
    }

    if (processing) {
        return (
            <div className={styles.loaderWrap}>
                <Loader />

                <span className={styles.loaderText}>
                    {state === 'CODE_CHECKING' ? texts.codeChecking : texts.codeSending}
                </span>
            </div>
        );
    }

    if (blockSmsRetry) {
        return <div>{texts.noAttemptsLeft}</div>;
    }

    if (timePassed) {
        return (
            <Button
                size='xxs'
                view='secondary'
                onClick={handleSmsRetryClick}
                className={styles.getCodeButton}
            >
                {texts.buttonRetry}
            </Button>
        );
    }

    return (
        <div className={styles.countdown}>
            Запросить повторно можно через{' '}
            <div className={styles.countdownTimer}>{formatMsAsMinutes(timeLeft)}</div>
        </div>
    );
};
