import React, { ButtonHTMLAttributes, ElementType, useCallback, useContext } from 'react';
import cn from 'classnames';
import { IconButton, IconButtonProps } from '@alfalab/core-components-icon-button';
import { CrossMIcon } from '@alfalab/icons-glyph/CrossMIcon';
import { BaseModalContext } from '@alfalab/core-components-base-modal';

import styles from './index.module.css';

export type CloserProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Размер кнопки
     */
    size?: IconButtonProps['size'];

    /**
     * Иконка
     */
    icon?: ElementType;
};

export const Closer: React.FC<CloserProps> = ({
    className,
    size = 'xs',
    icon = CrossMIcon,
    ...restProps
}) => {
    const { onClose } = useContext(BaseModalContext);

    const handleClick = useCallback(
        event => {
            onClose(event, 'closerClick');
        },
        [onClose],
    );

    return (
        <div className={cn(styles.closer, className)}>
            <IconButton
                size={size}
                className={styles.button}
                aria-label='закрыть'
                onClick={handleClick}
                icon={icon}
                {...restProps}
            />
        </div>
    );
};
