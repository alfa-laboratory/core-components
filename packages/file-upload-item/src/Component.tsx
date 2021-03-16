import React, { MouseEvent, useCallback } from 'react';
import cn from 'classnames';

import { IconButton } from '@alfalab/core-components-icon-button';
import { Link } from '@alfalab/core-components-link';
import { Spinner } from '@alfalab/core-components-spinner';
import { CrossMIcon } from '@alfalab/icons-glyph/CrossMIcon';
import { CheckmarkCircleMIcon } from '@alfalab/icons-glyph/CheckmarkCircleMIcon';
import { AlertCircleMIcon } from '@alfalab/icons-glyph/AlertCircleMIcon';

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
     * Ссылка на файл. Если прокидывается этот параметр, то заголовок становится ссылкой
     */
    downloadLink?: string;

    /**
     * Отображение кнопки удаления
     */
    showDelete?: boolean;

    /**
     * Отображение кнопки удаления
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
    error?: string;

    /**
     * Дочерние элементы
     */
    children?: React.ReactNode;

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
    uploadDate,
    downloadLink,
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
        switch (uploadStatus) {
            case 'ERROR':
                return <AlertCircleMIcon className={styles.errorIcon} />;
            case 'SUCCESS':
                return <CheckmarkCircleMIcon className={styles.successIcon} />;
            case 'LOADING':
            case 'UPLOADING':
                return <Spinner visible={true} />;
            default: {
                const Icon = fileIcon(name);
                return <Icon className={styles.icon} />;
            }
        }
    }, [name, uploadStatus]);

    const renderName = useCallback(
        () => (
            <div className={styles.name}>
                {downloadLink ? (
                    <Link pseudo={true} href={downloadLink} onClick={handleDownload}>
                        {name}
                    </Link>
                ) : (
                    name
                )}
            </div>
        ),
        [downloadLink, handleDownload, name],
    );

    const showMeta = !showRestore && (!uploadStatus || uploadStatus === 'SUCCESS');

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

                {renderName()}

                {children}

                {uploadStatus === 'UPLOADING' && <span>{`${Math.round(uploadPercent)}%`}</span>}

                {uploadStatus === 'ERROR' && <span className={styles.error}>{error}</span>}

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
