import React, { forwardRef, useState, useRef, useEffect, useCallback } from 'react';
import cn from 'classnames';
import { Button } from '@alfalab/core-components-button';
import { Link } from '@alfalab/core-components-link';

import { SignConfirmation } from './components';

import styles from './index.module.css';

export type ContentAlign = 'left' | 'center';

export type ConfirmationProps = {
    /**
     * Значение поля ввода
     */
    code: string;

    /**
     * Флаг состояния обработки введенного кода.
     */
    codeChecking?: boolean;

    /**
     * Флаг состояния отправки кода.
     */
    codeSending?: boolean;

    /**
     * Состояние ошибки подписания
     */
    error?: boolean;

    /**
     * Текст ошибки подписания
     */
    errorText?: string;

    /**
     * Дополнительный контент
     */
    additionalContent?: React.ReactNode;

    /**
     * Флаг критичности ошибки подписания.
     * Если true - ошибка подписания рисуется на экране без поля ввода, но с кнопкой "Запросить код"
     * Если false - ошибка подписания рисуется под полем ввода кода
     */
    errorIsFatal?: boolean;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Номер телефона, на который отправляется сообщение.
     * Пробрасывается в компонент обратного отсчета as is и форматируется там же.
     * Должен быть в формате '+7 000 000 00 00'
     */
    phone?: string;

    /**
     * Управление необходимостью маскировать номер телефона
     */
    hasPhoneMask?: boolean;

    /**
     * Количество символов, которое можно ввести в поле ввода подписания до того, как произойдет автоотправка
     */
    requiredCharAmount?: number;

    /**
     * Управление отображением таймера с кнопкой "Запросить код"
     */
    hasSmsCountdown?: boolean;

    /**
     * Длительность обратного отсчета на кнопке повторного запроса сообщения, в милисекундах
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
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;

    /**
     * Текст лоадера при проверке кода
     */
    codeCheckingText?: string;

    /**
     * Текст лоадера при отправке кода
     */
    codeSendingText?: string;

    /**
     * Текст кнопки при блокирующей ошибке
     */
    buttonErrorText?: string;

    /**
     * Текст кнопки "Запросить код"
     */
    buttonRetryText?: string;

    /**
     * Позиционирование контента
     */
    alignContent?: ContentAlign;

    /**
     * Управление возможностью перезапросить код
     */
    disableSmsRepeat?: boolean;

    /**
     * Обработчик события завершения ввода кода подписания
     */
    onInputFinished: ({ code }: { code: string }) => void;

    /**
     * Обработчик события изменения значения поля ввода кода подписания
     */
    onInputChange: ({ code }: { code: string }) => void;

    /**
     * Обработчик события нажатия на кнопку "Запросить код"
     */
    onSmsRetryClick: () => void;

    /**
     * Обработчик события завершения обратного отсчета для повторного запроса сообщения
     */
    onCountdownFinished?: () => void;

    /**
     * Обработчик события нажатия на ссылку "не приходит сообщение?"
     */
    onSmsHintLinkClick?: () => void;

    /**
     * Обработчик события нажатия на ссылку "Попробовать заново", которая появляется при критической ошибке
     */
    onActionWithFatalError?: () => void;
};

