import React, {
    forwardRef,
    ReactNode,
    RefObject,
    createRef,
    useState,
    FocusEventHandler,
} from 'react';
import cn from 'classnames';
import mergeRefs from 'react-merge-refs';

import { Input, InputProps } from './components';

import styles from './index.module.css';

export type CodeInputProps = {
    /**
     * Количество полей
     */
    fields?: number;

    /**
     * Значение для предзаполнения
     */
    initialValues?: string;

    /**
     * Заблокированное состояние
     */
    disabled?: boolean;

    /**
     * Состояние с ошибкой
     */
    error?: ReactNode;

    /**
     * Дополнительный класс (native prop)
     */
    className?: string;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;

    /**
     * Коллбек ввода значения
     */
    onChange?: (code: string) => void;

    /**
     * Коллбек полного заполнения
     */
    onComplete?: (code: string) => void;
};

export const CodeInput = forwardRef<HTMLInputElement, CodeInputProps>(
    (
        {
            className,
            disabled,
            error,
            fields = 4,
            initialValues = '',
            dataTestId,
            onChange,
            onComplete,
        },
        ref,
    ) => {
        const inputRefs = Array(fields)
            .fill({})
            .map(() => createRef<HTMLInputElement>());

        const [values, setValues] = useState(initialValues.split(''));

        const focusOnInput = (inputRef: RefObject<HTMLInputElement>) => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        };

        const triggerChange = (argumentValues: string[]) => {
            const newValue = (argumentValues || values).join('');

            if (onChange) {
                onChange(newValue);
            }

            if (onComplete && newValue.length >= fields) {
                onComplete(newValue);
            }
        };

        const handleChange: InputProps['onChange'] = (event, { index }) => {
            const {
                target: {
                    value,
                    validity: { valid },
                },
            } = event;

            const newValue = value.replace(/\D/g, '');

            if (newValue === '' || !valid) {
                return;
            }

            let nextRef;

            const newValues = [...values];

            if (newValue.length > 1) {
                let nextIndex = newValue.length + index - 1;

                if (nextIndex >= fields) {
                    nextIndex = fields - 1;
                }

                nextRef = inputRefs[nextIndex];

                newValue.split('').forEach((item, i) => {
                    const cursor = index + i;

                    if (cursor < fields) {
                        newValues[cursor] = item;
                    }
                });
            } else {
                nextRef = inputRefs[index + 1];

                newValues[index] = newValue;
            }

            setValues(newValues);

            if (nextRef && nextRef.current) {
                nextRef.current.focus();

                nextRef.current.select();
            }

            triggerChange(newValues);
        };

        const handleKeyDown: InputProps['onKeyDown'] = (event, { index }) => {
            const prevIndex = index - 1;
            const nextIndex = index + 1;

            const prevRef = inputRefs[prevIndex];
            const nextRef = inputRefs[nextIndex];

            const newValues = [...values];

            switch (event.key) {
                case 'Backspace':
                    event.preventDefault();

                    if (values[index]) {
                        newValues[index] = '';
                    } else if (prevRef) {
                        newValues[prevIndex] = '';

                        focusOnInput(prevRef);
                    }

                    setValues(newValues);

                    triggerChange(newValues);

                    break;
                case 'ArrowLeft':
                    event.preventDefault();

                    if (prevRef) {
                        focusOnInput(prevRef);
                    }

                    break;
                case 'ArrowRight':
                    event.preventDefault();

                    if (nextRef) {
                        focusOnInput(nextRef);
                    }

                    break;
                case 'ArrowUp':
                case 'ArrowDown':
                    event.preventDefault();
                    break;
                default:
                    break;
            }
        };

        const handleFocus: FocusEventHandler<HTMLInputElement> = event => {
            /**
             * В сафари выделение работает только с setTimeout
             */
            setTimeout(() => {
                event.target.select();
            }, 0);
        };

        return (
            <div
                className={cn(styles.component, className, {
                    [styles.compact]: fields > 6,
                })}
                data-test-id={dataTestId}
            >
                <div className={cn({ [styles.shake]: Boolean(error) })}>
                    {new Array(fields).fill('').map((_, index) => (
                        <Input
                            ref={
                                index === 0 ? mergeRefs([inputRefs[index], ref]) : inputRefs[index]
                            }
                            key={index.toString()}
                            index={index}
                            value={values[index]}
                            disabled={disabled}
                            error={!!error}
                            onChange={handleChange}
                            onFocus={handleFocus}
                            onKeyDown={handleKeyDown}
                            className={styles.input}
                        />
                    ))}
                </div>

                {error && (
                    <div className={styles.error} role='alert'>
                        {error}
                    </div>
                )}
            </div>
        );
    },
);
