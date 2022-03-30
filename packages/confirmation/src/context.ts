import { createContext } from 'react';

import { TConfirmationContext } from './types';
import { ONE_DAY, ONE_MINUTE } from './utils';

const mockFn = () => undefined;

export const ConfirmationContext = createContext<TConfirmationContext>({
    alignContent: 'left',
    texts: {},
    state: 'INITIAL',
    screen: 'INITIAL',
    requiredCharAmount: 5,
    countdownDuration: ONE_MINUTE,
    timeLeft: ONE_MINUTE,
    tempBlockDuration: ONE_DAY,
    phone: '',
    onTempBlockFinished: mockFn,
    onInputFinished: mockFn,
    onChangeState: mockFn,
    onSmsRetryClick: mockFn,
    onChangeScreen: mockFn,
    onFatalErrorOkButtonClick: mockFn,
});
