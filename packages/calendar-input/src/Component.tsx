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
import mergeRefs from 'react-merge-refs';
import { Popover, PopoverProps } from '@alfalab/core-components-popover';
import { CalendarMIcon } from '@alfalab/icons-glyph/CalendarMIcon';
import {
    DateInput,
    DateInputProps,
    formatDate,
    parseDateString,
    isCompleteDateInput,
} from '@alfalab/core-components-date-input';

import {
    Calendar as DefaultCalendar,
    CalendarProps,
    dateInLimits,
} from '@alfalab/core-components-calendar';

import { SUPPORTS_INPUT_TYPE_DATE } from './utils';

import styles from './index.module.css';
import { SUPPORTS_INPUT_TYPE_DATE } from './utils';

export type CalendarInputProps = Omit<DateInputProps, 'onChange' | 'mobileMode'> & {
    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Дополнительный класс для инпута
     */
    inputClassName?: string;

    /**
     * Дополнительный класс для поповера
     */
    popoverClassName?: string;

    /**
     * Доп. пропсы для календаря
     */
    calendarProps?: CalendarProps & Record<string, unknown>;

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
     * Список событий
     */
    events?: Array<Date | number>;

    /**
     * Список выходных
     */
    offDays?: Array<Date | number>;

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
     * Позиционирование поповера с календарем
     */
    popoverPosition?: PopoverProps['position'];

    /**
     * z-index Popover
     */
    zIndexPopover?: PopoverProps['zIndex'];

    /**
     * Календарь будет принимать ширину инпута
     */
    useAnchorWidth?: boolean;
};

export const CalendarInput = forwardRef<HTMLInputElement, CalendarInputProps>(
    (
        {
            block = false,
            className,
            inputClassName,
            popoverClassName,
            defaultOpen = false,
            defaultMonth,
            defaultValue = '',
            calendarPosition = 'popover',
            value,
            dataTestId,
            calendarProps = {},
            minDate = calendarProps.minDate,
            maxDate = calendarProps.maxDate,
            offDays = calendarProps.offDays || [],
            events = calendarProps.events || [],
            preventFlip,
            mobileMode = 'popover',
            wrapperRef = null,
            disabled,
            onChange = () => null,
            onInputChange,
            onCalendarChange,
            onKeyDown,
            readOnly,
            Calendar = DefaultCalendar,
            popoverPosition = 'bottom-start',
            zIndexPopover,
            useAnchorWidth,
            rightAddons,
            error,
            ...restProps
        },
        ref,
    ) => {
        const shouldRenderNative = SUPPORTS_INPUT_TYPE_DATE && mobileMode === 'native';
        const shouldRenderOnlyInput = mobileMode === 'input';
        const shouldRenderStatic = calendarPosition === 'static' && !shouldRenderOnlyInput;
        const shouldRenderPopover =
            calendarPosition === 'popover' && !shouldRenderNative && !shouldRenderOnlyInput;

        const [open, setOpen] = useState(false);

        const [inputValue, setInputValue] = useState(value || defaultValue);

        const calendarValue = inputValue ? parseDateString(inputValue).getTime() : undefined;

        const checkInputValueIsValid = useCallback(
            (newInputValue?: string) => {
                if (!newInputValue || error) return false;

                const dateValue = parseDateString(newInputValue).getTime();

                return (
                    dateValue &&
                    isCompleteDateInput(newInputValue) &&
                    dateInLimits(dateValue, minDate, maxDate) &&
                    !offDays.includes(dateValue)
                );
            },
            [error, maxDate, minDate, offDays],
        );

        const inputDisabled = disabled || readOnly;

        const inputWrapperRef = useRef<HTMLDivElement>(null);
        const calendarRef = useRef<HTMLDivElement>(null);

        const handleKeyDown = useCallback(
            (event: KeyboardEvent<HTMLDivElement>) => {
                if ((event.target as HTMLElement).tagName === 'INPUT' && event.key === 'Enter') {
                    setOpen(!open);
                }

                if (event.key === 'Escape') {
                    setOpen(false);
                }
            },
            [open],
        );

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
            const target = (event.relatedTarget || document.activeElement) as HTMLElement;

            if (calendarRef.current && calendarRef.current.contains(target) === false) {
                setOpen(false);
            }
        }, []);

        const handleInputKeyDown = useCallback(
            (event: KeyboardEvent<HTMLInputElement>) => {
                if (['ArrowDown', 'ArrowUp'].includes(event.key) && calendarRef.current) {
                    event.preventDefault();
                    calendarRef.current.focus();
                }

                if (onKeyDown) onKeyDown(event);
            },
            [onKeyDown],
        );

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

                setInputValue(newValue);

                if (shouldChange) {
                    onChange(event, { date: newDate, value: newValue });
                }
            },
            [onCalendarChange, onChange, onInputChange],
        );

        const handleInputChange = useCallback<Required<DateInputProps>['onChange']>(
            (event, payload) => {
                changeHandler(
                    event,
                    payload.value,
                    payload.date,
                    'input',
                    !payload.value || checkInputValueIsValid(payload.value),
                );
            },
            [changeHandler, checkInputValueIsValid],
        );

        const handleCalendarChange = useCallback<Required<CalendarProps>['onChange']>(
            date => {
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

        useEffect(() => {
            if (typeof value !== 'undefined') {
                setInputValue(value);
            }
        }, [value]);

        const renderCalendar = useCallback(
            () => (
                // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                <div onMouseDown={handleCalendarWrapperMouseDown}>
                    <Calendar
                        {...calendarProps}
                        ref={calendarRef}
                        defaultMonth={defaultMonth}
                        value={checkInputValueIsValid(inputValue) ? calendarValue : undefined}
                        onChange={handleCalendarChange}
                        minDate={minDate}
                        maxDate={maxDate}
                        offDays={offDays}
                        events={events}
                    />
                </div>
            ),
            [
                calendarProps,
                calendarValue,
                checkInputValueIsValid,
                defaultMonth,
                events,
                handleCalendarChange,
                handleCalendarWrapperMouseDown,
                inputValue,
                maxDate,
                minDate,
                offDays,
            ],
        );

        return (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <div
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
                <DateInput
                    {...restProps}
                    ref={ref}
                    wrapperRef={mergeRefs([wrapperRef, inputWrapperRef])}
                    value={inputValue}
                    defaultValue={defaultValue}
                    disabled={disabled}
                    readOnly={readOnly}
                    mobileMode={mobileMode === 'native' ? 'native' : 'input'}
                    error={error}
                    rightAddons={
                        <React.Fragment>
                            {rightAddons}
                            {shouldRenderPopover && (
                                <CalendarMIcon className={styles.calendarIcon} />
                            )}
                        </React.Fragment>
                    }
                    onKeyDown={handleInputKeyDown}
                    onChange={handleInputChange}
                    block={true}
                />
                {shouldRenderStatic && renderCalendar()}

                {shouldRenderPopover && (
                    <Popover
                        open={open}
                        useAnchorWidth={useAnchorWidth}
                        anchorElement={inputWrapperRef.current as HTMLElement}
                        popperClassName={styles.calendarContainer}
                        className={popoverClassName}
                        position={popoverPosition}
                        offset={[0, 8]}
                        withTransition={false}
                        preventFlip={preventFlip}
                        zIndex={zIndexPopover}
                    >
                        {renderCalendar()}
                    </Popover>
                )}
            </div>
        );
    },
);
