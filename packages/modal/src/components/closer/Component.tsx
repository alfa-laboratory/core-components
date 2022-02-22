import React, { ButtonHTMLAttributes, FC, useCallback, useContext } from 'react';
import cn from 'classnames';

import { IconButton } from '@alfalab/core-components-icon-button';
import { CrossMIcon } from '@alfalab/icons-glyph/CrossMIcon';

import { ModalContext } from '../../Context';

import styles from './index.module.css';

export type CloserProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Позиция крестика
     */
    align?: 'left' | 'right';

    /**
     * Флаг, что модальное окно открыто на весь экран
     */
    fullscreen?: boolean;
};

export const Closer: FC<CloserProps> = ({ className, fullscreen, align, ...restProps }) => {
    const { onClose } = useContext(ModalContext);

    const handleClick = useCallback(
        event => {
            onClose(event, 'closerClick');
        },
        [onClose],
    );

    return (
        <IconButton
            icon={CrossMIcon}
            type='button'
            className={cn(
                styles.closer,
                className,
                fullscreen && styles.fullscreen,
                align && styles[align],
            )}
            aria-label='закрыть'
            onClick={handleClick}
            {...restProps}
        />
    );
};
