import React, { FC, useCallback, useRef, useState } from 'react';
import cn from 'classnames';
import { ContainerMIcon } from '@alfalab/icons-glyph';
import { preventAndStopEvent } from './utils';

import styles from './index.module.css';

export type DropzoneProps = {
    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Подпись для заглушки
     */
    text?: string;

    /**
     * Состояние ошибки
     */
    error?: boolean;

    /**
     * Позволяет вручную управлять видимостью заглушки
     */
    overlayVisible?: boolean;

    /**
     * Обработчик события 'drop'
     */
    onDrop?: (files: FileList) => void;

    /**
     * Обработчик события 'dragover'
     */
    onDragOver?: (event: React.DragEvent<HTMLElement>) => void;

    /**
     * Обработчик события 'dragleave'
     */
    onDragLeave?: (event: React.DragEvent<HTMLElement>) => void;

    /**
     * Обработчик события 'dragenter'
     */
    onDragEnter?: (event: React.DragEvent<HTMLElement>) => void;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export const Dropzone: FC<DropzoneProps> = ({
    className,
    children,
    text = 'Перетащите файлы',
    error = false,
    overlayVisible = false,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop,
    dataTestId,
}) => {
    const [dragOver, setDragOver] = useState(false);

    const dragCounter = useRef(0);

    const handleDragOver = useCallback(
        (event: React.DragEvent<HTMLElement>) => {
            preventAndStopEvent(event);

            if (onDragOver) {
                onDragOver(event);
            }
        },
        [onDragOver],
    );

    const handleDragEnter = useCallback(
        (event: React.DragEvent<HTMLElement>) => {
            preventAndStopEvent(event);

            setDragOver(true);

            if (onDragEnter) {
                onDragEnter(event);
            }
        },
        [onDragEnter],
    );

    const handleDragLeave = useCallback(
        (event: React.DragEvent<HTMLElement>) => {
            preventAndStopEvent(event);

            dragCounter.current -= 1;

            if (dragCounter.current > 0) return;

            setDragOver(false);

            if (onDragLeave) {
                onDragLeave(event);
            }
        },
        [onDragLeave],
    );

    const handleDrop = useCallback(
        (event: React.DragEvent<HTMLElement>) => {
            preventAndStopEvent(event);

            setDragOver(false);

            if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
                if (onDrop) {
                    onDrop(event.dataTransfer.files);
                }

                event.dataTransfer.clearData();
                dragCounter.current = 0;
            }
        },
        [onDrop],
    );

    return (
        <div
            className={cn(styles.component, className, {
                [styles.dragOver]: dragOver || overlayVisible,
                [styles.error]: error,
            })}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            data-test-id={dataTestId}
        >
            {children}
            <div className={styles.overlay}>
                <ContainerMIcon />
                <span className={styles.text}>{text}</span>
            </div>
        </div>
    );
};
