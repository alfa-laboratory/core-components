import React, {
    forwardRef,
    useRef,
    InputHTMLAttributes,
    useCallback,
    ChangeEvent,
    ReactNode,
} from 'react';
import cn from 'classnames';
import mergeRefs from 'react-merge-refs';
import { useFocus } from '@alfalab/hooks';

import styles from './index.module.css';

type NativeProps = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'min' | 'max' | 'step' | 'value' | 'type' | 'onChange'
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
     * Слот для возможности рендера шагов
     */
    steps?: ReactNode;

    /**
     * Значение инпута
     */
    value?: number;

    /**
     * Обработчик поля ввода
     */
    onChange?: (event: ChangeEvent<HTMLInputElement>, payload: { value: number }) => void;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
    (
        {
            min = 0,
            max = 100,
            step = 1,
            value = 0,
            steps,
            className,
            onChange,
            dataTestId,
            ...restProps
        },
        ref,
    ) => {
        const inputRef = useRef<HTMLInputElement>(null);

        const [focused] = useFocus(inputRef, 'keyboard');

        const range = max - min;
        const dividedWithoutRemainder = range % step === 0;
        const validValue = Math.max(min, Math.min(value, max));

        const rangeProps = {
            className: cn(styles.range, { [styles.focused]: focused }),
            type: 'range',
            min,
            max,
            value: validValue,
            step: dividedWithoutRemainder ? step : undefined,
        };

        const progressProps = {
            className: styles.progress,
            max: range,
            value: validValue - min,
        };

        const handleInputChange = useCallback(
            (event: ChangeEvent<HTMLInputElement>) => {
                if (onChange) {
                    onChange(event, { value: +event.target.value });
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
                    {steps}
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
