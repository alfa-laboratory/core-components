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
        const inputRefs: Array<RefObject<HTMLInputElement>> = Array(fields)
            .fill({})
            .map(() => createRef());

        const [values, setValues] = useState<string[]>(initialValues.split(''));

        const focusOnInputRef = (inputRef: RefObject<HTMLInputElement>) => {
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
            if (!fields) return;

            const {
                target: { value: newValue },
            } = event;

            let nextRef;

            const newArrayOfValues: string[] = Object.assign([], values);

            if (newValue.length > 1) {
                let nextIndex = newValue.length + index - 1;

                if (nextIndex >= fields) {
                    nextIndex = fields - 1;
                }

                nextRef = inputRefs[nextIndex];

                newValue.split('').forEach((item, i) => {
                    const cursor = index + i;

                    if (cursor < fields) {
                        newArrayOfValues[cursor] = item;
                    }
                });
            } else {
                nextRef = inputRefs[index + 1];

                newArrayOfValues[index] = newValue;
            }

            setValues(newArrayOfValues);

            if (nextRef && nextRef.current) {
                nextRef.current.focus();

                nextRef.current.select();
            }

            triggerChange(newArrayOfValues);
        };

        const handleKeyDown: InputProps['onKeyDown'] = (event, { index }) => {
            const prevIndex = index - 1;
            const nextIndex = index + 1;

            const prevRef = inputRefs[prevIndex];
            const nextRef = inputRefs[nextIndex];

            const vals = Array.from(values);

            switch (event.key) {
                case 'Backspace':
                    event.preventDefault();

                    if (values[index]) {
                        vals[index] = '';
                    } else if (prevRef) {
                        vals[prevIndex] = '';

                        focusOnInputRef(prevRef);
                    }

                    setValues(vals);

                    triggerChange(vals);

                    break;
                case 'ArrowLeft':
                    event.preventDefault();

                    if (prevRef) {
                        focusOnInputRef(prevRef);
                    }

                    break;
                case 'ArrowRight':
                    event.preventDefault();

                    if (nextRef) {
                        focusOnInputRef(nextRef);
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
            event.target.select();
        };

        return (
            <div
                className={cn(styles.component, className, {
                    [styles.shake]: Boolean(error),
                    [styles.compact]: fields > 6,
                })}
                data-test-id={dataTestId}
            >
                <div>
                    {new Array(fields).fill('').map((_, index) => (
                        <Input
                            key={index.toString()}
                            index={index}
                            value={values[index]}
                            disabled={disabled}
                            error={!!error}
                            ref={
                                index === 0 ? mergeRefs([inputRefs[index], ref]) : inputRefs[index]
                            }
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
