import { ComponentType, ReactNode } from 'react';

export type ConfirmationProps = {
    /**
     * Экран компонента
     */
    screen: ConfirmationScreen | string;

    /**
     * Состояние компонента
     */
    state: ConfirmationState | string;

    /**
     * Позиционирование контента
     */
    alignContent?: 'left' | 'center';

    /**
     * Объект с текстами
     */
    texts?: ConfirmationTexts;

    /**
     * Количество символов, которое можно ввести в поле ввода подписания до того, как произойдет автоотправка
     */
    requiredCharAmount?: number;

    /**
     * Длительность обратного отсчета на кнопке повторного запроса сообщения, в милисекундах
     */
    countdownDuration?: number;

    /**
     * Продолжительность блокировки формы (ms)
     */
    tempBlockDuration?: number;

    /**
     * Номер телефона, на который отправлен код
     */
    phone?: string;

    /**
     * Не осталось попыток ввода кода
     */
    blockSmsRetry?: boolean;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;

    /**
     * Сss класс для стилизации общей обёртки
     */
    className?: string;

    /**
     * Функция обновления состояния компонента
     */
    onChangeState: (state: ConfirmationState | string) => void;

    /**
     * Функция обновления состояния компонента
     */
    onChangeScreen: (state: ConfirmationScreen | string) => void;

    /**
     * Обработчик события завершения ввода кода подписания
     */
    onInputFinished: (code: string) => void;

    /**
     * Обработчик события нажатия на кнопку "Запросить код"
     */
    onSmsRetryClick: () => void;

    /**
     * Клик по кнопке "Понятно" на экране фатальной ошибки
     */
    onFatalErrorOkButtonClick?: () => void;

    /**
     * Временная блокировка формы закончилась
     */
    onTempBlockFinished?: () => void;

    /**
     * Возввращает объект, где ключ - название экрана (screen), значение - компонент для экрана
     */
    getScreensMap?: (defaulScreensMap: ScreensMap) => ScreensMap;
};

export type TConfirmationContext = Required<
    Pick<
        ConfirmationProps,
        | 'alignContent'
        | 'texts'
        | 'state'
        | 'screen'
        | 'requiredCharAmount'
        | 'onInputFinished'
        | 'countdownDuration'
        | 'onChangeState'
        | 'onSmsRetryClick'
        | 'onChangeScreen'
        | 'onFatalErrorOkButtonClick'
        | 'tempBlockDuration'
    >
> &
    Pick<ConfirmationProps, 'phone' | 'blockSmsRetry' | 'onTempBlockFinished'> & {
        timeLeft: number;
    };

export type ConfirmationTexts = {
    /**
     * Экран INITIAL
     */
    title?: ReactNode; // заголовок
    codeError?: string; // ошибка проверки кода
    codeChecking?: string; // код проверяется
    codeSending?: string; // код отправляется
    codeSended?: string; // код отправлен
    buttonRetry?: string; // кнопка повторной отправки кода
    linkToHint?: string; // ссылка на экран HINT
    noAttemptsLeft?: string; // не осталось попыток запроса кода

    /**
     * Экран HINT
     */
    hintButton?: string; // кнопка 'Вернуться'

    /**
     * Экран FATAL_ERROR
     */
    fatalErrorTitle?: ReactNode; // заголовок
    fatalErrorDescription?: ReactNode; // описание
    fatalErrorButton?: string; // кнопка

    /**
     * Экран TEMP_BLOCK
     */
    tempBlockTitle?: ReactNode; // заголовок
    tempBlockDescription?: ReactNode; // описание
};

export type ConfirmationScreen =
    | 'INITIAL' // начальный экран
    | 'HINT' // экран "Не приходит смс?"
    | 'FATAL_ERROR' // экран критической ошибки
    | 'TEMP_BLOCK'; // экран временной блокировки

export type ConfirmationState =
    | 'INITIAL' // начальное состояние
    | 'CODE_CHECKING' // проверка кода
    | 'CODE_SENDING' // повторная отправка кода
    | 'CODE_ERROR'; // ошибка, когда ввели неверный код

export type ScreensMap = {
    [key: string]: ComponentType;
};

export const defaultTexts = {
    title: 'Введите код из\xa0сообщения',
    codeError: 'Код введён неверно',
    codeChecking: '',
    codeSending: '',
    buttonRetry: 'Запросить код повторно',
    linkToHint: 'Не\xa0приходит сообщение?',
    hintButton: 'Вернуться к\xa0вводу кода',
    noAttemptsLeft: 'Не\xa0осталось попыток запроса кода',
    fatalErrorTitle: 'Ввести код больше нельзя',
    fatalErrorDescription:
        'Вы\xa0ввели код неверно более 5\xa0раз. В\xa0целях безопасности мы\xa0ограничили дальнейший ввод.',
    fatalErrorButton: 'Понятно',
    tempBlockTitle: 'Превышено количество попыток запроса кода',
    tempBlockDescription: 'Повторное подтверждение кодом будет возможно через 24\xa0часа',
    codeSended: 'Код выслан',
};
