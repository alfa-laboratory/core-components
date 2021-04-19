/* eslint-disable multiline-comment-style */
import React, {
    forwardRef,
    useCallback,
    useRef,
    useState,
    FocusEvent,
    ChangeEvent,
    MouseEvent,
    KeyboardEvent,
    useEffect,
    ElementType,
} from 'react';
import cn from 'classnames';
import { MaskedInput, MaskedInputProps } from '@alfalab/core-components-masked-input';
import {
    Calendar as DefaultCalendar,
    CalendarProps,
    dateInLimits,
} from '@alfalab/core-components-calendar';
import { Popover } from '@alfalab/core-components-popover';
import mergeRefs from 'react-merge-refs';
import {
    NATIVE_DATE_FORMAT,
    DATE_MASK,
    SUPPORTS_INPUT_TYPE_DATE,
    formatDate,
    parseDateString,
    isCompleteDateInput,
} from './utils';

import styles from './index.module.css';

export type CalendarInputProps = Omit<
    MaskedInputProps,
    'mask' | 'value' | 'onChange' | 'clear' | 'onClear' | 'rightAddons' | 'onBeforeDisplay'
> & {
    /**
     * Растягивает компонент на ширину контейнера
     */
    block?: boolean;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Дополнительный класс для инпута
     */
    inputClassName?: string;

    /**
     * Доп. пропсы для календаря
     */
    calendarProps?: CalendarProps;

    /**
     * Значение инпута (используется и для календаря)
     */
    value?: string;

    /**
     * Начальное значение инпута
     */
    defaultValue?: string;

    /**
     * Состояние открытия по умолчанию
     */
    defaultOpen?: boolean;

    /**
     * Месяц в календаре по умолчанию (timestamp)
     */
    defaultMonth?: number;

    /**
     * Минимальная дата, доступная для выбора (timestamp)
     */
    minDate?: number;

    /**
     * Максимальная дата, доступная для выбора (timestamp)
     */
    maxDate?: number;

    /**
     * Определяет, как рендерить календарь — в поповере или снизу инпута
     */
    calendarPosition?: 'static' | 'popover';

    /**
     * Запрещает поповеру менять свою позицию.
     * Например, если места снизу недостаточно,то он все равно будет показан снизу
     */
    preventFlip?: boolean;

    /**
     * Управление нативным режимом на мобильных устройствах
     */
    mobileMode?: 'native' | 'popover' | 'input';

    /**
     * Компонент календаря
     */
    Calendar?: ElementType<CalendarProps>;

    /**
     * Обработчик изменения значения
     */
    onChange?: (
        event: ChangeEvent<HTMLInputElement> | MouseEvent<HTMLButtonElement> | null,
        payload: { date: Date; value: string },
    ) => void;

    /**
     * Обработчик ввода в инпут
     */
    onInputChange?: (
        event: ChangeEvent<HTMLInputElement>,
        payload: { value: string; date: Date },
    ) => void;

    /**
     * Обработчик изменения календаря
     */
    onCalendarChange?: CalendarProps['onChange'];

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export const CalendarInput = forwardRef<HTMLInputElement, CalendarInputProps>(
    (
        {
            block = false,
            className,
            inputClassName,
            defaultOpen = false,
            defaultMonth,
            defaultValue = '',
            calendarPosition = 'popover',
            value,
            dataTestId,
            minDate,
            maxDate,
            calendarProps = {},
            preventFlip,
            mobileMode = 'popover',
            wrapperRef = null,
            disabled,
            onChange,
            onInputChange,
            onCalendarChange,
            readOnly,
            Calendar = DefaultCalendar,
            ...restProps
        },
        ref,
    ) => {
        const uncontrolled = value === undefined;
        const shouldRenderNative = SUPPORTS_INPUT_TYPE_DATE && mobileMode === 'native';
        const shouldRenderOnlyInput = mobileMode === 'input';
        const shouldRenderStatic = calendarPosition === 'static' && !shouldRenderOnlyInput;
        const shouldRenderPopover =
            calendarPosition === 'popover' && !shouldRenderNative && !shouldRenderOnlyInput;

        const [open, setOpen] = useState(false);

        const [stateValue, setStateValue] = useState(defaultValue);

        const inputValue = uncontrolled ? stateValue : value;
        const calendarValue = inputValue ? parseDateString(inputValue).getTime() : undefined;

        const isCalendarValueValid = dateInLimits(calendarValue, minDate, maxDate);

        const inputDisabled = disabled || readOnly;

        const inputRef = useRef<HTMLInputElement>(null);
        const inputWrapperRef = useRef<HTMLDivElement>(null);
        const componentRef = useRef<HTMLDivElement>(null);
        const calendarRef = useRef<HTMLDivElement>(null);

        const handleKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        }, []);

        const handleClick = useCallback(() => {
            if (!open) setOpen(true);
        }, [open]);

        const handleFocus = useCallback(
            (event: FocusEvent<HTMLDivElement>) => {
                setOpen(true);

                if (!open && event.target.tagName !== 'INPUT' && calendarRef.current) {
                    calendarRef.current.focus();
                }
            },
            [open],
        );

        const handleBlur = useCallback((event: FocusEvent<HTMLDivElement>) => {
            if (
                calendarRef.current &&
                calendarRef.current.contains(event.relatedTarget as HTMLElement) === false
            ) {
                setOpen(false);
            }
        }, []);

        const handleInputKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
            if (['ArrowDown', 'ArrowUp'].includes(event.key) && calendarRef.current) {
                event.preventDefault();
                calendarRef.current.focus();
            }
        }, []);

        const changeHandler = useCallback(
            (
                event: ChangeEvent<HTMLInputElement> | null,
                newValue: string,
                newDate: Date,
                initiator: 'input' | 'calendar' = 'input',
                shouldChange = true,
            ) => {
                if (initiator === 'input' && event && onInputChange) {
                    onInputChange(event, { value: newValue, date: newDate });
                }

                if (initiator === 'calendar' && onCalendarChange) {
                    onCalendarChange(newDate.getTime());
                }

                if (shouldChange) {
                    if (uncontrolled) {
                        setStateValue(newValue);
                    }

                    if (onChange) {
                        onChange(event, { date: newDate, value: newValue });
                    }
                }
            },
            [onCalendarChange, onChange, onInputChange, uncontrolled],
        );

        const handleInputChange = useCallback(
            (event: ChangeEvent<HTMLInputElement>) => {
                const newValue = event.target.value;
                const newDate = parseDateString(newValue);

                changeHandler(
                    event,
                    newValue,
                    newDate,
                    'input',
                    !newValue || isCompleteDateInput(newValue),
                );
            },
            [changeHandler],
        );

        const handleNativeInputChange = useCallback(
            (event: ChangeEvent<HTMLInputElement>) => {
                const newDate = parseDateString(event.target.value, NATIVE_DATE_FORMAT);
                const newValue = event.target.value === '' ? '' : formatDate(newDate);

                changeHandler(event, newValue, newDate);
            },
            [changeHandler],
        );

        const handleCalendarChange = useCallback(
            (date: number) => {
                changeHandler(null, formatDate(date), new Date(date), 'calendar');
                setOpen(false);
            },
            [changeHandler],
        );

        const handleCalendarWrapperMouseDown = useCallback((event: MouseEvent<HTMLDivElement>) => {
            // Не дает инпуту терять фокус при выборе даты
            event.preventDefault();
        }, []);

        useEffect(() => {
            setOpen(defaultOpen);
        }, [defaultOpen]);

        const renderCalendar = useCallback(
            () => (
                // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                <div onMouseDown={handleCalendarWrapperMouseDown}>
                    <Calendar
                        {...calendarProps}
                        ref={calendarRef}
                        defaultMonth={defaultMonth}
                        value={isCalendarValueValid ? calendarValue : undefined}
                        onChange={handleCalendarChange}
                        minDate={minDate}
                        maxDate={maxDate}
                    />
                </div>
            ),
            [
                calendarProps,
                calendarValue,
                defaultMonth,
                handleCalendarChange,
                handleCalendarWrapperMouseDown,
                isCalendarValueValid,
                maxDate,
                minDate,
            ],
        );

        return (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <div
                ref={componentRef}
                className={cn(styles.component, className, {
                    [styles.block]: block,
                })}
                tabIndex={-1}
                onKeyDown={inputDisabled ? undefined : handleKeyDown}
                onClick={inputDisabled ? undefined : handleClick}
                onFocus={inputDisabled ? undefined : handleFocus}
                onBlur={handleBlur}
                data-test-id={dataTestId}
            >
                <MaskedInput
                    {...restProps}
                    ref={mergeRefs([ref, inputRef])}
                    wrapperRef={mergeRefs([wrapperRef, inputWrapperRef])}
                    className={inputClassName}
                    value={inputValue}
                    defaultValue={defaultValue}
                    disabled={disabled}
                    readOnly={readOnly}
                    mask={DATE_MASK}
                    rightAddons={
                        <React.Fragment>
                            <span className={styles.calendarIcon} />
                            {shouldRenderNative && (
                                <input
                                    type='date'
                                    ref={mergeRefs([ref, inputRef])}
                                    defaultValue={defaultValue}
                                    onChange={handleNativeInputChange}
                                    className={styles.nativeInput}
                                />
                            )}
                        </React.Fragment>
                    }
                    onKeyDown={handleInputKeyDown}
                    onChange={handleInputChange}
                    block={true}
                    inputMode='numeric'
                    pattern='[0-9\.]*'
                />
                {shouldRenderStatic && renderCalendar()}

                {shouldRenderPopover && (
                    <Popover
                        open={open}
                        anchorElement={inputWrapperRef.current as HTMLElement}
                        popperClassName={styles.calendarContainer}
                        position='bottom-start'
                        offset={[0, 8]}
                        withTransition={false}
                        preventFlip={preventFlip}
                    >
                        {renderCalendar()}
                    </Popover>
                )}
            </div>
        );
    },
);
