import React, {
    forwardRef,
    KeyboardEvent,
    ChangeEvent,
    useRef,
    useImperativeHandle,
    useEffect,
    useCallback,
} from 'react';
import cn from 'classnames';

import { usePrevious } from '@alfalab/hooks';

import styles from './index.module.css';

type CodeInputProps = {
    processing: boolean;
    value: string;
    slotsCount: number;
    error?: string;
    className?: string;
    handleChange: (code: string) => void;
    handleInputKeyDown: (event: KeyboardEvent) => void;
};

export const CodeInput = forwardRef<HTMLInputElement, CodeInputProps>(
    (
        { processing, value = '', slotsCount, error, handleInputKeyDown, handleChange, className },
        ref,
    ) => {
        const splittedValue = value.split('');

        const inputs = useRef<HTMLInputElement[]>([]);

        useImperativeHandle(ref, () => inputs.current[0]);

        const prevValue = usePrevious(value) || '';

        const updateValue = ({
            newValues,
            actionType,
            index,
        }: {
            newValues: string[];
            actionType: 'add' | 'delete';
            index: number;
        }) => {
            handleChange(newValues.join(''));

            if (actionType === 'add' && index !== slotsCount - 1) {
                inputs.current[index + 1].focus();
            } else if (index !== 0) {
                inputs.current[index - 1].focus();
            }
        };

        const renderInput = (_, index: number) => {
            const onChange = (event: ChangeEvent<HTMLInputElement>) => {
                const { value: targetValue } = event.target;

                const newValues = [...splittedValue];

                if (/^\d$/.test(targetValue)) {
                    /*
                     * если введена цифра, то обновляем значение
                     * и устанавливаем фокус на следующем инпуте
                     */

                    newValues[index] = event.target.value;

                    updateValue({ newValues, actionType: 'add', index });
                } else if (/^\d\d$/.test(targetValue) && index !== slotsCount - 1) {
                    /*
                     * если пользователь хочет ввести вторую цифру в инпут,
                     * то переносим ее в следующий инпут
                     */

                    // eslint-disable-next-line prefer-destructuring
                    newValues[index] = event.target.value[0];
                    // eslint-disable-next-line prefer-destructuring
                    newValues[index + 1] = event.target.value[1];

                    updateValue({ newValues, actionType: 'add', index });
                }
            };

            const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
                const { key } = event;

                /*
                 * если пользователь хочет удалить цифру в инпуте,
                 * то удаляем ее и устанавливаем фокус на предыдущем инпуте
                 */
                if (key === 'Backspace' || key === 'Delete') {
                    const newValues = [...splittedValue];

                    newValues[index] = '';

                    updateValue({ newValues, actionType: 'delete', index });
                } else if (key === 'ArrowRight' && index !== slotsCount - 1) {
                    inputs.current[index + 1].focus();
                } else if (key === 'ArrowLeft' && index !== 0) {
                    inputs.current[index - 1].focus();
                }

                handleInputKeyDown(event);
            };

            const setRef = (node: HTMLInputElement) => {
                inputs.current[index] = node;
            };

            return (
                <input
                    className={cn(styles.input, { [styles.hasError]: Boolean(error) })}
                    disabled={processing}
                    value={splittedValue[index] || ''}
                    onChange={onChange}
                    onKeyDown={onInputKeyDown}
                    ref={setRef}
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                />
            );
        };

        const focus = useCallback((index: number) => {
            const input = inputs.current[index];

            if (input) {
                input.focus();
                input.setSelectionRange(1, 1);
            }
        }, []);

        /**
         * Устанавливаем фокус на инпуте:
         * 1) если код введен неверно
         * 2) по нажатию кнопки 'Запросить код'
         */
        useEffect(() => {
            const inputIndex = value.length === slotsCount ? value.length - 1 : value.length;

            const needFocus = !processing || error;

            if (needFocus && value.length === prevValue.length) {
                focus(inputIndex);
            }
        }, [focus, error, slotsCount, value.length, prevValue.length, processing]);

        return (
            <div className={cn(styles.component, className)}>
                {new Array(slotsCount).fill('').map(renderInput)}
            </div>
        );
    },
);
