import React, { MouseEvent, FC, useCallback, useState, useRef, useEffect } from 'react';
import cn from 'classnames';
import { phoneNumber } from '@alfalab/utils';
import { usePrevious } from '@alfalab/hooks';

import { Button } from '@alfalab/core-components-button';

import { CountdownLoader } from '../countdown-loader';

import styles from './index.module.css';

/**
 * TODO: Вынести это в utils (https://github.com/alfa-laboratory/utils/pull/51)
 * Маскирует номер телефона.
 *
 * @param {String} number Номер телефона
 * @returns {String}
 */
export function formatMaskedPhone(number: string) {
    const first = number.substr(0, 2);
    const last = number.substr(number.length - 5, number.length);

    return `${first} ··· ··· ${last}`;
}

/**
 * TODO: Вынести это в utils
 * Форматирование миллисекунд в mm:ss.
 *
 * @param {Number} ms миллисекунды
 * @returns {String} время в формате mm:ss, но если оно более 100 минут,
 * то строка 'более, чем 99:99'
 */
export function formatMsAsMinutes(ms: number) {
    if (ms >= 6000000) {
        return 'более, чем 99:99';
    }
    const totalSeconds = (ms - (ms % 1000)) / 1000;
    const totalMinutes = (totalSeconds - (totalSeconds % 60)) / 60;
    const seconds = totalSeconds % 60;
    const paddedMinutes = `00${totalMinutes}`.slice(-2);
    const paddedSeconds = `00${seconds}`.slice(-2);

    return `${paddedMinutes}:${paddedSeconds}`;
}

export type CountdownProps = {
    duration: number;
    hasPhoneMask: boolean;
    phone?: string;
    alignContent: string;
    noAttemptsLeftMessage?: string;
    hasError: boolean;
    onCountdownFinished?: () => void;
    onRepeatSms: (event: MouseEvent) => void;
};

export const Countdown: FC<CountdownProps> = ({
    duration = 5000,
    phone = '',
    hasPhoneMask = true,
    alignContent,
    noAttemptsLeftMessage,
    hasError,
    onRepeatSms,
    onCountdownFinished,
}) => {
    const requestId = useRef(0);

    const start = useRef(0);

    const [repeatSmsButtonShow, setRepeatSmsButtonShow] = useState(false);

    const [timePassed, setTimePassed] = useState(0);

    const noAttemptsLeftMessagePrev = usePrevious(noAttemptsLeftMessage);

    const stopTimer = useCallback(() => {
        window.cancelAnimationFrame(requestId.current);
    }, []);

    const updateProgress = useCallback(() => {
        const passed = Date.now() - start.current;

        setTimePassed(passed);

        if (passed < duration) {
            requestId.current = window.requestAnimationFrame(updateProgress);
        } else {
            setRepeatSmsButtonShow(true);

            if (onCountdownFinished) {
                onCountdownFinished();
            }

            stopTimer();
        }
    }, [duration, onCountdownFinished, stopTimer]);

    const startTimer = useCallback(() => {
        start.current = Date.now();

        requestId.current = window.requestAnimationFrame(updateProgress);
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

    return (
        <div
            className={cn(styles.component, styles[alignContent], { [styles.hasError]: hasError })}
        >
            {phone && !hasError && (
                <div>
                    Код отправлен на
                    {' '}
                    {hasPhoneMask ? formatMaskedPhone(formattedPhone) : formattedPhone}
                </div>
            )}

            {/* eslint-disable-next-line no-nested-ternary */}
            {noAttemptsLeftMessage ? (
                <div className={styles.noAttemptsLeftMessage}>{noAttemptsLeftMessage}</div>
            ) : repeatSmsButtonShow ? (
                <Button
                    size='xs'
                    view='secondary'
                    onClick={handleRepeatSmsButtonClick}
                    className={styles.getCodeButton}
                >
                    Запросить новый код
                </Button>
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
        </div>
    );
};
