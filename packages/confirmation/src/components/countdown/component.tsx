import React, { MouseEvent, FC, useCallback, useState, useRef, useEffect } from 'react';
import cn from 'classnames';

import { Button } from '@alfalab/core-components-button';

import styles from './index.module.css';

/**
 * TODO: Вынести это в utils?
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
 * TODO: Вынести это в utils?
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

const TIMER_ITERATION_VALUE = 1000;

export type CountdownProps = {
    duration: number;
    hasPhoneMask: boolean;
    phone?: string;
    className?: string;
    onCountdownFinished?: () => void;
    onRepeatSms: (event: MouseEvent) => void;
};

export const Countdown: FC<CountdownProps> = ({
    duration = 5000,
    phone,
    hasPhoneMask = true,
    onRepeatSms,
    onCountdownFinished,
    className,
}) => {
    const [timer, setTimer] = useState(duration);

    const [repeatSmsButtonShow, setRepeatSmsButtonShow] = useState(false);

    const timerID = useRef<number>(0);

    const stopTimer = () => {
        if (timerID.current) {
            clearTimeout(timerID.current);
            timerID.current = 0;
        }
    };

    const tic = useCallback(() => {
        if (timer <= 0) {
            stopTimer();

            setTimer(0);
            setRepeatSmsButtonShow(true);

            if (onCountdownFinished) {
                onCountdownFinished();
            }
        } else {
            setTimer(prevTimer => prevTimer - TIMER_ITERATION_VALUE);

            timerID.current = window.setTimeout(tic, TIMER_ITERATION_VALUE);
        }
    }, [onCountdownFinished, timer]);

    const startTimer = useCallback(() => {
        stopTimer();

        timerID.current = window.setTimeout(tic, TIMER_ITERATION_VALUE);
    }, [tic]);

    const startSmsCountdown = useCallback(() => {
        setTimer(duration);
        setRepeatSmsButtonShow(false);

        startTimer();
    }, [duration, startTimer]);

    const handleRepeatSmsButtonClick = useCallback(
        (event: MouseEvent) => {
            startSmsCountdown();

            if (onRepeatSms) {
                onRepeatSms(event);
            }
        },
        [onRepeatSms, startSmsCountdown],
    );

    useEffect(() => {
        startTimer();

        return () => {
            stopTimer();
        };
    }, [startTimer]);

    useEffect(() => {
        if (!repeatSmsButtonShow && !timerID.current) {
            // если компонент переключился в активное состояние, а таймер еще не запущен, то стартуем его
            startTimer();
        }
    }, [repeatSmsButtonShow, startTimer]);

    return (
        <div className={cn(styles.component, className)}>
            {repeatSmsButtonShow ? (
                <Button size='s' view='secondary' block={true} onClick={handleRepeatSmsButtonClick}>
                    Запросить код повторно
                </Button>
            ) : (
                <div>
                    {phone && (
                        <div>
                            Код отправлен на
                            {' '}
                            {hasPhoneMask ? formatMaskedPhone(phone) : phone}
                        </div>
                    )}

                    <div className={styles.info}>Запросить повторно можно через</div>

                    {formatMsAsMinutes(timer)}
                </div>
            )}
        </div>
    );
};
