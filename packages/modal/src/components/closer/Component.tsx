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
     * Фиксирует крестик
     */
    sticky?: boolean;

    /**
     * Иконка
     */
    icon?: ElementType;
};

/**
 * @deprecated Компонент только для внутреннего использования. Используйте <Header />
 */
export const Closer: FC<CloserProps> = ({
    className,
    size = 's',
    sticky,
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
        <div
            className={cn(styles.closer, className, {
                [styles.sticky]: sticky,
            })}
        >
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
