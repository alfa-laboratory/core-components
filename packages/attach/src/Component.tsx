import React, {
    InputHTMLAttributes,
    ButtonHTMLAttributes,
    useState,
    useCallback,
    useRef,
    ChangeEvent,
    useEffect,
    MouseEvent,
} from 'react';
import cn from 'classnames';
import mergeRefs from 'react-merge-refs';
import { Button, ButtonProps } from '@alfalab/core-components-button';
import { ProgressBar } from '@alfalab/core-components-progress-bar';
import { KeyboardFocusable } from '@alfalab/core-components-keyboard-focusable';
import { AttachmentSBlackIcon } from '@alfalab/icons-classic/AttachmentSBlackIcon';
import { AttachmentMBlackIcon } from '@alfalab/icons-classic/AttachmentMBlackIcon';
import { pluralize } from '@alfalab/utils';
import { truncateFilename } from './utils';

import styles from './index.module.css';

export type AttachProps = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'size' | 'type' | 'value' | 'defaultValue' | 'onChange' | 'multiple'
> & {
    /**
     * Содержимое кнопки для выбора файла
     */
    buttonContent?: React.ReactNode;

    /**
     * Свойства для кнопки
     */
    buttonProps?: ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Дополнительный класс для блока с файлами
     */
    fileClassName?: string;

    /**
     * Дополнительный класс для блока с подсказкой, когда файл не загружен
     */
    noFileClassName?: string;

    /**
     * Число символов, после которого имя файла будет обрезаться
     */
    maxFilenameLength?: number;

    /**
     * Текст для случая, когда файл не загружен
     */
    noFileText?: string;

    /**
     * Процент выполнения загрузки файла
     */
    progressBarPercent?: number;

    /**
     * Размер компонента
     */
    size?: 'xs' | 's' | 'm' | 'l';

    /**
     * Возможность прикрепления нескольких файлов
     */
    multiple?: boolean;

    /**
     * Содержимое поля ввода. Принимает массив объектов типа File или null.
     */
    value?: File[] | null;

    /**
     * Содержимое поля ввода, указанное по умолчанию. Принимает массив объектов типа File или null.
     */
    defaultValue?: File[] | null;

    /**
     * Обработчик поля ввода
     */
    onChange?: (event: ChangeEvent<HTMLInputElement>, payload: { files: File[] }) => void;

    /**
     * Обработчик нажатия на кнопку очистки
     */
    onClear?: (event: MouseEvent<HTMLButtonElement>) => void;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

const MULTIPLE_TEXTS: [string, string, string] = ['файл', 'файла', 'файлов'];

export const Attach = React.forwardRef<HTMLInputElement, AttachProps>(
    (
        {
            size = 's',
            accept,
            buttonContent = 'Выберите файл',
            buttonProps = {},
            className,
            fileClassName,
            noFileClassName,
            disabled,
            dataTestId,
            id,
            maxFilenameLength,
            multiple,
            noFileText = 'Нет файла',
            progressBarPercent,
            defaultValue,
            value,
            onChange,
            onClear,
            ...restProps
        },
        ref,
    ) => {
        const uncontrolled = value === undefined;

        const [files, setFiles] = useState(defaultValue || []);

        const inputRef = useRef<HTMLInputElement>(null);
        const labelRef = useRef<HTMLLabelElement>(null);
        const buttonRef = useRef<HTMLButtonElement>(null);

        const handleInputChange = useCallback(
            (event: React.ChangeEvent<HTMLInputElement>) => {
                const filesArray = event.target.files ? Array.from(event.target.files) : [];

                if (onChange) {
                    onChange(event, { files: filesArray });
                }

                if (uncontrolled && event.target.files) {
                    setFiles(filesArray);
                }
            },
            [onChange, uncontrolled],
        );

        const handleButtonClick = useCallback(
            event => {
                if (labelRef.current) {
                    labelRef.current.click();
                }
                if (buttonRef.current) {
                    buttonRef.current.focus();
                }

                if (buttonProps.onClick) {
                    buttonProps.onClick(event);
                }
            },
            [buttonProps],
        );

        const handleClearClick = useCallback(
            ev => {
                if (uncontrolled) {
                    if (inputRef.current) {
                        inputRef.current.value = '';
                    }

                    setFiles([]);
                }

                if (onClear) {
                    onClear(ev);
                }
            },
            [onClear, uncontrolled],
        );

        const Icon = size === 'xs' ? AttachmentSBlackIcon : AttachmentMBlackIcon;

        const statusTextContent =
            files.length === 1 ? (
                truncateFilename(files[0].name, maxFilenameLength)
            ) : (
                <abbr title={files.map(file => file.name).join()}>
                    {files.length} {pluralize(files.length, ...MULTIPLE_TEXTS)}
                </abbr>
            );

        useEffect(() => {
            if (!uncontrolled) {
                setFiles(value || []);
            }
        }, [uncontrolled, value]);

        return (
            <div
                className={cn(
                    styles.component,
                    styles[size],
                    {
                        [styles.disabled]: disabled,
                    },
                    className,
                )}
            >
                <Button
                    {...buttonProps}
                    size={size}
                    disabled={disabled}
                    view={(buttonProps && buttonProps.view) || 'outlined'}
                    leftAddons={
                        (buttonProps && buttonProps.leftAddons) || <Icon className={styles.icon} />
                    }
                    onClick={handleButtonClick}
                    ref={buttonRef}
                >
                    <span>{buttonContent}</span>
                </Button>
                <label className={styles.label} htmlFor={id} ref={labelRef}>
                    <input
                        {...restProps}
                        className={styles.control}
                        accept={accept}
                        disabled={disabled}
                        id={id}
                        multiple={multiple}
                        tabIndex={-1}
                        type='file'
                        onChange={handleInputChange}
                        ref={mergeRefs([ref, inputRef])}
                        data-test-id={dataTestId}
                    />
                </label>
                {files && files.length > 0 ? (
                    <div className={cn(styles.file, fileClassName)}>
                        <span>{statusTextContent}</span>
                        <KeyboardFocusable>
                            {(targetRef, focused) => (
                                <button
                                    aria-label='очистить'
                                    type='button'
                                    className={cn(styles.clear, {
                                        [styles.focused]: focused,
                                    })}
                                    onClick={handleClearClick}
                                    ref={targetRef}
                                />
                            )}
                        </KeyboardFocusable>
                        {progressBarPercent && (
                            <ProgressBar
                                className={styles.progressBar}
                                value={progressBarPercent}
                                view='positive'
                            />
                        )}
                    </div>
                ) : (
                    <div className={cn(styles.noFile, noFileClassName)}>{noFileText}</div>
                )}
            </div>
        );
    },
);

/**
 * Для отображения в сторибуке
 */
Attach.defaultProps = {
    size: 's',
    buttonContent: 'Выберите файл',
    noFileText: 'Нет файла',
};
