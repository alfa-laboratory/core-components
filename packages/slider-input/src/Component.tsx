import React, { forwardRef, useCallback, ChangeEvent, FC, ReactNode, Fragment } from 'react';
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
    sliderValue?: number | string;

    /**
     * Дополнительная информация в правой части поля
     */
    info?: ReactNode;

    /**
     * Компонент поля ввода
     */
    Input?: FC<InputProps>;

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
     * Обработчик изменения значения через слайдер или поле ввода
     */
    onChange?: (event: ChangeEvent<HTMLInputElement>, payload: { value: string }) => void;

    /**
     * Обработчик ввода
     */
    onInputChange?: (event: ChangeEvent<HTMLInputElement>, payload: { value: string }) => void;

    /**
     * Обработчик изменения слайдера
     */
    onSliderChange?: (event: ChangeEvent<HTMLInputElement>, payload: { value: string }) => void;

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
            value = '',
            min = 0,
            max = 100,
            step = 1,
            block,
            sliderValue = value,
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
        const handleSliderChange = useCallback(
            (event: ChangeEvent<HTMLInputElement>) => {
                const payload = { value: event.target.value };
                if (onChange) onChange(event, payload);
                if (onSliderChange) onSliderChange(event, payload);
            },
            [onChange, onSliderChange],
        );

        const handleInputChange = useCallback(
            (event: ChangeEvent<HTMLInputElement>, payload) => {
                if (onChange) onChange(event, payload);
                if (onInputChange) onInputChange(event, payload);
            },
            [onChange, onInputChange],
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
                    className={inputClassName}
                    focusedClassName={styles.focused}
                    bottomAddons={
                        <Slider
                            min={min}
                            max={max}
                            step={step}
                            onChange={handleSliderChange}
                            ref={ref}
                            value={Number.isNaN(+sliderValue) ? undefined : sliderValue}
                            disabled={disabled}
                            className={cn(styles.slider, sliderClassName)}
                        />
                    }
                    rightAddons={
                        (info || rightAddons) && (
                            <Fragment>
                                {info && <span className={styles.info}>{info}</span>}
                                {rightAddons}
                            </Fragment>
                        )
                    }
                />

                {steps.length > 0 && (
                    <div className={styles.steps}>
                        {steps.map((stepLabel, i) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <span key={i}>{stepLabel}</span>
                        ))}
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
