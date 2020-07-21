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

import { SmsCountdown } from '../sms-countdown';

import styles from './index.module.css';

export type SmsSignConfirmationProps = {
    /**
     * Флаг состояния обработки введенного кода.
     * Если true - рисуется спиннер и дизейблится поле ввода.
     * Если false - рисуется компонент обратного отсчета на повторный запрос смс.
     */
    isProcessing: boolean;

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
     * Управление отображением таймера с кнопкой "Запросить пароль повторно'"
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
     * Обработчик события нажатия на кнопку "запросить пароль повторно"
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
    isProcessing,
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

    const displayedError = isProcessing ? '' : error;

    const handleInputKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            onInputFinished((event.target as HTMLInputElement).value);
        }
    };

    const handleSmsRetryClick = (event: MouseEvent) => {
        onSmsRetryClick(event);
    };

    const handleSmsHintLinkClick = (event: MouseEvent) => {
        if (onSmsHintLinkClick) {
            onSmsHintLinkClick(event);
        }
    };

    const handleInputFinished = (value: string) => {
        onInputFinished(value);

        blur();
    };

    const handleInputChange = (value: string) => {
        if (onInputChange) {
            onInputChange(value);
        }
    };

    const handleCountdownFinished = () => {
        if (onCountdownFinished) {
            onCountdownFinished();
        }
    };

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

            {isProcessing && <div>spinner</div>}

            {hasSmsCountdown && (
                <div className={cn('countdown', { [styles.hidden]: isProcessing })}>
                    <SmsCountdown
                        // ref={this.setSmsCountdownRef}
                        duration={countdownDuration}
                        format='minutes'
                        phone={phone}
                        hasPhoneMask={hasPhoneMask}
                        retryText='Запросить повторно можно'
                        buttonText='Запросить пароль повторно'
                        onRepeatSms={handleSmsRetryClick}
                        onCountdownFinished={handleCountdownFinished}
                        className={styles.countdown}
                    />
                </div>
            )}

            {isSmsHintVisible && (
                <div className={styles.retryHint}>
                    <Link onClick={handleSmsHintLinkClick} className={styles.smsComeLink}>
                        Не приходит SMS?
                    </Link>
                </div>
            )}

            <div>{additionalContent}</div>
        </div>
    );
};