export const Confirmation = forwardRef<HTMLDivElement, ConfirmationProps>(
    (
        {
            additionalContent,
            className,
            countdownDuration = 60000,
            dataTestId,
            errorIsFatal,
            errorTitle = 'Превышено количество попыток ввода кода',
            error = false,
            errorText,
            hasPhoneMask = true,
            hasSmsCountdown = true,
            phone,
            requiredCharAmount = 5,
            signTitle = 'Введите код из\xa0сообщения',
            code,
            codeSending = false,
            codeChecking = false,
            codeCheckingText = 'Проверка кода',
            codeSendingText = 'Отправляем код',
            buttonErrorText = 'Понятно',
            buttonRetryText = 'Попробовать заново',
            alignContent = 'left',
            disableSmsRepeat = false,
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

        const shouldShowError = errorIsFatal && Boolean(errorText);

        const shouldShowSignComponent = !showHint && !shouldShowError;

        const shouldShowHint = showHint && !shouldShowError;

        const nonFatalError = errorIsFatal ? '' : errorText;

        const shouldShowHintLink =
            disableSmsRepeat || (countdownFinished && !codeChecking && retries > 0);

        const inputRef = useRef<HTMLInputElement>(null);

        const handleSmsRetryClick = useCallback(() => {
            setRetries(prevRetry => prevRetry + 1);
            setCountdownFinished(false);
            onSmsRetryClick();
        }, [onSmsRetryClick]);

        const handleSmsRetryFromHintClick = useCallback(() => {
            setRetries(prevRetry => prevRetry + 1);
            setCountdownFinished(false);
            setShowHint(false);
            onSmsRetryClick();
        }, [onSmsRetryClick]);

        const handleCountdownFinished = useCallback(() => {
            setCountdownFinished(true);

            if (onCountdownFinished) {
                onCountdownFinished();
            }
        }, [onCountdownFinished]);

        const handleSmsHintLinkClick = useCallback(() => {
            setShowHint(true);

            if (onSmsHintLinkClick) {
                onSmsHintLinkClick();
            }
        }, [onSmsHintLinkClick]);

        const handleErrorSmsRetryClick = useCallback(() => {
            if (onActionWithFatalError) {
                onActionWithFatalError();
            } else {
                onSmsRetryClick();
            }
        }, [onActionWithFatalError, onSmsRetryClick]);

        useEffect(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, []);

        return (
            <div
                className={cn(styles.component, styles[alignContent], className)}
                ref={ref}
                data-test-id={dataTestId}
            >
                {shouldShowSignComponent && (
                    <SignConfirmation
                        codeChecking={codeChecking}
                        codeSending={codeSending}
                        smsHintVisible={shouldShowHintLink}
                        additionalContent={additionalContent}
                        requiredCharAmount={requiredCharAmount}
                        hasSmsCountdown={hasSmsCountdown}
                        countdownDuration={countdownDuration}
                        phone={phone}
                        code={code}
                        hasPhoneMask={hasPhoneMask}
                        errorText={nonFatalError || ''}
                        error={error}
                        title={signTitle}
                        inputRef={inputRef}
                        codeCheckingText={codeCheckingText}
                        codeSendingText={codeSendingText}
                        alignContent={alignContent}
                        disableSmsRepeat={disableSmsRepeat}
                        onInputFinished={onInputFinished}
                        onInputChange={onInputChange}
                        onSmsRetryClick={handleSmsRetryClick}
                        onCountdownFinished={handleCountdownFinished}
                        onSmsHintLinkClick={handleSmsHintLinkClick}
                    />
                )}

                {shouldShowError && (
                    <div className={styles.error}>
                        <span className={styles.errorHeader}>{errorTitle}</span>

                        <span className={styles.errorText}>{errorText}</span>

                        <Button
                            size='s'
                            view='secondary'
                            onClick={handleErrorSmsRetryClick}
                            block={true}
                        >
                            {buttonErrorText}
                        </Button>
                    </div>
                )}

                {shouldShowHint && (
                    <div className={styles.phoneHintWrap}>
                        <span className={styles.errorHeader}>Не&nbsp;приходит сообщение?</span>

                        <span className={styles.phoneHintText}>
                            Если у&nbsp;вас сменился номер телефона, пожалуйста, обратитесь
                            в&nbsp;любое отделение банка.
                        </span>

                        <div className={styles.phonesWrap}>
                            <div className={styles.phoneWrap}>
                                <Link className={styles.phoneLink} href='tel:+78002000000'>
                                    8 800 200-00-00
                                </Link>

                                <span className={styles.phoneDescription}>
                                    {' '}
                                    &mdash;&nbsp;для звонков по&nbsp;России
                                </span>
                            </div>

                            <div className={styles.phoneWrap}>
                                <Link className={styles.phoneLink} href='tel:+74957888878'>
                                    +7 495 788-88-78
                                </Link>

                                <span className={styles.phoneDescription}>
                                    {' '}
                                    &mdash;&nbsp;в&nbsp;Москве и&nbsp;за&nbsp;границей
                                </span>
                            </div>
                        </div>

                        <Button
                            size='s'
                            view='secondary'
                            block={true}
                            onClick={handleSmsRetryFromHintClick}
                        >
                            {buttonRetryText}
                        </Button>
                    </div>
                )}
            </div>
        );
    },
);

/**
 * Для отображения в сторибуке
 */
Confirmation.defaultProps = {
    countdownDuration: 60000,
    errorTitle: 'Превышено количество попыток ввода кода',
    hasPhoneMask: true,
    hasSmsCountdown: true,
    requiredCharAmount: 5,
    signTitle: 'Введите код из\xa0сообщения',
    codeSending: false,
    codeChecking: false,
    codeCheckingText: 'Проверка кода',
    codeSendingText: 'Отправляем код',
    buttonErrorText: 'Понятно',
    buttonRetryText: 'Попробовать заново',
    alignContent: 'left',
};
