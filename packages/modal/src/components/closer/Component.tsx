import React, { ButtonHTMLAttributes, ElementType, FC, useCallback, useContext } from 'react';
import cn from 'classnames';
import { IconButton, IconButtonProps } from '@alfalab/core-components-icon-button';
import { CrossHeavyMIcon } from '@alfalab/icons-glyph/CrossHeavyMIcon';

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
     * Размер кнопки
     */
    size?: IconButtonProps['size'];

    /**
     * Иконка
     */
    icon?: ElementType;

    /**
     * Флаг, что модальное окно открыто на весь экран
     */
    fullscreen?: boolean;
};

export const Closer: FC<CloserProps> = ({
    className,
    fullscreen,
    align,
    size = 's',
    icon = CrossHeavyMIcon,
    ...restProps
}) => {
    const { onClose } = useContext(ModalContext);

    const handleClick = useCallback(
        event => {
            onClose(event, 'closerClick');
        },
        [onClose],
    );

    return (
        <IconButton
            size={size}
            className={cn(
                styles.closer,
                className,
                fullscreen && styles.fullscreen,
                align && styles[align],
            )}
            aria-label='закрыть'
            onClick={handleClick}
            icon={icon}
            {...restProps}
        />
    );
};
