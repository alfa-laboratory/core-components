import React, {
    ChangeEvent,
    FC,
    MutableRefObject,
    useCallback,
    useRef,
    useState,
    KeyboardEventHandler,
    MouseEventHandler,
    useEffect,
} from 'react';
import cn from 'classnames';
import { FieldProps } from '@alfalab/core-components-select';
import { FormControl, FormControlProps } from '@alfalab/core-components-form-control';
import { useFocus } from '@alfalab/hooks';

import styles from './index.module.css';

import { TagComponent } from '../../types';
import { Tag as DefaultTag } from '../tag';

type TagListOwnProps = {
    value?: string;
    handleDeleteTag?: (key: string) => void;
    onInput?: (event: ChangeEvent<HTMLInputElement>) => void;
    inputRef?: MutableRefObject<HTMLInputElement>;
    autocomplete?: boolean;
    Tag?: TagComponent;
};

export const TagList: FC<FieldProps & FormControlProps & TagListOwnProps> = ({
    size = 'l',
    open,
    disabled,
    placeholder,
    selectedMultiple = [],
    Arrow,
    innerProps,
    className,
    fieldClassName,
    value = '',
    autocomplete,
    label,
    valueRenderer,
    onInput,
    handleDeleteTag,
    Tag = DefaultTag,
    ...restProps
}) => {
    const [focused, setFocused] = useState(false);
    const [inputOnNewLine, setInputOnNewLine] = useState(false);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const contentWrapperRef = useRef<HTMLDivElement>(null);

    const [focusVisible] = useFocus(wrapperRef, 'keyboard');
    const [inputFocusVisible] = useFocus(inputRef, 'keyboard');

    const handleFocus = useCallback(() => setFocused(true), []);
    const handleBlur = useCallback(() => setFocused(false), []);

    const inputTextIsOverflow = useCallback(
        () => inputRef.current && inputRef.current.scrollWidth > inputRef.current.clientWidth,
        [],
    );

    const handleMouseDown = useCallback(event => {
        event.preventDefault();
    }, []);

    const { onClick, ...restInnerProps } = innerProps;

    const handleClick = useCallback<MouseEventHandler<HTMLDivElement>>(
        event => {
            if (onClick && contentWrapperRef.current) {
                const eventTarget = event.target as HTMLDivElement;

                const clickedInsideContent =
                    eventTarget !== contentWrapperRef.current &&
                    contentWrapperRef.current.contains(eventTarget);

                if (!clickedInsideContent) {
                    onClick(event);
                }
            }

            if (inputRef.current) {
                inputRef.current.focus();
            }
        },
        [onClick],
    );

    const handleKeyDown = useCallback<KeyboardEventHandler<HTMLInputElement>>(
        event => {
            const lastSelectedTag = selectedMultiple[selectedMultiple.length - 1];

            if (event.key === 'Backspace' && !value && handleDeleteTag && lastSelectedTag) {
                handleDeleteTag(lastSelectedTag.key);
            }
        },
        [handleDeleteTag, selectedMultiple, value],
    );

    useEffect(() => {
        /**
         * Если текст не помещается в инпут, то нужно перенести инпут на новую строку.
         */
        if (inputTextIsOverflow() && !inputOnNewLine) {
            setInputOnNewLine(true);
        } else if (value.length === 0) {
            setInputOnNewLine(false);
        }
    }, [value, inputOnNewLine, inputTextIsOverflow]);

    const filled = Boolean(selectedMultiple.length > 0) || Boolean(value);

    return (
        <div
            ref={wrapperRef}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn(className, styles.component, styles[size])}
        >
            <FormControl
                {...restProps}
                ref={innerProps.ref}
                fieldClassName={cn(fieldClassName, styles.field, {
                    [styles.focusVisible]: focusVisible,
                })}
                block={true}
                size={size}
                focused={open || focused}
                disabled={disabled}
                filled={filled || !!placeholder}
                onMouseDown={handleMouseDown}
                rightAddons={Arrow}
                onClick={handleClick}
                addonsClassName={cn(styles.addons, styles[`addons-size-${size}`])}
                label={label}
                labelClassName={styles.label}
            >
                <div
                    className={cn(styles.contentWrapper, {
                        [styles.hasLabel]: Boolean(label),
                        [styles.hasTags]: selectedMultiple.length > 0,
                    })}
                    ref={contentWrapperRef}
                >
                    {selectedMultiple.map(option => (
                        <Tag key={option.key} option={option} handleDeleteTag={handleDeleteTag} />
                    ))}

                    {autocomplete && (
                        <input
                            {...restInnerProps}
                            autoComplete='off'
                            ref={inputRef}
                            value={value}
                            onChange={onInput}
                            className={cn(styles.input, {
                                [styles.focusVisible]: inputFocusVisible,
                                [styles.block]: inputOnNewLine,
                            })}
                            disabled={disabled}
                            onKeyDown={handleKeyDown}
                            placeholder={filled ? '' : placeholder}
                        />
                    )}

                    {placeholder && !filled && !autocomplete && (
                        <span className={styles.placeholder}>{placeholder}</span>
                    )}
                </div>
            </FormControl>
        </div>
    );
};
