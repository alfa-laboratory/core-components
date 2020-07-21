import React, { forwardRef, useState, useRef, useEffect } from 'react';
import cn from 'classnames';
import { Button } from '@alfalab/core-components-button';
import { Link } from '@alfalab/core-components-link';

import { SmsSignConfirmation } from './components';

import styles from './index.module.css';

export type ConfirmationProps = {
    /**
     * Флаг состояния обработки введенного кода.
     * Если true - рисуется спиннер и дизейблится поле ввода.
     * Если false - рисуется компонент обратного отсчета на повторный запрос смс.
     */
    isProcessing: boolean;

    /**
     * Текст ошибки подписания
     */
    error?: string;

    /**
     * Дополнительный контент
     */
    additionalContent?: React.ReactNode;

    /**
     * Флаг критичности ошибки подписания.
     * Если true - ошибка подписания рисуется на экране без поля ввода, но с кнопкой "запросить пароль еще раз"
     * Если false - ошибка подписания рисуется под полем ввода кода
     */
    errorIsFatal?: boolean;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Уникальный идентификатор модального окна подписания
     */
    id?: string;

    /**
     * Номер телефона, на который отправляется смс.
     * Пробрасывается в компонент обратного отсчета as is и форматируется там же.
     * Должен быть в формате '+7 000 000 00 00'
     */
    phone?: string;

    /**
     * Управление необходимостью маскировать номер телефона
     * @default true
     */
    hasPhoneMask?: boolean;

    /**
     * Количество символов, которое можно ввести в поле ввода подписания до того, как произойдет автоотправка
     */
    requiredCharAmount?: number;

    /**
     * Управление отображением таймера с кнопкой "Запросить пароль повторно'"
     * @default true
     */
    hasSmsCountdown?: boolean;

    /**
     * Длительность обратного отсчета на кнопке повторного запроса смс, в милисекундах
     */
    countdownDuration?: number;

    /**
     * Заголовок экрана подписания
     */
    signTitle?: string;

    /**
     * Заголовок экрана блокирующей ошибки
     */
    errorTitle?: string;

    /**
     * Значение поля ввода
     */
    value?: string;

    /**
     * Обработчик события завершения ввода кода подписания
     */
    onInputFinished: (value?: string) => void;

    /**
     * Обработчик события изменения значения поля ввода кода подписания
     */
    onInputChange?: (value?: string) => void;

    /**
     * Обработчик события нажатия на кнопку "запросить пароль повторно"
     */
    onSmsRetryClick: () => void;

    /**
     * Обработчик события завершения обратного отсчета для повторного запроса смс
     */
    onCountdownFinished?: () => void;

    /**
     * Обработчик события нажатия на ссылку "не приходит смс?"
     */
    onSmsHintLinkClick?: () => void;

    /**
     * Обработчик события нажатия на ссылку "Попробовать заново", которая появляется при критической ошибке
     */
    onActionWithFatalError?: () => void;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export const Confirmation = forwardRef<HTMLDivElement, ConfirmationProps>(
    (
        {
            additionalContent,
            className,
            countdownDuration,
            dataTestId,
            error,
            errorIsFatal,
            errorTitle,
            hasPhoneMask,
            hasSmsCountdown,
            isProcessing,
            id,
            phone,
            requiredCharAmount,
            signTitle,
            value,
            onInputFinished,
            onSmsRetryClick,
            onActionWithFatalError,
            onCountdownFinished,
            onInputChange,
            onSmsHintLinkClick,
        },
        ref,
    ) => {
        const [showHint, setShowHint] = useState(false);

        const [retries, setRetries] = useState(0);

        const [countdownFinished, setCountdownFinished] = useState(false);

        const shouldShowErrorComponent = errorIsFatal && !!error;

        const shouldShowSignComponent = !showHint && !shouldShowErrorComponent;

        const shouldShowHintComponent = showHint && !shouldShowErrorComponent;

        const nonFatalError = errorIsFatal ? '' : error;

        const shouldShowHintLink = countdownFinished && !isProcessing && retries > 0;

        const inputRef = useRef<HTMLInputElement>(null);

        const handleInputFinished = (v: string) => {
            onInputFinished(v);
        };

        const handleInputChange = (v: string) => {
            if (onInputChange) {
                onInputChange(v);
            }
        };

        const handleSmsRetryClick = () => {
            setRetries(prevRetry => prevRetry + 1);
            setCountdownFinished(false);
            onSmsRetryClick();
        };

        const handleSmsRetryFromHintClick = () => {
            setRetries(prevRetry => prevRetry + 1);
            setCountdownFinished(false);
            setShowHint(false);
            onSmsRetryClick();
        };

        const handleCountdownFinished = () => {
            setCountdownFinished(true);

            if (onCountdownFinished) {
                onCountdownFinished();
            }
        };

        const handleSmsHintLinkClick = () => {
            setShowHint(true);

            if (onSmsHintLinkClick) {
                onSmsHintLinkClick();
            }
        };

        const handleErrorSmsRetryClick = () => {
            if (onActionWithFatalError) {
                onActionWithFatalError();
            } else {
                onSmsRetryClick();
            }
        };

        useEffect(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, []);

        return (
            <div
                className={cn(styles.component, className)}
                ref={ref}
                data-test-id={dataTestId}
                id={id}
            >
                {shouldShowSignComponent && (
                    <SmsSignConfirmation
                        isProcessing={isProcessing}
                        isSmsHintVisible={shouldShowHintLink}
                        additionalContent={additionalContent}
                        requiredCharAmount={requiredCharAmount}
                        hasSmsCountdown={hasSmsCountdown}
                        countdownDuration={countdownDuration}
                        phone={phone}
                        value={value}
                        hasPhoneMask={hasPhoneMask}
                        error={nonFatalError}
                        title={signTitle}
                        onInputFinished={handleInputFinished}
                        onInputChange={handleInputChange}
                        onSmsRetryClick={handleSmsRetryClick}
                        onCountdownFinished={handleCountdownFinished}
                        onSmsHintLinkClick={handleSmsHintLinkClick}
                        inputRef={inputRef}
                    />
                )}

                {shouldShowErrorComponent && (
                    <div className={styles.error}>
                        <span className={styles.errorHeader}>{errorTitle}</span>

                        <span className={styles.errorText}>{error}</span>

                        <Button size='xs' view='outlined' onClick={handleErrorSmsRetryClick}>
                            Попробовать заново
                        </Button>
                    </div>
                )}

                {shouldShowHintComponent && (
                    <div className={styles.phoneHintWrap}>
                        <span className={styles.errorHeader}>Не приходит смс?</span>

                        <span className={styles.phoneHintText}>
                            Если у вас сменился номер телефона, пожалуйста, обратитесь в любое
                            отделение банка.
                        </span>

                        <div className={styles.phonesWrap}>
                            <Link className={styles.phoneLink} href='tel:+78002000000'>
                                8 (800) 200-00-00
                            </Link>

                            <span className={styles.phoneDescription}>для звонков по России</span>

                            <Link className={styles.phoneLink} href='tel:+74957888878'>
                                +7 (495) 788-88-78
                            </Link>

                            <span className={styles.phoneDescription}>в Москве и за границей</span>
                        </div>

                        <Button
                            className={styles.repeatButton}
                            size='xs'
                            view='outlined'
                            onClick={handleSmsRetryFromHintClick}
                        >
                            Запросить пароль повторно
                        </Button>
                    </div>
                )}
            </div>
        );
    },
);
