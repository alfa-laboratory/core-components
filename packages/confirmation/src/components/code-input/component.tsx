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

type SetInputRef = (params: { node: HTMLInputElement; index: number }) => void;

type InputProps = {
    index: number;
    value: string;
    slotsCount: number;
    error?: string;
    processing: boolean;
    focus: (inputIndex: number) => void;
    handleInputKeyDown: (event: KeyboardEvent) => void;
    setRef: SetInputRef;
    handleChange: (code: string) => void;
};

type InputRef = HTMLInputElement | null;

const Input = ({
    index,
    slotsCount,
    error,
    processing,
    value,
    handleChange,
    handleInputKeyDown,
    setRef,
    focus,
}: InputProps) => {
    const splittedValue = value.split('');

    const inputRef = useRef<InputRef>(null);

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value: targetValue } = event.target;

        const newValues = [...splittedValue];

        if (/^\d$/.test(targetValue)) {
            newValues[index] = targetValue;

            handleChange(newValues.join(''));
        } else if (/^\d\d$/.test(targetValue) && index !== slotsCount - 1) {
            /*
             * если пользователь хочет ввести вторую цифру в инпут,
             * то переносим ее в следующий инпут
             */

            // eslint-disable-next-line prefer-destructuring
            newValues[index] = targetValue[0];
            // eslint-disable-next-line prefer-destructuring
            newValues[index + 1] = targetValue[1];

            handleChange(newValues.join(''));
        }
    };

    const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        const { key } = event;

        const newValues = [...splittedValue];

        switch (key) {
            case 'Backspace':
            case 'Delete':
                newValues[index] = '';
                handleChange(newValues.join(''));
                break;
            case 'ArrowRight':
                if (index !== slotsCount - 1) {
                    focus(index + 1);
                }
                break;
            case 'ArrowLeft':
                if (index !== 0) {
                    focus(index - 1);
                }
                break;
            case 'Home':
                focus(0);
                break;
            case 'End':
                focus(slotsCount - 1);
                break;
        }

        handleInputKeyDown(event);
    };

    const handleRef = (node: HTMLInputElement) => {
        inputRef.current = node;

        setRef({ node, index });
    };

    // const [focused] = useFocus('keyboard', inputRef);

    return (
        <input
            className={cn(styles.input, {
                [styles.hasError]: Boolean(error),
                // [styles.focused]: focused,
            })}
            disabled={processing}
            value={splittedValue[index] || ''}
            onChange={onChange}
            onKeyDown={onInputKeyDown}
            ref={handleRef}
        />
    );
};

export const CodeInput = forwardRef<HTMLInputElement, CodeInputProps>(
    (
        { processing, value = '', slotsCount, error, handleInputKeyDown, handleChange, className },
        ref,
    ) => {
        const inputs = useRef<HTMLInputElement[]>([]);

        useImperativeHandle(ref, () => inputs.current[0]);

        const prevValue = usePrevious(value) || '';

        const focus = useCallback((index: number) => {
            const input = inputs.current[index];

            if (input) {
                input.focus();
                input.setSelectionRange(1, 1);
            }
        }, []);

        const setRef: SetInputRef = useCallback(({ node, index }) => {
            inputs.current[index] = node;
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

        useEffect(() => {
            if (value.length > prevValue.length && value.length < slotsCount) {
                /**
                 * Если value.length увеличился - ставим фокус на следующем инпуте
                 */
                const nextInputIndex = value.length;

                focus(nextInputIndex);
            } else if (value.length <= prevValue.length && value.length > 0) {
                /**
                 * Если value.length уменьшился - ставим фокус на предыдущем инпуте
                 */
                const nextInputIndex = value.length - 1;

                focus(nextInputIndex);
            }
        }, [value.length, prevValue.length, slotsCount, focus]);

        return (
            <div className={cn(styles.component, className)}>
                {new Array(slotsCount).fill('').map((_, index) => (
                    <Input
                        value={value}
                        index={index}
                        error={error}
                        processing={processing}
                        slotsCount={slotsCount}
                        handleChange={handleChange}
                        handleInputKeyDown={handleInputKeyDown}
                        setRef={setRef}
                        focus={focus}
                        // eslint-disable-next-line react/no-array-index-key
                        key={index}
                    />
                ))}
            </div>
        );
    },
);
