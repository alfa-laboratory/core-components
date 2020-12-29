import React, {
    ChangeEvent,
    FC,
    MutableRefObject,
    useCallback,
    useRef,
    useState,
    KeyboardEventHandler,
    MouseEventHandler,
} from 'react';
import cn from 'classnames';
import { FieldProps } from '@alfalab/core-components-select';
import { FormControl, FormControlProps } from '@alfalab/core-components-form-control';
import { Tag } from '@alfalab/core-components-tag';
import { useFocus } from '@alfalab/hooks';
import { CrossCompactMIcon } from '@alfalab/icons-glyph';

import styles from './index.module.css';

type TagListOwnProps = {
    value?: string;
    handleDeleteTag?: (key: string) => void;
    onInput?: (event: ChangeEvent<HTMLInputElement>) => void;
    inputRef?: MutableRefObject<HTMLInputElement>;
    autocomplete?: boolean;
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
    value,
    autocomplete,
    label,
    valueRenderer,
    onInput,
    handleDeleteTag,
    ...restProps
}) => {
    const [focused, setFocused] = useState(false);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const contentWrapperRef = useRef<HTMLDivElement>(null);

    const [focusVisible] = useFocus(wrapperRef, 'keyboard');
    const [inputFocusVisible] = useFocus(inputRef, 'keyboard');

    const handleFocus = useCallback(() => setFocused(true), []);
    const handleBlur = useCallback(() => setFocused(false), []);

    const handleMouseDown = useCallback(event => {
        event.preventDefault();
    }, []);

    const { onClick, ...restInnerProps } = innerProps;

    const handleClick = useCallback<MouseEventHandler<HTMLDivElement>>(
        event => {
            if (onClick && contentWrapperRef.current) {
                const clickedInsideContent = contentWrapperRef.current.contains(
                    event.target as HTMLDivElement,
                );

                if (!clickedInsideContent || (clickedInsideContent && !open)) {
                    onClick(event);
                }
            }

            if (inputRef.current) {
                inputRef.current.focus();
            }
        },
        [onClick, open],
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

    const filled = Boolean(selectedMultiple.length > 0) || Boolean(value);

    return (
        <div
            ref={wrapperRef}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn(styles.component, styles[size])}
        >
            <FormControl
                {...restProps}
                ref={innerProps.ref}
                className={cn(className, styles.field, {
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
                    {selectedMultiple.map(({ content, key }) => (
                        <Tag key={key} size='xs' checked={true} className={styles.tag}>
                            <span className={styles.tagContentWrap}>
                                {content}
                                <CrossCompactMIcon
                                    onClick={() => {
                                        if (handleDeleteTag) {
                                            handleDeleteTag(key);
                                        }
                                    }}
                                    className={styles.tagCross}
                                />
                            </span>
                        </Tag>
                    ))}

                    {autocomplete && (
                        <input
                            {...restInnerProps}
                            ref={inputRef}
                            value={value}
                            onChange={onInput}
                            className={cn(styles.input, {
                                [styles.focusVisible]: inputFocusVisible,
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
