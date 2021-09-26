import React, { forwardRef, useState, useRef, useEffect, useCallback, ReactNode } from 'react';
import cn from 'classnames';
import { Button } from '@alfalab/core-components-button';
import { Link } from '@alfalab/core-components-link';

import { SignConfirmation, Overlimit } from './components';

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
     * Состояние ошибки лимитов - превышено кол-во попыток ввода или запросов кода
     */
    errorOverlimit?: boolean;

    /**
     * Состояние критической ошибки лимитов - превышены все лимиты и попытки, пользователя блокируют
     */
    errorOverlimitIsFatal?: boolean;

    /**
     * Текст ошибки подписания
     */
    errorText?: string;

    /**
     * Дополнительный контент
     */
    additionalContent?: ReactNode;

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
    signTitle?: string | React.ReactNode;

    /**
     * Заголовок экрана ошибки лимитов
     */
    overlimitTitle?: string;

    /**
     * Текстовое описание блокировки формы при превышении лимитов
     */
    overlimitText?: string;

    /**
     * Длительно блокировки при превышении лимитов, в милисекундах
     */
    overlimitCountdownDuration?: number;

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
     * Текст кнопки "Вернуться назад" на экране помощи
     */
    buttonReturnText?: string;

    /**
     * Текст кнопки "Запросить новый код"
     */
    buttonRetryText?: string;

    /**
     * Позиционирование контента
     */
    alignContent?: ContentAlign;

    /**
     * Сообщение, если не осталось попыток ввода кода.
     * Кнопка повторной отправки смс при этом скрывается.
     */
    noAttemptsLeftMessage?: string;

    /**
     * Кастомный контент для компонента Countdown
     */
    countdownContent?: ReactNode;

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
     * Обработчик события нажатия на кнопку "Запросить код" в блоке превышение лимитов
     */
    onOverlimitSmsRetryClick?: () => void;

    /**
     * Обработчик события завершения обратного отсчета для повторного запроса сообщения
     */
    onCountdownFinished?: () => void;

    /**
     * Обработчик события завершения обратного отсчета для блокировки формы
     */
    onOverlimitCountdownFinished?: () => void;

    /**
     * Обработчик события нажатия на ссылку "не приходит сообщение?"
     */
    onSmsHintLinkClick?: () => void;

    /**
     * Обработчик события нажатия на кнопку buttonErrorText (по дефолту "Понятно"), которая появляется при критической ошибке.
     * Если не передан, то вызывается onSmsRetryClick
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
            errorOverlimit = false,
            errorOverlimitIsFatal = false,
            errorText,
            hasPhoneMask = true,
            hasSmsCountdown = true,
            phone,
            requiredCharAmount = 5,
            signTitle = 'Введите код из\xa0сообщения',
            overlimitTitle = 'Превышено количество\n попыток ввода кода',
            overlimitText = 'Повторное подтверждение кодом из SMS\n будет возможно через',
            overlimitCountdownDuration,
            code,
            codeSending = false,
            codeChecking = false,
            codeCheckingText = 'Проверка кода',
            codeSendingText = 'Отправляем код',
            buttonErrorText = 'Понятно',
            buttonReturnText = 'Вернуться назад',
            buttonRetryText = 'Запросить новый код',
            alignContent = 'left',
            noAttemptsLeftMessage,
            countdownContent,
            onInputFinished,
            onSmsRetryClick,
            onOverlimitSmsRetryClick,
            onActionWithFatalError,
            onCountdownFinished,
            onOverlimitCountdownFinished,
            onInputChange,
            onSmsHintLinkClick,
        },
        ref,
    ) => {
        const [showHint, setShowHint] = useState(false);

        const shouldShowFatalError = errorIsFatal && Boolean(errorText);

        const shouldShowOverlimitError = !errorIsFatal && !showHint && errorOverlimit;

        const shouldShowSignComponent =
            !showHint && !shouldShowFatalError && !shouldShowOverlimitError;

        const shouldShowHint = showHint && !shouldShowFatalError && !shouldShowOverlimitError;

        const nonFatalError = errorIsFatal ? '' : errorText;

        const inputRef = useRef<HTMLInputElement>(null);

        const handleSmsRetryClick = useCallback(() => {
            onSmsRetryClick();
        }, [onSmsRetryClick]);

        const handleOverlimitSmsRetryClick = useCallback(() => {
            if (onOverlimitSmsRetryClick) {
                onOverlimitSmsRetryClick();
            }
        }, [onOverlimitSmsRetryClick]);

        const handleSmsRetryFromHintClick = useCallback(() => {
            setShowHint(false);

            if (!noAttemptsLeftMessage) {
                onSmsRetryClick();
            }
        }, [onSmsRetryClick, noAttemptsLeftMessage]);

        const handleCountdownFinished = useCallback(() => {
            if (onCountdownFinished) {
                onCountdownFinished();
            }
        }, [onCountdownFinished]);

        const handleOverlimitCountdownFinished = useCallback(() => {
            if (onOverlimitCountdownFinished) {
                onOverlimitCountdownFinished();
            }
        }, [onOverlimitCountdownFinished]);

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
                        smsHintVisible={!codeChecking}
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
                        buttonRetryText={buttonRetryText}
                        inputRef={inputRef}
                        codeCheckingText={codeCheckingText}
                        codeSendingText={codeSendingText}
                        alignContent={alignContent}
                        noAttemptsLeftMessage={noAttemptsLeftMessage}
                        countdownContent={countdownContent}
                        onInputFinished={onInputFinished}
                        onInputChange={onInputChange}
                        onSmsRetryClick={handleSmsRetryClick}
                        onCountdownFinished={handleCountdownFinished}
                        onSmsHintLinkClick={handleSmsHintLinkClick}
                    />
                )}

                {shouldShowOverlimitError && (
                    <Overlimit
                        duration={overlimitCountdownDuration}
                        title={overlimitTitle}
                        text={overlimitText}
                        hasFatalError={errorOverlimitIsFatal}
                        buttonRetryText={buttonRetryText}
                        onOverlimitRepeatSms={handleOverlimitSmsRetryClick}
                        onOverlimitCountdownFinished={handleOverlimitCountdownFinished}
                    />
                )}

                {shouldShowFatalError && (
                    <div className={styles.error}>
                        <span className={styles.errorHeader}>{errorTitle}</span>

                        <span className={styles.errorText}>{errorText}</span>

                        <Button size='xs' view='secondary' onClick={handleErrorSmsRetryClick}>
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
                            className={styles.repeatButton}
                            size='xs'
                            view='secondary'
                            onClick={handleSmsRetryFromHintClick}
                        >
                            {buttonReturnText}
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
    buttonReturnText: 'Вернуться назад',
    buttonRetryText: 'Запросить новый код',
    alignContent: 'left',
};
