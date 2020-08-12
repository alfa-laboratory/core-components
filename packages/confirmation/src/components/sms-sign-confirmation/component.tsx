import React, {
    MouseEvent,
    FC,
    KeyboardEvent,
    MutableRefObject,
    useEffect,
    useCallback,
} from 'react';
import cn from 'classnames';

import { Link } from '@alfalab/core-components-link';
import { Loader } from '@alfalab/core-components-loader';

import { SmsCountdown } from '../sms-countdown';

import styles from './index.module.css';

export type SmsSignConfirmationProps = {
    /**
     * Флаг состояния обработки введенного кода.
     */
    codeChecking: boolean;

    /**
     * Флаг состояния отправки кода.
     */
    codeSending: boolean;

    /**
     * Флаг отрисовки подсказки "не приходит смс?"
     */
    isSmsHintVisible?: boolean;

    /**
     * Количество символов, которое можно ввести в поле ввода до того, как произойдет автоотправка
     */
    requiredCharAmount?: number;

    /**
     * Длительность обратного отсчета, в милисекундах
     */
    countdownDuration?: number;

    /**
     * Дополнительный контент
     */
    additionalContent?: React.ReactNode;

    /**
     * Управление необходимостью маскировать номер телефона
     */
    hasPhoneMask?: boolean;

    /**
     * Номер телефона, на который отправляется смс.
     * Пробрасывается в компонент обратного отсчета as is и форматируется там же.
     * Должен быть в формате '+7 000 000 00 00'
     */
    phone?: string;

    /**
     * Значение поля ввода
     */
    value?: string;

    /**
     * Текст ошибки подписания, которая выводится под полем ввода для кода
     */
    error?: string;

    /**
     * Заголовок компонента
     */
    title?: string;

    /**
     * Текст лоадера при проверке кода
     */
    codeCheckingText?: string;

    /**
     * Текст лоадера при отправке кода
     */
    codeSendingText?: string;

    /**
     * Управление отображением таймера с кнопкой "Запросить код повторно'"
     */
    hasSmsCountdown?: boolean;

    /**
     * Обработчик события завершения ввода кода
     */
    onInputFinished: (value: string) => void;

    /**
     * Обработчик события изменения значения поля ввода кода
     */
    onInputChange?: (value: string) => void;

    /**
     * Обработчик события нажатия на кнопку "запросить код повторно"
     */
    onSmsRetryClick: (event?: React.MouseEvent) => void;

    /**
     * Обработчик события завершения обратного отсчета
     */
    onCountdownFinished?: () => void;

    /**
     * Обработчик события нажатия на ссылку "не приходит смс?"
     */
    onSmsHintLinkClick?: (event?: React.MouseEvent) => void;

    /**
     * Реф со ссылкой на инпут
     */
    inputRef: MutableRefObject<HTMLInputElement | null>;
};

export const SmsSignConfirmation: FC<SmsSignConfirmationProps> = ({
    codeChecking,
    codeSending,
    isSmsHintVisible = false,
    requiredCharAmount = 4,
    countdownDuration = 60000,
    additionalContent,
    hasPhoneMask,
    phone,
    value: inputValue,
    error = '',
    title = 'Введите код из\xa0смс',
    hasSmsCountdown = true,
    onInputFinished,
    onInputChange,
    onSmsRetryClick,
    onCountdownFinished,
    onSmsHintLinkClick,
    inputRef,
    codeCheckingText = 'Проверка кода',
    codeSendingText = 'Отправляем код',
}) => {
    const focus = useCallback(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [inputRef]);

    const blur = useCallback(() => {
        if (inputRef.current) {
            inputRef.current.blur();
        }
    }, [inputRef]);

    const isProcessing = codeChecking || codeSending;

    const displayedError = isProcessing ? '' : error;

    const handleInputKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                onInputFinished((event.target as HTMLInputElement).value);
            }
        },
        [onInputFinished],
    );

    const handleSmsRetryClick = useCallback(
        (event: MouseEvent) => {
            onSmsRetryClick(event);
        },
        [onSmsRetryClick],
    );

    const handleSmsHintLinkClick = useCallback(
        (event: MouseEvent) => {
            if (onSmsHintLinkClick) {
                onSmsHintLinkClick(event);
            }
        },
        [onSmsHintLinkClick],
    );

    const handleInputFinished = useCallback(
        (value: string) => {
            onInputFinished(value);

            blur();
        },
        [blur, onInputFinished],
    );

    const handleInputChange = useCallback(
        (value: string) => {
            if (onInputChange) {
                onInputChange(value);
            }
        },
        [onInputChange],
    );

    const handleCountdownFinished = useCallback(() => {
        if (onCountdownFinished) {
            onCountdownFinished();
        }
    }, [onCountdownFinished]);

    useEffect(() => {
        if (error) {
            focus();
        }
    }, [error, focus]);

    useEffect(() => {
        if (!isProcessing) {
            focus();
        }
    }, [isProcessing, focus]);

    return (
        <div className={styles.component}>
            <span className={styles.header}>{title}</span>

            <div className={styles.inputContainer}>
                <input
                    // requiredChars={requiredCharAmount}
                    disabled={isProcessing}
                    // error={displayedError}
                    value={inputValue}
                    onChange={event => {
                        if (event.target.value.length === requiredCharAmount) {
                            handleInputFinished(event.target.value);
                        }

                        handleInputChange(event.target.value);
                    }}
                    onKeyDown={handleInputKeyDown}
                    ref={inputRef}
                    // resetError={false}
                />

                {displayedError && <div className={styles.error}>{displayedError}</div>}
            </div>

            {isProcessing && (
                <div className={styles.loaderWrap}>
                    <Loader />
                    <span className={styles.loaderText}>
                        {codeChecking ? codeCheckingText : codeSendingText}
                    </span>
                </div>
            )}

            {hasSmsCountdown && (
                <div className={cn('countdown', { [styles.hidden]: isProcessing })}>
                    <SmsCountdown
                        // ref={this.setSmsCountdownRef}
                        duration={countdownDuration}
                        format='minutes'
                        phone={phone}
                        hasPhoneMask={hasPhoneMask}
                        retryText='Запросить повторно можно'
                        buttonText='Запросить код повторно'
                        onRepeatSms={handleSmsRetryClick}
                        onCountdownFinished={handleCountdownFinished}
                        className={styles.countdown}
                    />
                </div>
            )}

            {isSmsHintVisible && (
                <div className={styles.smsComeLinkWrap}>
                    <Link
                        onClick={handleSmsHintLinkClick}
                        className={styles.smsComeLink}
                        view='secondary'
                    >
                        Не приходит сообщение?
                    </Link>
                </div>
            )}

            <div>{additionalContent}</div>
        </div>
    );
};
