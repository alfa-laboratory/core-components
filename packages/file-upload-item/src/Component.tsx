import React, { ElementType, MouseEvent, ReactNode, useCallback } from 'react';
import cn from 'classnames';

import { IconButton } from '@alfalab/core-components-icon-button';
import { Link } from '@alfalab/core-components-link';
import { Spinner } from '@alfalab/core-components-spinner';
import { CrossMIcon } from '@alfalab/icons-glyph/CrossMIcon';
import { CheckmarkCircleMIcon } from '@alfalab/icons-glyph/CheckmarkCircleMIcon';
import { AlertCircleMIcon } from '@alfalab/icons-glyph/AlertCircleMIcon';
import { PointerDownMIcon } from '@alfalab/icons-glyph/PointerDownMIcon';
import { ClockMIcon } from '@alfalab/icons-glyph';

import { fileIcon, humanFileSize } from './utils';

import styles from './index.module.css';

export type FileStatuses = 'ERROR' | 'SUCCESS' | 'LOADING' | 'UPLOADING';

export type FileUploadItemProps = {
    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Идентификатор элемента
     */
    id?: string;

    /**
     * Имя файла с расширением
     */
    name?: string;

    /**
     * Размер файла
     */
    size?: string | number;

    /**
     * Дата загрузки файла
     */
    uploadDate?: string;

    /**
     * Ссылка на файл. Если прокидывается этот параметр, то появляется кнопка скачивания
     */
    downloadLink?: string;

    /**
     * Рекомендует браузеру скачивать контент по ссылке.
     * В проп может быть передано рекомендуемое название скачиваемого файла.
     */
    download?: string | true;

    /**
     * Отображение кнопки удаления
     */
    showDelete?: boolean;

    /**
     * Отображение кнопки восстановления
     */
    showRestore?: boolean;

    /**
     * Процент загрузки файла
     */
    uploadPercent?: number;

    /**
     * Статус загрузки файла
     */
    uploadStatus?: FileStatuses;

    /**
     * Сообщение об ошибке
     */
    error?: ReactNode;

    /**
     * Дочерние элементы
     */
    children?: React.ReactNode;

    /**
     * Компонент кастомной иконки
     */
    icon?: ElementType<{ className?: string }>;

    /**
     * Обработчик загрузки файла
     */
    onDownload?: (id: string) => void;

    /**
     * Обработчик удаления файла
     */
    onDelete?: (id: string) => void;

    /**
     * Обработчик восстановления файла
     */
    onRestore?: (id: string) => void;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export const FileUploadItem: React.FC<FileUploadItemProps> = ({
    className,
    children,
    id = '0',
    name = '',
    size,
    icon: Icon = fileIcon(name),
    uploadDate,
    downloadLink,
    download,
    uploadStatus,
    uploadPercent = 0,
    error = uploadStatus === 'ERROR' ? 'Не удалось загрузить файл' : undefined,
    showDelete,
    showRestore,
    onDelete,
    onDownload,
    onRestore,
    dataTestId,
}) => {
    const handleDownload = useCallback(
        (event: MouseEvent<HTMLElement>) => {
            if (onDownload) {
                event.preventDefault();
                onDownload(id);
            }
        },
        [id, onDownload],
    );

    const handleDelete = useCallback(() => {
        if (onDelete) onDelete(id);
    }, [id, onDelete]);

    const handleRestore = useCallback(() => {
        if (onRestore) onRestore(id);
    }, [id, onRestore]);

    const renderIcon = useCallback(() => {
        if (showRestore) {
            return <ClockMIcon className={styles.restoreIcon} />;
        }

        switch (uploadStatus) {
            case 'ERROR':
                return <AlertCircleMIcon className={styles.errorIcon} />;
            case 'SUCCESS':
                return <CheckmarkCircleMIcon className={styles.successIcon} />;
            case 'LOADING':
            case 'UPLOADING':
                return (
                    <div className={styles.spinnerWrapper}>
                        <Spinner visible={true} className={styles.spinner} />
                    </div>
                );
            default: {
                return <Icon className={styles.icon} />;
            }
        }
    }, [showRestore, uploadStatus]);

    const renderInfoSection = useCallback(
        () => (
            <div className={styles.infoSection}>
                <div className={styles.name}>{name}</div>

                {uploadStatus === 'ERROR' && error && (
                    <div className={styles.errorWrapper} role='alert'>
                        {error}
                    </div>
                )}
            </div>
        ),
        [name, uploadStatus, error],
    );

    const showMeta = !showRestore && (!uploadStatus || uploadStatus === 'SUCCESS');
    const showDownload = Boolean(downloadLink) && !showRestore;

    return (
        <div
            className={cn(
                className,
                styles.component,
                uploadStatus && styles[uploadStatus.toLocaleLowerCase()],
            )}
            data-test-id={dataTestId}
        >
            <div className={styles.info}>
                {renderIcon()}

                {renderInfoSection()}

                {children}

                {uploadStatus === 'UPLOADING' && (
                    <span className={styles.uploadPercent}>{`${Math.round(uploadPercent)}%`}</span>
                )}

                {showMeta && (
                    <div className={styles.meta}>
                        {uploadDate && <span key={uploadDate}>{uploadDate}</span>}

                        {size && (
                            <span key={size} className={styles.size}>
                                {humanFileSize(size)}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {showRestore && (
                <Link pseudo={true} className={styles.restore} onClick={handleRestore}>
                    Восстановить
                </Link>
            )}

            {showDownload && (
                <IconButton
                    size='xxs'
                    icon={PointerDownMIcon}
                    className={styles.download}
                    aria-label='скачать'
                    href={downloadLink}
                    onClick={handleDownload}
                    download={download}
                />
            )}

            {showDelete && !showRestore && (
                <IconButton
                    size='xxs'
                    icon={CrossMIcon}
                    onClick={handleDelete}
                    className={styles.delete}
                    aria-label='удалить'
                />
            )}
        </div>
    );
};
