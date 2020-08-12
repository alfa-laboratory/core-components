import React, { MouseEvent, forwardRef, useCallback, useState, useRef, useEffect } from 'react';
import cn from 'classnames';
import { Button } from '@alfalab/core-components-button';

import styles from './index.module.css';

/**
 * TODO: Вынести это в utils
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

export const TIME_FORMAT = {
    SECONDS: 'seconds',
    MINUTES: 'minutes',
} as const;

const TIMER_ITERATION_VALUE = 1000;

export type SmsCountdownProps = {
    /**
     * Количество миллисекунд, через которое показать кнопку "Повторить"
     * @default 5000
     */
    duration?: number;

    /**
     * Состояние блокированности компонента
     * @default false
     */
    disabled?: boolean;

    /**
     * Обработчик клика по кнопке "Повторить"
     * @default null
     */
    onRepeatSms?: (event: MouseEvent) => void;

    /**
     * Сообщение на кнопке и в строке ожидания. Не действует, если для этих элементов текст указан явно через другие свойства
     * @default 'Запросить пароль повторно'
     */
    message?: string;

    /**
     * Текст на кнопке
     */
    buttonText?: string;

    /**
     * Текст сообщения в блоке таймера
     */
    retryText?: string;

    /**
     * Управление необходимостью маскировать номер телефона
     * @default true
     */
    hasPhoneMask?: boolean;

    /**
     * Номер телефона на который будет отправлено сообщение
     * @default null
     */
    phone?: string;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Уникальный идентификатор блока
     */
    id?: string;

    /**
     * Формат отображения оставшегося времени
     * @default 'seconds'
     */
    format?: 'seconds' | 'minutes';

    /**
     * Обработчик события завершения обратного отсчета
     */
    onCountdownFinished?: () => void;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export const SmsCountdown = forwardRef<HTMLDivElement, SmsCountdownProps>(
    (
        {
            disabled = false,
            buttonText,
            message = 'Запросить пароль повторно',
            duration = 5000,
            phone,
            hasPhoneMask = true,
            onRepeatSms,
            format = TIME_FORMAT.SECONDS,
            dataTestId,
            id,
            retryText,
            onCountdownFinished,
            className,
        },
        ref,
    ) => {
        const [timer, setTimer] = useState(duration);

        const [repeatSmsButtonShow, setRepeatSmsButtonShow] = useState(false);

        const timerID = useRef<number>(0);

        const getFormattedTimeLeft = () => {
            return format === TIME_FORMAT.MINUTES
                ? formatMsAsMinutes(timer)
                : `${timer / TIMER_ITERATION_VALUE} сек`;
        };

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
            if (!repeatSmsButtonShow && !disabled && !timerID.current) {
                // если компонент переключился в активное состояние, а таймер еще не запущен, то стартуем его
                startTimer();
            }
        }, [disabled, repeatSmsButtonShow, startTimer]);

        return (
            <div
                className={cn(styles.component, className)}
                id={id}
                data-test-id={dataTestId}
                ref={ref}
            >
                {repeatSmsButtonShow ? (
                    <Button
                        size='s'
                        view='secondary'
                        block={true}
                        onClick={handleRepeatSmsButtonClick}
                        disabled={disabled}
                    >
                        {buttonText || message}
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

                        <div className={styles.info}>{retryText || message} через</div>

                        {getFormattedTimeLeft()}
                    </div>
                )}
            </div>
        );
    },
);
