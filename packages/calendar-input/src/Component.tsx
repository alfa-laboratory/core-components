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
} from 'react';
import cn from 'classnames';
import { MaskedInput, MaskedInputProps } from '@alfalab/core-components-masked-input';
import { Calendar, CalendarProps } from '@alfalab/core-components-calendar';
import { Popover } from '@alfalab/core-components-popover';
import { parse, format } from 'date-fns';
import mergeRefs from 'react-merge-refs';
import { isInputDateSupported } from './utils';

import styles from './index.module.css';

const DATE_FORMAT = 'dd.MM.yyyy';
const NATIVE_DATE_FORMAT = 'yyyy-MM-dd';
const DATE_MASK = [/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/];
const IS_BROWSER = typeof window !== 'undefined';
const SUPPORTS_INPUT_TYPE_DATE = IS_BROWSER && isInputDateSupported();

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
     * Месяц в календаре по умолчанию
     */
    defaultMonth?: number;

    /**
     * Запрещает поповеру менять свою позицию.
     * Например, если места снизу недостаточно,то он все равно будет показан снизу
     */
    preventFlip?: boolean;

    /**
     * Управление нативным режимом на мобильных устройствах
     */
    mobileMode?: 'native' | 'input';

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
    onInputChange?: MaskedInputProps['onChange'];

    /**
     * Обработчик изменения календаря
     */
    onCalendarChange?: CalendarProps['onChange'];

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export const parseDateString = (value: string, dateFormat = DATE_FORMAT) =>
    parse(value, dateFormat, new Date());

export const CalendarInput = forwardRef<HTMLInputElement, CalendarInputProps>(
    (
        {
            block = false,
            className,
            inputClassName,
            defaultOpen = false,
            defaultMonth,
            defaultValue = '',
            value,
            dataTestId,
            calendarProps = {},
            preventFlip,
            mobileMode,
            wrapperRef = null,
            onChange,
            onInputChange,
            onCalendarChange,
            ...restProps
        },
        ref,
    ) => {
        const uncontrolled = value === undefined;
        const shouldRenderNative = SUPPORTS_INPUT_TYPE_DATE && mobileMode === 'native';

        const [open, setOpen] = useState(false);

        const [stateValue, setStateValue] = useState(defaultValue);

        const inputValue = uncontrolled ? stateValue : value;

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
                componentRef.current &&
                componentRef.current.contains(event.relatedTarget as HTMLElement) === false
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
                shouldCallOnChange = true,
            ) => {
                if (uncontrolled) {
                    setStateValue(newValue);
                }

                if (initiator === 'input' && event && onInputChange) {
                    onInputChange(event, { value: newValue });
                }

                if (initiator === 'calendar' && onCalendarChange) {
                    onCalendarChange(newDate.getTime());
                }

                if (onChange && shouldCallOnChange) {
                    onChange(event, { date: newDate, value: newValue });
                }
            },
            [onCalendarChange, onChange, onInputChange, uncontrolled],
        );

        const handleInputChange = useCallback(
            (event: ChangeEvent<HTMLInputElement>) => {
                const newValue = event.target.value;

                changeHandler(
                    event,
                    newValue,
                    parseDateString(newValue),
                    'input',
                    newValue.length === DATE_MASK.length,
                );
            },
            [changeHandler],
        );

        const handleNativeInputChange = useCallback(
            (event: ChangeEvent<HTMLInputElement>) => {
                const newDate = parseDateString(event.target.value, NATIVE_DATE_FORMAT);
                const newValue = event.target.value === '' ? '' : format(newDate, DATE_FORMAT);

                changeHandler(event, newValue, newDate);
            },
            [changeHandler],
        );

        const handleCalendarChange = useCallback(
            (date: number) => {
                changeHandler(null, format(date, DATE_FORMAT), new Date(date), 'calendar');

                if (calendarRef.current) {
                    calendarRef.current.focus();
                    calendarRef.current.blur();
                }
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

        return (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <div
                ref={componentRef}
                className={cn(styles.component, className, {
                    [styles.block]: block,
                })}
                tabIndex={-1}
                onKeyDown={handleKeyDown}
                onClick={handleClick}
                onFocus={handleFocus}
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
                    pattern='[0-9]*'
                />
                {!shouldRenderNative && (
                    <Popover
                        open={open}
                        anchorElement={inputWrapperRef.current as HTMLElement}
                        popperClassName={styles.calendarContainer}
                        position='bottom-start'
                        offset={[0, 14]}
                        withTransition={false}
                        preventFlip={preventFlip}
                    >
                        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                        <div onMouseDown={handleCalendarWrapperMouseDown}>
                            <Calendar
                                {...calendarProps}
                                ref={calendarRef}
                                defaultMonth={defaultMonth}
                                value={inputValue ? +parseDateString(inputValue) : undefined}
                                onChange={handleCalendarChange}
                            />
                        </div>
                    </Popover>
                )}
            </div>
        );
    },
);
