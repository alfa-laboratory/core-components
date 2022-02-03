import React, { useContext, useEffect, Fragment } from 'react';

import { CountdownLoader } from '../../countdown-loader';

import { ConfirmationContext } from '../../../context';
import { formatMsAsMinutes, useCountdown } from '../../../utils';

import styles from './index.module.css';

export const TempBlock = () => {
    const { texts, tempBlockDuration, onChangeScreen, onTempBlockFinished } = useContext(
        ConfirmationContext,
    );

    const [timeLeft, startTimer] = useCountdown(tempBlockDuration);

    useEffect(() => {
        startTimer();
    }, [startTimer]);

    useEffect(() => {
        if (timeLeft === 0 && onTempBlockFinished) {
            onTempBlockFinished();
        }
    }, [timeLeft, onChangeScreen, onTempBlockFinished]);

    return (
        <Fragment>
            <h3 className={styles.header}>{texts.tempBlockTitle}</h3>

            <div className={styles.description}>{texts.tempBlockDescription}</div>

            <div className={styles.countdownWrap}>
                <CountdownLoader
                    progress={1 - timeLeft / tempBlockDuration}
                    className={styles.loader}
                />

                {formatMsAsMinutes(timeLeft)}
            </div>
        </Fragment>
    );
};
