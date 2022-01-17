import React, { useState } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { Select } from '@alfalab/core-components-select';

import { Confirmation } from './component-v2';
import { ConfirmationProps } from './types';

const variants = [
    { key: 'success', content: 'Успешный сценарий' },
    { key: 'error', content: 'Сценарий с ошибкой' },
    { key: 'fatal', content: 'Сценарий с критичной ошибкой' },
    {
        key: 'attempts-left',
        content: 'Сценарий, когда кончились попытки запроса смс',
    },
    {
        key: 'temp-block',
        content: 'Сценарий, когда форма временно заблокирована',
    },
];

export const ConfirmationExample = () => {
    const [variant, setVariant] = useState<any>({ key: 'success', content: 'Успешный сценарий' });

    const [state, setState] = useState('INITIAL');
    const [screen, setScreen] = useState('INITIAL');
    const [blockedSmsRetry, setBlockedSmsRetry] = useState(false);

    const handleInputFinished: ConfirmationProps['onInputFinished'] = () => {
        setTimeout(() => {
            switch (variant.key) {
                case 'success':
                    setState('INITIAL');
                    break;
                case 'error':
                    setState('CODE_ERROR');
                    break;
                case 'fatal':
                    setScreen('FATAL_ERROR');
                    break;
                case 'attempts-left':
                    setState('CODE_ERROR');
                    break;
                case 'temp-block':
                    setScreen('TEMP_BLOCK');
                    break;
                default:
                    break;
            }
        }, 1000);
    };

    const handleSmsRetryClick: ConfirmationProps['onSmsRetryClick'] = () => {
        setTimeout(() => {
            if (variant.key === 'attempts-left') {
                setBlockedSmsRetry(true);
            }

            setState('INITIAL');
        }, 1000);
    };

    const handleTempBlockFinished = () => {
        setScreen('INITIAL');
        setState('CODE_SENDING');
    };

    return (
        <div>
            <Select
                options={variants}
                onChange={({ selected }) => {
                    setState('INITIAL');
                    setScreen('INITIAL');
                    setBlockedSmsRetry(false);
                    setVariant(selected);
                }}
                selected={variant.key}
            />

            <div
                key={variant.key}
                style={{
                    display: 'flex',
                    width: '500px',
                    margin: '16px 0 0',
                    padding: '16px',
                    boxShadow: '0 0 0 1px #eeeff1',
                    boxSizing: 'border-box',
                }}
            >
                <Confirmation
                    state={state}
                    screen={screen}
                    alignContent='center'
                    noAttemptsLeft={blockedSmsRetry}
                    countdownDuration={10000}
                    onChangeState={setState}
                    onChangeScreen={setScreen}
                    onInputFinished={handleInputFinished}
                    onSmsRetryClick={handleSmsRetryClick}
                    onTempBlockFinished={handleTempBlockFinished}
                    phoneNumber='+7 ··· ··· 07-24'
                />
            </div>
        </div>
    );
};
