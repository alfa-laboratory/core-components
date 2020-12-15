import React, {
    useState,
    useCallback,
    useRef,
    FC,
    RefAttributes,
    Fragment,
    forwardRef,
    ReactNode,
} from 'react';

import cn from 'classnames';
import mergeRefs from 'react-merge-refs';
import { Portal } from '@alfalab/core-components-portal';
import { InputProps } from '@alfalab/core-components-input';

import styles from './index.module.css';

export type withSuffixProps = InputProps & {
    /**
     * Дополнительный закрепленный текст справа от основного значения.
     * Например: value='85' suffix=' мес' -> 85 мес
     */
    suffix?: ReactNode;

    /**
     * Дополнительный класс для контейнера с суффиксом
     */
    suffixContainerClassName?: string;
};

export const withSuffix = (Input: FC<InputProps & RefAttributes<HTMLInputElement>>) =>
    forwardRef<HTMLInputElement, withSuffixProps>(
        (
            {
                value,
                defaultValue,
                onChange,
                onClear,
                suffix = '',
                placeholder,
                className,
                disabled,
                suffixContainerClassName,
                ...restProps
            },
            ref,
        ) => {
            const uncontrolled = value === undefined;

            const inputRef = useRef<HTMLInputElement>(null);

            const [stateValue, setStateValue] = useState(defaultValue || '');

            const handleInputChange = useCallback<Required<InputProps>['onChange']>(
                (event, payload) => {
                    if (onChange) {
                        onChange(event, payload);
                    }

                    if (uncontrolled) {
                        setStateValue(payload.value);
                    }
                },
                [onChange, uncontrolled],
            );

            const handleClear = useCallback<Required<InputProps>['onClear']>(
                event => {
                    if (uncontrolled) {
                        setStateValue('');
                    }

                    if (onClear) {
                        onClear(event);
                    }
                },
                [onClear, uncontrolled],
            );

            const getPortalContainer = useCallback(
                // TODO: Изменить сигнатуру getPortalContainer в Portal
                () => (inputRef.current as HTMLElement).parentElement as HTMLElement,
                [],
            );

            const visibleValue = uncontrolled ? stateValue : value;

            return (
                <Fragment>
                    <Input
                        ref={mergeRefs([ref, inputRef])}
                        value={visibleValue}
                        disabled={disabled}
                        onChange={handleInputChange}
                        onClear={handleClear}
                        placeholder={placeholder}
                        className={cn(className, {
                            [styles.suffixVisible]: Boolean(visibleValue),
                            [styles.hasSuffix]: suffix,
                        })}
                        {...restProps}
                    />
                    <Portal getPortalContainer={getPortalContainer}>
                        <div className={cn(styles.suffixContainer, suffixContainerClassName)}>
                            <span className={styles.spacer}>{visibleValue}</span>
                            {suffix && (
                                <div className={cn(styles.suffix, { [styles.disabled]: disabled })}>
                                    {suffix}
                                </div>
                            )}
                        </div>
                    </Portal>
                </Fragment>
            );
        },
    );
