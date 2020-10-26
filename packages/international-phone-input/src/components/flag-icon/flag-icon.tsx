import React, { forwardRef } from 'react';
import cn from 'classnames';

import styles from './flag-icon.module.css';

export type FlagIconProps = {
    /**
     * Код страны из <a href="https://ru.wikipedia.org/wiki/ISO_3166-1_alpha-2" target="_blank">ISO 3166-1 alpha-2</a>
     */
    country?: string;

    /**
     * Управление наличием тени у компонента
     */
    flat?: boolean;

    /**
     * Размер компонента
     */
    size?: 's' | 'm' | 'l' | 'xl';

    /**
     * Дополнительный класс
     */
    className?: string;
};

/**
 * Компонент флага в виде иконки.
 */
export const FlagIcon = forwardRef<HTMLSpanElement, FlagIconProps>(
    ({ flat = false, size = 'm', country = '', className }, ref) => {
        return (
            <span
                ref={ref}
                className={cn(
                    styles.flagIcon,
                    styles[size],
                    styles[country],
                    {
                        [styles.flat]: flat,
                    },
                    className,
                )}
            />
        );
    },
);
