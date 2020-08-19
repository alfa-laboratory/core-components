import React, {
    InputHTMLAttributes,
    ButtonHTMLAttributes,
    useState,
    useCallback,
    useRef,
} from 'react';
import cn from 'classnames';
import mergeRefs from 'react-merge-refs';
import { Button, ButtonProps } from '@alfalab/core-components-button';
import { ProgressBar } from '@alfalab/core-components-progress-bar';
import { AttachmentSBlackIcon, AttachmentMBlackIcon } from '@alfalab/icons-classic';
import { pluralize } from '@alfalab/utils';
import { truncateFilename } from './utils';

import styles from './index.module.css';

export type AttachProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'value'> & {
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
     * Содержимое поля ввода, указанное по умолчанию. Принимает массив объектов типа File или null.
     */
    value?: File[] | null;

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
            buttonProps,
            className,
            disabled,
            dataTestId,
            id,
            maxFilenameLength,
            multiple,
            noFileText = 'Нет файла',
            progressBarPercent,
            value,
            onChange,
            ...restProps
        },
        ref,
    ) => {
        const [files, setFiles] = useState(value || []);

        const inputRef = useRef<HTMLInputElement>(null);

        const handleInputChange = useCallback(
            (event: React.ChangeEvent<HTMLInputElement>) => {
                if (event.target.files) {
                    setFiles(Array.from(event.target.files));
                }

                if (onChange) {
                    onChange(event);
                }
            },
            [onChange],
        );

        const handleClearClick = useCallback(() => {
            if (inputRef.current) {
                inputRef.current.value = '';
            }

            setFiles([]);
        }, []);

        const Icon = size === 'xs' ? AttachmentSBlackIcon : AttachmentMBlackIcon;

        const statusTextContent =
            files.length === 1 ? (
                truncateFilename(files[0].name, maxFilenameLength)
            ) : (
                <abbr title={files.map(file => file.name).join()}>
                    {files.length} {pluralize(files.length, ...MULTIPLE_TEXTS)}
                </abbr>
            );

        return (
            <div
                className={cn(
                    cn(
                        styles.component,
                        styles[size],
                        {
                            [styles.disabled]: disabled,
                        },
                        className,
                    ),
                )}
            >
                <Button
                    {...buttonProps}
                    size={size}
                    disabled={disabled}
                    view={(buttonProps && buttonProps.view) || 'outlined'}
                    leftAddons={
                        (buttonProps && buttonProps.leftAddons) || (
                            <Icon className={cn(styles.icon)} />
                        )
                    }
                >
                    <span>{buttonContent}</span>

                    <label className={cn(styles.label)} htmlFor={id}>
                        <input
                            {...restProps}
                            className={cn(styles.control)}
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
                </Button>
                {files && files.length > 0 ? (
                    <div className={cn(styles.file)}>
                        <span>{statusTextContent}</span>
                        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                        <button
                            type='button'
                            className={cn(styles.clear)}
                            onClick={handleClearClick}
                        />
                        {progressBarPercent && (
                            <ProgressBar
                                className={cn(styles.progressBar)}
                                value={progressBarPercent}
                                view='negative'
                            />
                        )}
                    </div>
                ) : (
                    <div className={cn(styles.noFile)}>{noFileText}</div>
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
