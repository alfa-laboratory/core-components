import React, { MouseEvent, FC, useCallback, useState, useRef, useEffect, ReactNode } from 'react';
import cn from 'classnames';
import { phoneNumber } from '@alfalab/utils';
import { usePrevious } from '@alfalab/hooks';

import { Button } from '@alfalab/core-components-button';

import { CountdownLoader } from '../countdown-loader';

import styles from './index.module.css';

/**
 * TODO: Вынести это в utils
 * Форматирование миллисекунд в hh:mm:ss.
 *
 * @param {Number} ms миллисекунды
 * @returns {String} время в формате mm:ss
 */
export function formatMsAsMinutes(ms: number) {
    const totalSeconds = Math.ceil(ms / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);

    const seconds = totalSeconds % 60;
    const paddedSeconds = `00${seconds}`.slice(-2);

    if (totalHours > 0) {
        const minutes = totalMinutes % 60;

        const paddedMinutes = `00${minutes}`.slice(-2);
        const paddedHours = `00${totalHours}`.slice(-2);

        return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
    }

    const paddedMinutes = `00${totalMinutes}`.slice(-2);

    return `${paddedMinutes}:${paddedSeconds}`;
}

export type CountdownProps = {
    duration: number;
    hasPhoneMask: boolean;
    phone?: string;
    alignContent: string;
    buttonRetryText: string;
    noAttemptsLeftMessage?: string;
    hasError: boolean;
    content?: ReactNode;
    onCountdownFinished?: () => void;
    onRepeatSms: (event: MouseEvent) => void;
};

type ContainerProps = Pick<CountdownProps, 'alignContent' | 'hasError'>;

const Container: FC<ContainerProps> = ({ alignContent, hasError, children }) => (
    <div
        className={cn(styles.component, styles[alignContent], {
            [styles.hasError]: hasError,
        })}
    >
        {children}
    </div>
);

export const Countdown: FC<CountdownProps> = ({
    duration = 5000,
    phone = '',
    hasPhoneMask = true,
    buttonRetryText,
    alignContent,
    noAttemptsLeftMessage,
    hasError,
    content,
    onRepeatSms,
    onCountdownFinished,
}) => {
    const timerId = useRef(0);

    const start = useRef(0);

    const [repeatSmsButtonShow, setRepeatSmsButtonShow] = useState(false);

    const [timePassed, setTimePassed] = useState(0);

    const noAttemptsLeftMessagePrev = usePrevious(noAttemptsLeftMessage);

    const stopTimer = useCallback(() => {
        window.clearInterval(timerId.current);
    }, []);

    const updateProgress = useCallback(() => {
        const passed = Date.now() - start.current;

        if (passed >= duration) {
            setRepeatSmsButtonShow(true);

            if (onCountdownFinished) {
                onCountdownFinished();
            }

            stopTimer();
        } else {
            setTimePassed(passed);
        }
    }, [duration, onCountdownFinished, stopTimer]);

    const startTimer = useCallback(() => {
        start.current = Date.now();

        updateProgress();

        timerId.current = window.setInterval(updateProgress, 50);
    }, [updateProgress]);

    const handleRepeatSmsButtonClick = useCallback(
        (event: MouseEvent) => {
            setRepeatSmsButtonShow(false);

            if (onRepeatSms) {
                onRepeatSms(event);
            }

            startTimer();
        },
        [onRepeatSms, startTimer],
    );

    useEffect(() => {
        startTimer();

        return () => {
            stopTimer();
        };
    }, [startTimer, stopTimer]);

    useEffect(() => {
        // Если кончились попытки ввода кода, то останавливаем таймер
        if (!noAttemptsLeftMessagePrev && noAttemptsLeftMessage) {
            stopTimer();
        }
    }, [noAttemptsLeftMessage, noAttemptsLeftMessagePrev, stopTimer]);

    const progress = timePassed / duration;

    const formattedPhone = phoneNumber.format(phone);

    const retryButton = (
        <Button
            size='xs'
            view='secondary'
            onClick={handleRepeatSmsButtonClick}
            className={styles.getCodeButton}
        >
            {buttonRetryText}
        </Button>
    );

    if (content) {
        return (
            <Container alignContent={alignContent} hasError={hasError}>
                <div className={styles.customContent}>{content}</div>

                {retryButton}
            </Container>
        );
    }

    return (
        <Container alignContent={alignContent} hasError={hasError}>
            {phone && !hasError && (
                <div>
                    Код отправлен на
                    {' '}
                    {hasPhoneMask ? phoneNumber.mask(formattedPhone) : formattedPhone}
                </div>
            )}

            {/* eslint-disable-next-line no-nested-ternary */}
            {noAttemptsLeftMessage ? (
                <div className={styles.noAttemptsLeftMessage}>{noAttemptsLeftMessage}</div>
            ) : repeatSmsButtonShow ? (
                retryButton
            ) : (
                <div>
                    <div className={styles.info}>Запросить повторно можно через</div>
                    <div className={styles.loaderWrap}>
                        <CountdownLoader progress={progress} className={styles.loader} />

                        <div className={styles.timePassed}>
                            {formatMsAsMinutes(duration - timePassed)}
                        </div>
                    </div>
                </div>
            )}
        </Container>
    );
};
