import React, {
    forwardRef,
    useCallback,
    ChangeEvent,
    FC,
    Fragment,
    ReactNode,
    isValidElement,
    cloneElement,
} from 'react';
import cn from 'classnames';
import { Slider } from '@alfalab/core-components-slider';
import { Input as DefaultInput, InputProps } from '@alfalab/core-components-input';

import styles from './index.module.css';

export type SliderInputProps = Omit<
    InputProps,
    'min' | 'max' | 'step' | 'value' | 'type' | 'onChange' | 'bottomAddons'
> & {
    /**
     * Мин. допустимое число
     */
    min?: number;

    /**
     * Макс. допустимое число
     */
    max?: number;

    /**
     * Шаг (должен нацело делить отрезок между мин и макс)
     */
    step?: number;

    /**
     * Массив подписей к слайдеру
     */
    steps?: ReactNode[];

    /**
     * Значение инпута
     */
    value?: number | string;

    /**
     * Значение слайдера
     */
    sliderValue?: number;

    /**
     * Дополнительная информация в правой части поля
     */
    info?: ReactNode;

    /**
     * Компонент поля ввода
     */
    Input?: FC<Omit<InputProps, 'onChange' | 'value'>>;

    /**
     * Кастомные пропсы для поля ввода
     */
    customInputProps?: Record<string, unknown>;

    /**
     * Класс для инпута
     */
    inputClassName?: string;

    /**
     * Класс для слайдера
     */
    sliderClassName?: string;

    /**
     * Класс для шагов
     */
    stepsClassName?: string;

    /**
     * Обработчик изменения значения через слайдер или поле ввода
     */
    onChange?: (event: ChangeEvent<HTMLInputElement>, payload: { value: number | '' }) => void;

    /**
     * Обработчик ввода
     */
    onInputChange?: (event: ChangeEvent<HTMLInputElement>, payload: { value: number | '' }) => void;

    /**
     * Обработчик изменения слайдера
     */
    onSliderChange?: (event: ChangeEvent<HTMLInputElement>, payload: { value: number }) => void;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export const SliderInput = forwardRef<HTMLInputElement, SliderInputProps>(
    (
        {
            className,
            inputClassName,
            sliderClassName,
            stepsClassName,
            value = '',
            min = 0,
            max = 100,
            step = 1,
            block,
            sliderValue = +value,
            steps = [],
            size = 's',
            label,
            info,
            disabled,
            onChange,
            onInputChange,
            onSliderChange,
            rightAddons,
            Input = DefaultInput,
            customInputProps = {},
            dataTestId,
            ...restProps
        },
        ref,
    ) => {
        const getValidInputValue = useCallback((inputValue: string) => {
            const number = parseInt(inputValue, 10);
            return inputValue === '' || Number.isNaN(number) ? '' : Math.abs(number);
        }, []);

        const handleSliderChange = useCallback(
            (event: ChangeEvent<HTMLInputElement>, payload) => {
                if (onChange) onChange(event, payload);
                if (onSliderChange) onSliderChange(event, payload);
            },
            [onChange, onSliderChange],
        );

        const handleInputChange = useCallback(
            (event: ChangeEvent<HTMLInputElement>, payload) => {
                if (onChange) onChange(event, { value: getValidInputValue(payload.value) });
                if (onInputChange)
                    onInputChange(event, { value: getValidInputValue(payload.value) });
            },
            [getValidInputValue, onChange, onInputChange],
        );

        return (
            <div
                className={cn(
                    styles.component,
                    {
                        [styles.block]: block,
                        [styles.filled]: Boolean(value),
                        [styles.hasLabel]: label,
                    },
                    styles[size],
                    className,
                )}
                data-test-id={dataTestId}
            >
                <Input
                    {...restProps}
                    {...customInputProps}
                    ref={ref}
                    value={value.toString()}
                    onChange={handleInputChange}
                    block={true}
                    size={size}
                    label={label}
                    disabled={disabled}
                    className={cn(inputClassName, styles.input)}
                    focusedClassName={cn(styles.focused)}
                    bottomAddons={
                        <Slider
                            min={min}
                            max={max}
                            step={step}
                            onChange={handleSliderChange}
                            ref={ref}
                            value={Number.isNaN(sliderValue) ? 0 : sliderValue}
                            disabled={disabled}
                            className={cn(styles.slider, sliderClassName)}
                        />
                    }
                    rightAddons={
                        (info || rightAddons) && (
                            <Fragment>
                                {info && <span className={cn(styles.info)}>{info}</span>}
                                {rightAddons}
                            </Fragment>
                        )
                    }
                />

                {steps.length > 0 && (
                    <div className={cn(styles.steps, stepsClassName)}>
                        {steps.map((stepLabel, i) =>
                            isValidElement(stepLabel) ? (
                                cloneElement(stepLabel, { key: i })
                            ) : (
                                // eslint-disable-next-line react/no-array-index-key
                                <span key={i}>{stepLabel}</span>
                            ),
                        )}
                    </div>
                )}
            </div>
        );
    },
);

/**
 * Для отображения в сторибуке
 */
SliderInput.defaultProps = {
    value: '',
    min: 0,
    max: 100,
    step: 1,
    steps: [],
    size: 's',
    Input: DefaultInput,
    customInputProps: {},
};
