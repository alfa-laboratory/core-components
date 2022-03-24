import React, { FC } from 'react';
import cn from 'classnames';

import styles from './index.module.css';

export type FlagIconProps = {
    /**
     * Код страны из <a href="https://ru.wikipedia.org/wiki/ISO_3166-1_alpha-2" target="_blank">ISO 3166-1 alpha-2</a>
     */
    country?: string;

    /**
     * Дополнительный класс
     */
    className?: string;
};

/**
 * Компонент флага в виде иконки.
 */
export const FlagIcon: FC<FlagIconProps> = ({ country = '', className }) => {
    return <span className={cn(styles.flagIcon, styles[country], className)} />;
};
