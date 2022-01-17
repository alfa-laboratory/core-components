import { useCallback, useRef, useState } from 'react';

/**
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

type UseCountdown = (countdownDuration: number, tick?: number) => [number, () => void, () => void];

/**
 * Возвращает время, которое осталось до истечения таймера в ms
 */
export const useCountdown: UseCountdown = (countdownDuration, tick = 1000) => {
    const timerId = useRef(0);

    const start = useRef(0);

    const [timePassed, setTimePassed] = useState(0);

    const stopTimer = useCallback(() => {
        window.clearInterval(timerId.current);
    }, []);

    const updateProgress = useCallback(() => {
        const passed = Date.now() - start.current;

        if (passed >= countdownDuration) {
            stopTimer();

            setTimePassed(countdownDuration);
        } else {
            setTimePassed(passed);
        }
    }, [countdownDuration, stopTimer]);

    const startTimer = useCallback(() => {
        stopTimer();

        start.current = Date.now();

        updateProgress();

        timerId.current = window.setInterval(updateProgress, tick);
    }, [stopTimer, updateProgress, tick]);

    return [countdownDuration - timePassed, startTimer, stopTimer];
};

export const ONE_DAY = 24 * 60 * 60 * 1000;
export const ONE_MINUTE = 60 * 1000;
