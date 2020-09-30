import React, { forwardRef, useCallback, ChangeEvent, FC, ReactNode, MouseEvent } from 'react';
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
            disabled,
            onInputChange,
            onSliderChange = onInputChange,
            Input = DefaultInput,
            customInputProps = {},
            dataTestId,
            ...restProps
        },
        ref,
    ) => {
        const handleSliderChange = useCallback(
            (event: ChangeEvent<HTMLInputElement>) => {
                if (onSliderChange) {
                    onSliderChange(event, { value: event.target.value });
                }
            },
            [onSliderChange],
        );

        const handleInputChange = useCallback(
            (event: ChangeEvent<HTMLInputElement>, payload) => {
                if (onInputChange) {
                    onInputChange(event, payload);
                }
            },
            [onInputChange],
        );

        const handleSliderMouseDown = useCallback((event: MouseEvent<HTMLInputElement>) => {
            event.stopPropagation();
        }, []);

        return (
            <div
                className={cn(
                    styles.component,
                    {
                        [styles.block]: block,
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
                    disabled={disabled}
                    className={inputClassName}
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
                            onMouseDown={handleSliderMouseDown}
                        />
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
