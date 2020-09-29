import React, { forwardRef, useRef, InputHTMLAttributes, useCallback, ChangeEvent } from 'react';
import cn from 'classnames';
import mergeRefs from 'react-merge-refs';
import { useFocus } from '@alfalab/hooks';

import styles from './index.module.css';

type NativeProps = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'min' | 'max' | 'step' | 'value' | 'type'
>;

export type SliderProps = NativeProps & {
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
     * Значение инпута
     */
    value?: number | string;

    /**
     * Обработчик поля ввода
     */
    onChange?: (event: ChangeEvent<HTMLInputElement>, payload: { value: string }) => void;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
    (
        { min = 0, max = 100, step = 1, value = 0, className, onChange, dataTestId, ...restProps },
        ref,
    ) => {
        const inputRef = useRef<HTMLInputElement>(null);

        const [focused] = useFocus(inputRef, 'keyboard');

        const dividedWithoutRemainder = (max - min) % step === 0;

        const rangeProps = {
            className: cn(styles.range, { [styles.focused]: focused }),
            type: 'range',
            min,
            max,
            value: Math.max(min, Math.min(+value, max)),
            step: dividedWithoutRemainder ? step : undefined,
        };

        const progressProps = {
            className: styles.progress,
            max: max - min,
            value: +value - min,
        };

        const handleInputChange = useCallback(
            (event: ChangeEvent<HTMLInputElement>) => {
                if (onChange) {
                    onChange(event, { value: event.target.value });
                }
            },
            [onChange],
        );

        return (
            <div className={cn(styles.component, className)} data-test-id={dataTestId}>
                <div className={styles.rangeWrapper}>
                    <input
                        {...rangeProps}
                        {...restProps}
                        ref={mergeRefs([ref, inputRef])}
                        onChange={handleInputChange}
                    />
                </div>
                <progress {...progressProps} />
            </div>
        );
    },
);

/**
 * Для отображения в сторибуке
 */
Slider.defaultProps = {
    min: 0,
    max: 100,
    step: 1,
    value: 0,
};
