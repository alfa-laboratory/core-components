import React, {
    FC,
    useRef,
    useState,
    useEffect,
    ChangeEvent,
    useCallback,
    useLayoutEffect,
    MutableRefObject,
    MouseEventHandler,
    KeyboardEventHandler,
    useMemo,
} from 'react';
import cn from 'classnames';
import { useFocus } from '@alfalab/hooks';
import { FieldProps } from '@alfalab/core-components-select';
import { FormControl, FormControlProps } from '@alfalab/core-components-form-control';
import { TagComponent } from '../../types';
import { Tag as DefaultTag } from '../tag';
import { calculateTotalElementsPerRow } from '../../utils/calculate-collaps-size';
import styles from './index.module.css';

type TagListOwnProps = {
    value?: string;
    handleDeleteTag?: (key: string) => void;
    onInput?: (event: ChangeEvent<HTMLInputElement>) => void;
    inputRef?: MutableRefObject<HTMLInputElement>;
    autocomplete?: boolean;
    collapseTagList?: boolean;
    moveInputToNewLine?: boolean;
    collapsedTagText?: (collapsedCount: number) => string;
    Tag?: TagComponent;
    handleUpdatePopover?: () => void;
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
    collapseTagList,
    moveInputToNewLine,
    collapsedTagText,
    handleUpdatePopover,
    Tag = DefaultTag,
    ...restProps
}) => {
    const [focused, setFocused] = useState(false);
    const [isShowMoreEnabled, setShowMoreEnabled] = useState(false);
    const [visibleElements, setVisibleElements] = useState(1);
    const [inputOnNewLine, setInputOnNewLine] = useState(false);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const contentWrapperRef = useRef<HTMLDivElement>(null);

    const [focusVisible] = useFocus(wrapperRef, 'keyboard');
    const [inputFocusVisible] = useFocus(inputRef, 'keyboard');

    useEffect(() => {
        setVisibleElements(selectedMultiple.length);
    }, [selectedMultiple]);

    useLayoutEffect(() => {
        if (collapseTagList && contentWrapperRef.current) {
            const totalVisibleElements = calculateTotalElementsPerRow(
                contentWrapperRef.current,
                autocomplete && inputRef.current ? inputRef.current : null,
            );
            setVisibleElements(totalVisibleElements);
        }
    }, [collapseTagList, visibleElements, autocomplete]);

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

    const toggleShowMoreLessButton = useCallback(
        event => {
            event.stopPropagation();
            setShowMoreEnabled(value => !value);
            if (handleUpdatePopover) {
                handleUpdatePopover();
            }
        },
        [handleUpdatePopover],
    );

    useEffect(() => {
        /**
         * Если текст не помещается в инпут, то нужно перенести инпут на новую строку.
         */
        if (moveInputToNewLine) {
            if (inputTextIsOverflow() && !inputOnNewLine) {
                setInputOnNewLine(true);
            } else if (value.length === 0) {
                setInputOnNewLine(false);
            }
        }
    }, [value, inputOnNewLine, inputTextIsOverflow, moveInputToNewLine]);

    const collapseTagTitle = useMemo(() => {
        if (isShowMoreEnabled) {
            return 'Свернуть';
        }
        if (collapsedTagText) {
            return collapsedTagText(selectedMultiple.length - visibleElements);
        }
        return `+ ${selectedMultiple.length - visibleElements}`;
    }, [collapsedTagText, isShowMoreEnabled, selectedMultiple.length, visibleElements]);

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
                    {selectedMultiple.map((option, index) =>
                        isShowMoreEnabled || index + 1 <= visibleElements ? (
                            <Tag
                                option={option}
                                key={option.key}
                                handleDeleteTag={handleDeleteTag}
                            />
                        ) : null,
                    )}
                    {visibleElements < selectedMultiple.length && (
                        <Tag
                            id='collapse'
                            onClick={toggleShowMoreLessButton}
                            option={{
                                key: 'collapse',
                                content: collapseTagTitle,
                            }}
                        />
                    )}

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
