import React, { ComponentType, FC, useEffect } from 'react';

import cn from 'classnames';
import { usePrevious } from '@alfalab/hooks';

import { ConfirmationContext } from './context';
import { ConfirmationProps, TConfirmationContext, defaultTexts } from './types';
import { Initial, Hint, TempBlock, FatalError } from './components-v2';
import { useCountdown, ONE_DAY, ONE_MINUTE } from './utils';

import styles from './index.module.css';

const confirmationScreens: { [key: string]: ComponentType } = {
    INITIAL: Initial,
    HINT: Hint,
    FATAL_ERROR: FatalError,
    TEMP_BLOCK: TempBlock,
};

export const Confirmation: FC<ConfirmationProps> = ({
    state,
    screen,
    alignContent = 'left',
    children,
    requiredCharAmount = 5,
    countdownDuration = ONE_MINUTE,
    tempBlockDuration = ONE_DAY,
    phoneNumber,
    noAttemptsLeft,
    getScreensMap,
    onInputFinished,
    onChangeState,
    onSmsRetryClick,
    onChangeScreen,
    onFatalErrorOkButtonClick,
    onTempBlockFinished,
    ...restProps
}) => {
    const [timeLeft, startTimer, stopTimer] = useCountdown(countdownDuration);

    const prevState = usePrevious(state);

    useEffect(() => {
        startTimer();

        return () => {
            stopTimer();
        };
    }, [startTimer, stopTimer]);

    useEffect(() => {
        /**
         * Перезапускаем таймер после повторного запроса кода
         */
        if (state === 'INITIAL' && prevState === 'CODE_SENDING') {
            startTimer();
        }
    }, [state, prevState, startTimer]);

    useEffect(() => {
        /**
         * Останавливаем таймер, если новый экран/состояние не содержит таймер
         */
        if (!['INITIAL', 'HINT'].includes(screen) || noAttemptsLeft) {
            stopTimer();
        }
    }, [state, screen, noAttemptsLeft, stopTimer]);

    const handleSmsRetry = () => {
        onChangeState('CODE_SENDING');

        onSmsRetryClick();
    };

    const handleInputFinished = (code: string) => {
        onChangeState('CODE_CHECKING');

        onInputFinished(code);
    };

    const handleFatalErrorOkButtonClick = () => {
        if (onFatalErrorOkButtonClick) {
            onFatalErrorOkButtonClick();
        }
    };

    const contextValue: TConfirmationContext = {
        alignContent,
        texts: { ...defaultTexts, ...restProps.texts },
        state,
        screen,
        requiredCharAmount,
        countdownDuration,
        timeLeft,
        tempBlockDuration,
        phoneNumber,
        noAttemptsLeft,
        onTempBlockFinished,
        onChangeState,
        onChangeScreen,
        onInputFinished: handleInputFinished,
        onSmsRetryClick: handleSmsRetry,
        onFatalErrorOkButtonClick: handleFatalErrorOkButtonClick,
    };

    const screensMap = getScreensMap ? getScreensMap(confirmationScreens) : confirmationScreens;

    const CurrentScreen = screensMap[screen];

    return (
        <ConfirmationContext.Provider value={contextValue}>
            <div className={cn(styles.component, styles[alignContent])}>
                {CurrentScreen && <CurrentScreen />}
            </div>
        </ConfirmationContext.Provider>
    );
};
