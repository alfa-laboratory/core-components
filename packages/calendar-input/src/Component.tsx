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

import styles from './index.module.css';

export type CalendarInputProps = Omit<
    MaskedInputProps,
    'value' | 'onChange' | 'clear' | 'onClear'
> & {
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

const DATE_FORMAT = 'dd.MM.yyyy';

const dateMask = [/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/];

export const parseDateString = (value: string) => parse(value, DATE_FORMAT, new Date());

export const CalendarInput = forwardRef<HTMLInputElement, CalendarInputProps>(
    (
        {
            className,
            inputClassName,
            defaultOpen = false,
            defaultMonth,
            defaultValue = '',
            value,
            dataTestId,
            calendarProps = {},
            onChange,
            onInputChange,
            onCalendarChange,
            ...restProps
        },
        ref,
    ) => {
        const uncontrolled = value === undefined;

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

                if (!open && event.target.tagName !== 'INPUT') {
                    if (calendarRef.current) {
                        calendarRef.current.focus();
                    }
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
            if (event.key === 'ArrowDown' && calendarRef.current) {
                calendarRef.current.focus();
            }
        }, []);

        const handleInputChange = useCallback(
            (event: ChangeEvent<HTMLInputElement>) => {
                const newValue = event.target.value;

                if (uncontrolled) {
                    setStateValue(newValue);
                }

                if (onInputChange) {
                    onInputChange(event, { value: newValue });
                }

                if (newValue.length === dateMask.length && onChange) {
                    onChange(event, { date: parseDateString(newValue), value: newValue });
                }
            },
            [onChange, onInputChange, uncontrolled],
        );

        const handleCalendarChange = useCallback(
            (date: number) => {
                const newValue = format(date, DATE_FORMAT);

                if (uncontrolled) {
                    setStateValue(newValue);
                }

                if (onCalendarChange) {
                    onCalendarChange(date);
                }

                if (onChange) {
                    onChange(null, {
                        date: new Date(date),
                        value: newValue,
                    });
                }

                if (calendarRef.current) {
                    calendarRef.current.focus();
                    calendarRef.current.blur();
                }
            },
            [onCalendarChange, onChange, uncontrolled],
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
                className={cn(styles.component, className)}
                data-test-id={dataTestId}
                tabIndex={-1}
                onKeyDown={handleKeyDown}
                onClick={handleClick}
                onFocus={handleFocus}
                onBlur={handleBlur}
                ref={componentRef}
            >
                <MaskedInput
                    {...restProps}
                    className={inputClassName}
                    ref={mergeRefs([ref, inputRef])}
                    wrapperRef={inputWrapperRef}
                    value={inputValue}
                    defaultValue={defaultValue}
                    mask={dateMask}
                    rightAddons={<span className={styles.searchIcon} />}
                    onKeyDown={handleInputKeyDown}
                    onChange={handleInputChange}
                    block={true}
                    inputMode='numeric'
                    pattern='[0-9]*'
                />
                <Popover
                    open={open}
                    anchorElement={inputWrapperRef.current as HTMLElement}
                    getPortalContainer={() => componentRef.current as HTMLElement}
                    position='bottom-start'
                    withTransition={false}
                    popperClassName={styles.calendarContainer}
                    offset={[0, 14]}
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
            </div>
        );
    },
);
