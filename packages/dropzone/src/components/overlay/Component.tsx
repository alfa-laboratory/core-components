import React, { FC } from 'react';
import cn from 'classnames';
import { ContainerMIcon } from '@alfalab/icons-glyph/ContainerMIcon';

import styles from './index.module.css';

export type OverlayProps = {
    /**
     * Подпись для заглушки
     */
    text?: string;

    /**
     * Управление видимостью
     */
    visible?: boolean;
};

export const Overlay: FC<OverlayProps> = ({ text = 'Перетащите файлы', visible = false }) => {
    return (
        <div
            className={cn(styles.overlay, {
                [styles.visible]: visible,
            })}
        >
            <ContainerMIcon />
            <span className={styles.text}>{text}</span>
        </div>
    );
};
