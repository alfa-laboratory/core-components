import React, { MouseEvent, FC, useCallback, useState, useRef, useEffect } from 'react';

import { Button } from '@alfalab/core-components-button';
import { CrossCircleMIcon } from '@alfalab/icons-glyph';

import { CountdownLoader } from '../countdown-loader';
import { formatMsAsMinutes } from '../countdown';

import styles from './index.module.css';

export type OverlimitProps = {
    duration?: number;
    buttonRetryText: string;
    hasFatalError: boolean;
    title: string;
    text: string;
    onOverlimitCountdownFinished: () => void;
    onOverlimitRepeatSms: (event: MouseEvent) => void;
};

export const Overlimit: FC<OverlimitProps> = ({
    duration = 60000,
    buttonRetryText,
    hasFatalError,
    onOverlimitRepeatSms,
    onOverlimitCountdownFinished,
    text,
    title,
}) => {
    const timerId = useRef(0);

    const start = useRef(0);

    const [isBlockingOver, setIsBlockingOver] = useState(false);

    const [timePassed, setTimePassed] = useState(0);

    const stopTimer = useCallback(() => {
        window.clearInterval(timerId.current);
    }, []);

    const updateProgress = useCallback(() => {
        const passed = Date.now() - start.current;

        if (passed >= duration) {
            setIsBlockingOver(true);

            if (onOverlimitCountdownFinished) {
                onOverlimitCountdownFinished();
            }

            stopTimer();
        } else {
            setTimePassed(passed);
        }
    }, [duration, onOverlimitCountdownFinished, stopTimer]);

    const startTimer = useCallback(() => {
        start.current = Date.now();

        updateProgress();

        timerId.current = window.setInterval(updateProgress, 50);
    }, [updateProgress]);

    const handleRepeatSmsButtonClick = useCallback(
        (event: MouseEvent) => {
            setIsBlockingOver(false);

            if (onOverlimitRepeatSms) {
                onOverlimitRepeatSms(event);
            }

            startTimer();
        },
        [onOverlimitRepeatSms, startTimer],
    );

    useEffect(() => {
        startTimer();

        return () => {
            stopTimer();
        };
    }, [startTimer, stopTimer]);

    const progress = timePassed / duration;

    return (
        <div className={styles.component}>
            {hasFatalError && (
                <div className={styles.alertIcon}>
                    <CrossCircleMIcon data-test-id='alert-icon' width={64} height={64} />
                </div>
            )}
            <span className={styles.title}>{title}</span>
            <div className={styles.description}>
                <div>{text}</div>
                {isBlockingOver ? (
                    <Button
                        size='xs'
                        view='secondary'
                        onClick={handleRepeatSmsButtonClick}
                        className={styles.getCodeButton}
                    >
                        {buttonRetryText}
                    </Button>
                ) : (
                    <div className={styles.countdown}>
                        <CountdownLoader progress={progress} className={styles.loader} />

                        <div className={styles.timePassed}>
                            {formatMsAsMinutes(duration - timePassed)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
