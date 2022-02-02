import React, { ComponentType, FC, useCallback, useRef, useState } from 'react';
import cn from 'classnames';
import { preventAndStopEvent } from './utils';
import { Overlay as DefaultOverlay, OverlayProps } from './components';

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
     * Заблокированное состояние
     */
    disabled?: boolean;

    /**
     * Состояние ошибки
     */
    error?: boolean;

    /**
     * Растягивать ли компонент на всю ширину
     */
    block?: boolean;

    /**
     * @deprecated(используйте Overlay)
     * Позволяет вручную управлять видимостью заглушки
     */
    overlayVisible?: boolean;

    /**
     * Компонент оверлея
     */
    Overlay?: ComponentType<OverlayProps>;

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
    overlayVisible,
    Overlay = DefaultOverlay,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop,
    block = false,
    disabled,
    dataTestId,
}) => {
    const [dragOver, setDragOver] = useState(false);

    /**
     * При ховере дочерних элементов срабатывает dragLeave, из-за чего пропадает оверлей
     * https://stackoverflow.com/a/21002544
     */
    const dragCounter = useRef(0);

    const handleDragOver = useCallback(
        (event: React.DragEvent<HTMLElement>) => {
            preventAndStopEvent(event);

            if (disabled) return;

            if (onDragOver) {
                onDragOver(event);
            }
        },
        [onDragOver, disabled],
    );

    const handleDragEnter = useCallback(
        (event: React.DragEvent<HTMLElement>) => {
            preventAndStopEvent(event);

            if (disabled) return;

            dragCounter.current += 1;

            setDragOver(true);

            if (onDragEnter) {
                onDragEnter(event);
            }
        },
        [disabled, onDragEnter],
    );

    const handleDragLeave = useCallback(
        (event: React.DragEvent<HTMLElement>) => {
            preventAndStopEvent(event);

            if (disabled) return;

            dragCounter.current -= 1;

            if (dragCounter.current > 0) return;

            setDragOver(false);

            if (onDragLeave) {
                onDragLeave(event);
            }
        },
        [disabled, onDragLeave],
    );

    const handleDrop = useCallback(
        (event: React.DragEvent<HTMLElement>) => {
            preventAndStopEvent(event);

            if (disabled) return;

            setDragOver(false);
            dragCounter.current = 0;

            if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
                if (onDrop) {
                    onDrop(event.dataTransfer.files);
                }

                event.dataTransfer.clearData();
            }
        },
        [disabled, onDrop],
    );

    return (
        <div
            className={cn(styles.component, className, {
                [styles.dragOver]: dragOver,
                [styles.error]: error,
                [styles.block]: block,
                [styles.disabled]: disabled,
            })}
            data-test-id={dataTestId}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            {children}
            {Overlay && <Overlay text={text} visible={Boolean(dragOver || overlayVisible)} />}
        </div>
    );
};
